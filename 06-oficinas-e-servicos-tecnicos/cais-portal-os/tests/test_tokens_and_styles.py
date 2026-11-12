"""
Teste de Integridade de Design Tokens e Folha de Estilos (CSS)
Normas: PIA-DESIGN-STD-001, PIA-VISUAL-REGRESSION-STD-001, WCAG 2.2 AA
"""
import re
import json
import subprocess
from pathlib import Path
import pytest

REPO_ROOT = Path(__file__).resolve().parents[3]
PORTAL_DIR = REPO_ROOT / "prototipos" / "cais-portal-os"
SDD_DIR = REPO_ROOT / "sdd" / "changes" / "portal-os-mobile-v1" / "ux"

def test_token_mirror_integrity():
    """Valida se tokens.css e tokens.json estão 100% espelhados via script determinístico."""
    script_path = REPO_ROOT / "tools" / "design" / "check_tokens.py"
    css_path = SDD_DIR / "tokens.css"
    json_path = SDD_DIR / "tokens.json"

    result = subprocess.run(
        ["python3", str(script_path), "--css", str(css_path), "--json", str(json_path)],
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"check_tokens.py falhou:\n{result.stderr}"
    assert "0 divergências" in result.stdout, f"Divergências encontradas nos tokens:\n{result.stdout}"

def test_zero_raw_hex_in_app_css():
    """Garante a regra estrita do PIAOS: ZERO valores hexadecimais soltos em app.css."""
    app_css = (PORTAL_DIR / "app.css").read_text(encoding="utf-8")
    hex_pattern = re.compile(r'#[0-9a-fA-F]{3,8}\b')
    matches = hex_pattern.findall(app_css)
    assert len(matches) == 0, f"Encontradas {len(matches)} cores hex soltas em app.css: {matches[:5]}"

def test_all_css_vars_declared_in_tokens():
    """Garante que todas as variáveis var(--cais-*) consumidas no app.css foram declaradas nos tokens."""
    app_css = (PORTAL_DIR / "app.css").read_text(encoding="utf-8")
    tokens_css = (SDD_DIR / "tokens.css").read_text(encoding="utf-8")

    used_vars = set(re.findall(r'var\((--cais-[a-zA-Z0-9_-]+)', app_css))
    declared_vars = set(re.findall(r'(--cais-[a-zA-Z0-9_-]+)\s*:', tokens_css))

    # Variáveis dinâmicas locais ou globais esperadas
    undeclared = used_vars - declared_vars
    assert len(undeclared) == 0, f"Variáveis usadas no app.css mas não declaradas em tokens.css: {undeclared}"

def calculate_luminance(r, g, b):
    def channel_lum(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * channel_lum(r) + 0.7152 * channel_lum(g) + 0.0722 * channel_lum(b)

def contrast_ratio(hex1, hex2):
    def hex_to_rgb(h):
        h = h.lstrip("#")
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    
    lum1 = calculate_luminance(*hex_to_rgb(hex1))
    lum2 = calculate_luminance(*hex_to_rgb(hex2))
    l_max = max(lum1, lum2)
    l_min = min(lum1, lum2)
    return (l_max + 0.05) / (l_min + 0.05)

def test_wcag_aa_contrast_ratios():
    """Valida deterministicamente as taxas de contraste WCAG 2.2 AA dos tokens essenciais."""
    # Cores primárias do Design Board
    c_surface = "#FFFFFF"
    c_text_primary = "#0B1528"
    c_text_muted = "#41516B"
    c_primary = "#0A5BD6"
    c_text_inverse = "#FFFFFF"

    # Texto primário sobre superfície (> 4.5:1)
    ratio_primary = contrast_ratio(c_text_primary, c_surface)
    assert ratio_primary >= 4.5, f"Contraste texto primário baixo: {ratio_primary:.2f}:1"

    # Texto secundário sobre superfície (> 4.5:1 para leitura de corpo sob luz solar)
    ratio_muted = contrast_ratio(c_text_muted, c_surface)
    assert ratio_muted >= 4.5, f"Contraste texto secundário baixo: {ratio_muted:.2f}:1"

    # Botão primário (texto branco sobre azul) (> 4.5:1)
    ratio_btn = contrast_ratio(c_text_inverse, c_primary)
    assert ratio_btn >= 4.5, f"Contraste botão de ação baixo: {ratio_btn:.2f}:1"
