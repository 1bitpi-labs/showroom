import sys
from pathlib import Path

EVALS_DIR = Path(__file__).resolve().parent.parent / "evals"
if str(EVALS_DIR) not in sys.path:
    sys.path.insert(0, str(EVALS_DIR))

from eval_marina_porto import run_evaluation


def test_assets_and_offline_autonomy() -> None:
    res = run_evaluation(write_outputs=False)
    p1 = res["pillars"]["pilar_1_ativos_autonomia"]
    assert p1["score"] == 100.0, f"Pilar 1 falhou: {p1}"


def test_wcag_contrast_and_mobile_contracts() -> None:
    res = run_evaluation(write_outputs=False)
    p2 = res["pillars"]["pilar_2_acessibilidade_mobile"]
    items = p2["items"]
    assert items["wcag_contrast_ratios"]["score"] == 25
    assert items["semantics_keyboard_aria"]["score"] == 25
    assert items["mobile_390px_contracts"]["score"] == 30


def test_slop_ban_and_privacy_contracts() -> None:
    res = run_evaluation(write_outputs=False)
    p3 = res["pillars"]["pilar_3_slop_ban_privacidade"]
    assert p3["score"] == 100.0, f"Pilar 3 falhou: {p3}"


def test_cook_telemetry_and_hsv_bounds() -> None:
    res = run_evaluation(write_outputs=False)
    p4 = res["pillars"]["pilar_4_cook_convergencia_visual"]
    items = p4["items"]
    assert items["cook_rounds_and_extra_coverage"]["score"] == 30
    assert items["hsv_color_telemetry_r05"]["score"] == 30


def test_documentation_consistency_and_links() -> None:
    res = run_evaluation(write_outputs=False)
    p5 = res["pillars"]["pilar_5_documentacao_links"]
    assert p5["score"] == 100.0, f"Pilar 5 falhou: {p5}"
    assert res["gate_status"] == "approved_for_closure_and_presentation"
    assert res["overall_score"] >= 90.0
