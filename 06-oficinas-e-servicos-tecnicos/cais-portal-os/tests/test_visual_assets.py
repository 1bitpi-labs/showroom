"""
Teste de Verificação de Ativos Visuais e Provas de Tela
Norma: PIA-VISUAL-REGRESSION-STD-001 §3 (Conjunto único 390, 768 e 1440)
"""
from pathlib import Path
from PIL import Image
import pytest

LOCAL_MEDIA_DIR = Path(__file__).resolve().parent.parent / "media"
if LOCAL_MEDIA_DIR.exists():
    MEDIA_DIR = LOCAL_MEDIA_DIR
else:
    REPO_ROOT = Path(__file__).resolve().parents[3]
    MEDIA_DIR = REPO_ROOT / "prototipos" / "cais-portal-os" / "media"

def test_triad_viewports_exist():
    """Garante a existência das capturas de evidência nos 3 viewports obrigatórios da norma."""
    mobile = MEDIA_DIR / "cais-mobile-orcamento.png"
    tablet = MEDIA_DIR / "cais-tablet-balcao.png"
    desktop = MEDIA_DIR / "cais-admin-balcao.png"

    assert mobile.exists(), "Falta captura mobile 390px"
    assert tablet.exists(), "Falta captura tablet 768px"
    assert desktop.exists(), "Falta captura desktop 1440px"

    assert mobile.stat().st_size > 10000, "Arquivo mobile corrompido ou vazio"
    assert tablet.stat().st_size > 10000, "Arquivo tablet corrompido ou vazio"
    assert desktop.stat().st_size > 10000, "Arquivo desktop corrompido ou vazio"

def test_viewport_image_dimensions():
    """Valida se as resoluções gravadas correspondem às larguras especificadas na norma."""
    with Image.open(MEDIA_DIR / "cais-mobile-orcamento.png") as img_m:
        assert img_m.width == 390, f"Largura mobile deve ser 390px, obteve {img_m.width}"

    with Image.open(MEDIA_DIR / "cais-tablet-balcao.png") as img_t:
        assert img_t.width == 768, f"Largura tablet deve ser 768px, obteve {img_t.width}"

    with Image.open(MEDIA_DIR / "cais-admin-balcao.png") as img_d:
        assert img_d.width == 1440, f"Largura desktop deve ser 1440px, obteve {img_d.width}"

def test_interactive_modals_screenshots():
    """Garante que os modais pericial e Pix possuem capturas de evidência íntegras."""
    pix_modal = MEDIA_DIR / "cais-modal-pix.png"
    laudo_modal = MEDIA_DIR / "cais-modal-laudo.png"

    assert pix_modal.exists() and pix_modal.stat().st_size > 10000
    assert laudo_modal.exists() and laudo_modal.stat().st_size > 10000

def test_dedicated_persona_views_exist():
    """Valida a existência e integridade das 4 visões reais por perfil e dispositivo."""
    wa = MEDIA_DIR / "cais-mobile-whatsapp.png"
    portal = MEDIA_DIR / "cais-mobile-portal.png"
    pier = MEDIA_DIR / "cais-tablet-pier.png"
    balcao = MEDIA_DIR / "cais-desktop-balcao.png"

    for img_path in [wa, portal, pier, balcao]:
        assert img_path.exists(), f"Falta a captura especializada: {img_path.name}"
        assert img_path.stat().st_size > 10000, f"Arquivo corrompido: {img_path.name}"

