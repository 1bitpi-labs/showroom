#!/usr/bin/env python3
"""Verifica o espelho design/tokens.css <-> design/tokens.json (W3C DTCG). Só stdlib.

Direção: tokens.css é a FONTE EM USO (linkado pelo design-board.html, copiado no mapa-geral,
base do tailwind.preset.js e do protótipo pibit-holograma). tokens.json é o espelho de intercâmbio.

Como o JSON declara o par: cada token espelhado tem, em `$extensions."br.com.1bitpi"`:
  cssVar    nome da custom property (ex.: "--bp-tide")
  cssScope  "root" (padrão, bloco :root) ou "dark" (bloco [data-theme="dark"])
  cssValue  (opcional) texto CSS literal, quando o DTCG não consegue expressar o valor
            (clamp(), ângulo de gradiente, filtro blur, lista de sombras sem camadas...)
  jsonOnly  (em vez de cssVar) motivo pelo qual o token só existe no JSON. É a lista de
            exceções: cada uma é contada e impressa; token sem cssVar e sem jsonOnly é erro.

Verificações (bidirecionais):
  1. toda custom property --* declarada no CSS (por escopo) é reivindicada por exatamente um token;
  2. todo cssVar do JSON existe no CSS, no escopo declarado;
  3. valores iguais após resolver var(...) no escopo e {referências} do DTCG;
  4. gradientes: ângulo/stops conferidos contra as camadas DTCG quando o JSON as traz;
  5. escopo desconhecido no CSS com custom properties (ex.: [data-style=...]) é erro, não é ignorado.

Saída: 0 = sem divergência; 1 = divergência; 2 = erro de leitura.
Uso: python3 tools/design/check_tokens.py [--css design/tokens.css] [--json design/tokens.json]
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

EXT = "br.com.1bitpi"
ESCOPOS = {":root": "root", '[data-theme="dark"]': "dark"}


# ----------------------------------------------------------------------------- CSS
def parse_css(texto: str):
    """Retorna ({escopo: {var: valor_cru}}, [erros]). Só olha blocos de primeiro nível."""
    texto = re.sub(r"/\*.*?\*/", "", texto, flags=re.S)
    escopos: dict[str, dict[str, str]] = {"root": {}, "dark": {}}
    erros: list[str] = []
    i, n = 0, len(texto)
    while i < n:
        j = texto.find("{", i)
        if j < 0:
            break
        seletor = " ".join(texto[i:j].split())
        prof, k = 1, j + 1
        while k < n and prof:
            prof += {"{": 1, "}": -1}.get(texto[k], 0)
            k += 1
        corpo = texto[j + 1:k - 1]
        i = k
        if seletor.startswith("@"):  # @media, @keyframes: sem tokens
            continue
        decls = [d for d in split_top(corpo, ";") if d.strip().startswith("--")]
        if not decls:
            continue
        esc = ESCOPOS.get(seletor)
        if esc is None:
            erros.append(f"escopo CSS não suportado com custom properties: {seletor!r} "
                         f"({len(decls)} declaração(ões)); o espelho cobre só {sorted(ESCOPOS)}")
            continue
        for d in decls:
            nome, _, valor = d.partition(":")
            nome = nome.strip()
            if nome in escopos[esc]:
                erros.append(f"{nome} declarada mais de uma vez no escopo {esc}")
            escopos[esc][nome] = " ".join(valor.split())
    return escopos, erros


def split_top(s: str, sep: str):
    out, atual, prof = [], [], 0
    for ch in s:
        if ch == "(":
            prof += 1
        elif ch == ")":
            prof -= 1
        if ch == sep and prof == 0:
            out.append("".join(atual))
            atual = []
        else:
            atual.append(ch)
    out.append("".join(atual))
    return out


def resolve_vars(valor: str, ctx: dict[str, str], pilha=()):
    def sub(m):
        nome = m.group(1)
        if nome in pilha:
            raise ValueError(f"ciclo em var({nome})")
        if nome not in ctx:
            raise KeyError(nome)
        return resolve_vars(ctx[nome], ctx, pilha + (nome,))
    return re.sub(r"var\(\s*(--[\w-]+)\s*\)", sub, valor)


def canon(v: str) -> str:
    v = " ".join(str(v).lower().split())
    v = re.sub(r"\s*,\s*", ",", v)
    v = re.sub(r"\(\s+", "(", v)
    v = re.sub(r"\s+\)", ")", v)
    v = re.sub(r"(?<![\w.])0px\b", "0", v)
    v = re.sub(r"(?<![\w.])\.(\d)", r"0.\1", v)
    v = re.sub(r"(\d+(?:\.\d+)?)s\b", lambda m: _ms(m) if not m.group(0).endswith("ms") else m.group(0), v)
    return v


def _ms(m):
    ms = float(m.group(1)) * 1000
    return f"{int(ms) if ms == int(ms) else ms}ms"


# ----------------------------------------------------------------------------- JSON
def tokens_json(d, caminho=()):
    for k, v in d.items():
        if k.startswith("$"):
            continue
        if isinstance(v, dict) and "$value" in v:
            yield ".".join(caminho + (k,)), v
        elif isinstance(v, dict):
            yield from tokens_json(v, caminho + (k,))


def resolve_ref(valor, todos, pilha=()):
    if isinstance(valor, str):
        m = re.fullmatch(r"\{([^{}]+)\}", valor.strip())
        if m:
            alvo = m.group(1)
            if alvo in pilha:
                raise ValueError(f"ciclo em {{{alvo}}}")
            if alvo not in todos:
                raise KeyError(alvo)
            return resolve_ref(todos[alvo]["$value"], todos, pilha + (alvo,))
    return valor


def num(x):
    return f"{x:g}" if isinstance(x, (int, float)) else str(x)


def render_camada(c, todos):
    cor = resolve_ref(c["color"], todos)
    partes = (["inset"] if c.get("inset") else []) + [c["offsetX"], c["offsetY"], c["blur"], c["spread"], cor]
    return " ".join(partes)


def render(tok, todos) -> str:
    """Valor DTCG -> texto CSS (referências resolvidas)."""
    tipo = tok.get("$type")
    val = resolve_ref(tok["$value"], todos)
    if tipo == "shadow":
        camadas = val if isinstance(val, list) else [val]
        return ", ".join(render_camada(c, todos) for c in camadas)
    if tipo == "cubicBezier":
        return "cubic-bezier(" + ", ".join(num(x) for x in val) + ")"
    if tipo == "fontFamily":
        return ", ".join(val)
    if isinstance(val, list):
        return ", ".join(str(resolve_ref(x, todos)) for x in val)
    return num(val)


def canon_sombra(css: str) -> str:
    """box-shadow: completa cada camada para 4 comprimentos (o CSS omite o espalhamento 0)."""
    saida = []
    for camada in split_top(css, ","):
        partes = re.findall(r"[^\s(]+(?:\([^)]*\))?", camada.strip())
        inset = "inset" in partes
        comp = [x for x in partes if re.fullmatch(r"-?[\d.]+(px)?", x)]
        cor = [x for x in partes if x not in comp and x != "inset"]
        while len(comp) < 4:
            comp.append("0")
        saida.append(" ".join((["inset"] if inset else []) + comp + cor))
    return canon(",".join(saida))


def familia(s: str):
    return [p.strip().strip('"\'') .lower() for p in split_top(s, ",")]


def gradiente_partes(css: str):
    m = re.fullmatch(r"linear-gradient\((.*)\)", css.strip(), flags=re.S)
    if not m:
        return None
    itens = [x.strip() for x in split_top(m.group(1), ",")]
    angulo = itens[0] if re.match(r"^-?[\d.]+deg$|^to ", itens[0]) else None
    stops = itens[1:] if angulo else itens
    out = []
    for s in stops:
        mm = re.match(r"^(.*?)(?:\s+([\d.]+)%)?$", s)
        out.append((canon(mm.group(1)), None if mm.group(2) is None else float(mm.group(2))))
    n = len(out)
    for idx, (cor, pos) in enumerate(out):  # posições omitidas: distribuição uniforme (regra CSS)
        if pos is None:
            out[idx] = (cor, 100.0 * idx / (n - 1) if n > 1 else 0.0)
    return angulo, out


def main() -> int:
    raiz = Path(__file__).resolve().parents[2]
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--css", default=str(raiz / "design/tokens.css"))
    ap.add_argument("--json", default=str(raiz / "design/tokens.json"))
    a = ap.parse_args()
    try:
        css_txt = Path(a.css).read_text(encoding="utf-8")
        dados = json.loads(Path(a.json).read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        print(f"erro de leitura: {e}", file=sys.stderr)
        return 2

    escopos, erros = parse_css(css_txt)
    ctx = {"root": dict(escopos["root"]), "dark": {**escopos["root"], **escopos["dark"]}}
    todos = dict(tokens_json(dados))
    reivindicados: dict[tuple[str, str], str] = {}
    json_only: list[tuple[str, str]] = []
    comparados = 0

    for caminho, tok in todos.items():
        ext = (tok.get("$extensions") or {}).get(EXT, {})
        var, esc = ext.get("cssVar"), ext.get("cssScope", "root")
        if not var:
            if ext.get("jsonOnly"):
                json_only.append((caminho, ext["jsonOnly"]))
            else:
                erros.append(f"{caminho}: sem cssVar e sem jsonOnly (declare o par ou a exceção)")
            continue
        if esc not in ctx:
            erros.append(f"{caminho}: cssScope inválido {esc!r}")
            continue
        chave = (esc, var)
        if chave in reivindicados:
            erros.append(f"{var} [{esc}] reivindicada por {reivindicados[chave]} e {caminho}")
            continue
        reivindicados[chave] = caminho
        if var not in escopos[esc]:
            erros.append(f"{caminho}: {var} não existe no CSS no escopo {esc}")
            continue
        try:
            css_res = canon(resolve_vars(escopos[esc][var], ctx[esc]))
            if "cssValue" in ext:
                esperado = canon(resolve_vars(ext["cssValue"], ctx[esc]))
                base = "cssValue"
            else:
                esperado = canon(render(tok, todos))
                base = "$value"
            if tok.get("$type") == "fontFamily":
                igual = familia(css_res) == familia(esperado)
            elif tok.get("$type") == "shadow":
                igual = canon_sombra(css_res) == canon_sombra(esperado)
            else:
                igual = css_res == esperado
            if not igual:
                erros.append(f"{caminho} ({var} [{esc}]): CSS={css_res!r} != JSON {base}={esperado!r}")
            # gradiente: camadas DTCG precisam bater com o CSS
            if tok.get("$type") == "gradient" and isinstance(tok["$value"], list):
                gp = gradiente_partes(css_res)
                if gp is None:
                    erros.append(f"{caminho}: gradiente não é linear-gradient(...) no CSS")
                else:
                    _, stops_css = gp
                    stops_js = [(canon(str(resolve_ref(s["color"], todos))), round(s["position"] * 100, 4))
                                for s in tok["$value"]]
                    stops_c = [(c, round(p, 4)) for c, p in stops_css]
                    if stops_js != stops_c:
                        erros.append(f"{caminho}: stops DTCG {stops_js} != CSS {stops_c}")
            comparados += 1
        except (KeyError, ValueError) as e:
            erros.append(f"{caminho} ({var} [{esc}]): referência não resolvida: {e}")

    for esc, decls in escopos.items():
        for var in decls:
            if (esc, var) not in reivindicados:
                erros.append(f"{var} [{esc}] existe no CSS e não tem token no JSON")

    n_css = sum(len(v) for v in escopos.values())
    print(f"CSS: {n_css} custom properties ({len(escopos['root'])} em :root, {len(escopos['dark'])} em [data-theme=\"dark\"])")
    print(f"JSON: {len(todos)} tokens; {len(reivindicados)} espelhados; {len(json_only)} só-JSON (exceções declaradas); {comparados} valores comparados")
    for caminho, motivo in json_only:
        print(f"  jsonOnly {caminho}: {motivo}")
    if erros:
        print(f"\nDIVERGÊNCIAS: {len(erros)}")
        for e in erros:
            print(f"  - {e}")
        return 1
    print("\n0 divergências")
    return 0


if __name__ == "__main__":
    sys.exit(main())
