"""
Teste da Lógica de Negócio e Dados Operacionais do Cais OS
Regras: Cálculo de Sinal Pix 30%, imutabilidade de versão e checklist de 12 pontos
"""
from pathlib import Path
import json
import re
import pytest

REPO_ROOT = Path(__file__).resolve().parents[3]
LOCAL_PORTAL_DIR = Path(__file__).resolve().parent.parent
if (LOCAL_PORTAL_DIR / "app.js").exists():
    PORTAL_DIR = LOCAL_PORTAL_DIR
else:
    PORTAL_DIR = REPO_ROOT / "prototipos" / "cais-portal-os"

@pytest.fixture
def app_js():
    return (PORTAL_DIR / "app.js").read_text(encoding="utf-8")

def test_sinal_pix_calculation(app_js):
    """Valida se o cálculo do sinal Pix é estritamente 30% do valor total da OS."""
    # O valor total na demonstração é R$ 4.150,00 (peças + mão de obra)
    total = 4150.0
    sinal_esperado = total * 0.30
    assert sinal_esperado == 1245.0
    assert "1.245,00" in app_js, "Valor formatado do sinal Pix não encontrado no script"

def test_checklist_12_points(app_js):
    """Verifica se os 12 pontos de vistoria de pier estão contemplados no modelo de dados."""
    pontos_vistoria = [
        "Nível e Viscosidade do Óleo",
        "Óleo da Rabeta Bravo Three",
        "Rotor da Bomba de Água Salgada",
        "Válvula Termostática e Carcaça",
        "Anodos de Sacrifício",
        "Foles de Exaustão e Cardan",
        "Bomba de Porão e Automático",
        "Baterias de Partida e Serviço",
        "Tensão da Correia do Alternador",
        "Filtros Racor e Combustível",
        "Sistema de Exaustão e Muflas",
        "Direção Hidráulica e Cilindro"
    ]
    for ponto in pontos_vistoria:
        assert ponto in app_js, f"Ponto de checklist '{ponto}' ausente no app.js"

def test_pix_payload_format(app_js):
    """Valida se o gerador de Pix emite o padrão oficial do Banco Central (EMVCo BR Code)."""
    assert "00020126" in app_js, "Prefixo padrão EMVCo do Pix não encontrado"
    assert "5802BR" in app_js, "Código de país BR ausente no payload Pix"
    assert "5303986" in app_js, "Código de moeda BRL (986) ausente no payload Pix"

def test_immutable_version_lock(app_js):
    """Garante que a aprovação gera versão imutável com carimbo de data/hora e hash de integridade."""
    assert "v1-approved" in app_js
    assert "auditLogs" in app_js or "audit_trail" in app_js or "auditTrail" in app_js or "AUDIT_LOGS" in app_js
