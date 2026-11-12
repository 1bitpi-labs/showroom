"""
Teste Automatizado do Harness de Avaliação Quantitativa (Eval) da Visão 2
Normas: PIA-DESIGN-STD-001, PIA-VISUAL-REGRESSION-STD-001, WCAG 2.2 AA
"""
import sys
from pathlib import Path
import pytest

LOCAL_EVAL_DIR = Path(__file__).resolve().parent.parent / "evals"
if LOCAL_EVAL_DIR.exists():
    EVAL_DIR = LOCAL_EVAL_DIR
else:
    REPO_ROOT = Path(__file__).resolve().parents[3]
    EVAL_DIR = REPO_ROOT / "evals" / "cais-portal-os"
sys.path.insert(0, str(EVAL_DIR))

from eval_visao2 import run_evaluation

def test_eval_visao2_quantitative_score():
    """Valida se o score global da Visão 2 atinge o patamar Enterprise Benchmark (>= 95/100)."""
    res = run_evaluation()
    assert res["overall_score"] >= 95.0, f"Score quantitativo abaixo da meta: {res['overall_score']}"
    assert res["grade"] == "A+ (Enterprise Benchmark)"
    
    # Validação de cada pilar individual
    for key, pilar in res["pillars"].items():
        assert pilar["score"] >= 90, f"Pilar {pilar['title']} com score baixo: {pilar['score']}"
