"""
Teste de Semântica HTML, Acessibilidade e Parâmetros Mobile
Normas: PIA-DESIGN-STD-001, WCAG 2.2 AA
"""
import re
from pathlib import Path
import pytest

REPO_ROOT = Path(__file__).resolve().parents[3]
PORTAL_DIR = REPO_ROOT / "prototipos" / "cais-portal-os"

@pytest.fixture
def index_html():
    return (PORTAL_DIR / "index.html").read_text(encoding="utf-8")

def test_viewport_meta_tag(index_html):
    """Verifica meta tag de viewport para responsividade mobile-first (390px)."""
    assert '<meta name="viewport"' in index_html
    assert 'content="width=device-width, initial-scale=1.0"' in index_html

def test_doctype_and_lang(index_html):
    """Verifica DOCTYPE HTML5 e atributo de idioma pt-BR."""
    assert index_html.strip().startswith("<!DOCTYPE html>")
    assert '<html lang="pt-BR"' in index_html

def test_critical_semantic_landmarks(index_html):
    """Verifica marcos semânticos primários (header, main, buttons)."""
    assert "<header" in index_html
    assert "<main" in index_html
    assert 'role="dialog"' in index_html or '<dialog' in index_html or 'class="cais-modal"' in index_html

def test_interactive_buttons_accessibility(index_html):
    """Verifica se botões e controles possuem rótulos acessíveis ou texto legível."""
    buttons = re.findall(r'<button[^>]*>(.*?)</button>', index_html, re.DOTALL)
    assert len(buttons) > 0
    for b in buttons:
        clean_text = re.sub(r'<[^>]+>', '', b).strip()
        # Garante que nenhum botão é uma casca vazia sem acessibilidade
        assert len(clean_text) > 0, "Encontrado botão sem texto acessível"

def test_touch_target_dimensions_in_css():
    """Garante que a variável de área de toque mínima de 44px (--cais-hit) é aplicada em app.css."""
    app_css = (PORTAL_DIR / "app.css").read_text(encoding="utf-8")
    assert "var(--cais-hit)" in app_css, "Área de toque mínima (--cais-hit) não encontrada em app.css"

def test_reduced_motion_media_query():
    """Verifica se existe bloco de prefers-reduced-motion para conformidade WCAG."""
    app_css = (PORTAL_DIR / "app.css").read_text(encoding="utf-8")
    assert "@media (prefers-reduced-motion: reduce)" in app_css, "Falta suporte a prefers-reduced-motion"
