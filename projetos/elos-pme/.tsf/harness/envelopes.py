from typing import Literal
from pydantic import BaseModel, ConfigDict, Field
class EnvelopeBase(BaseModel):
    model_config = ConfigDict(extra='forbid')
    status: Literal['success', 'fail']
    summary: str
    artifacts: list[str] = Field(default_factory=list)
    notes_for_next_agent: str = ''
class BuildOutput(EnvelopeBase):
    changed_files: list[str] = Field(default_factory=list)
    commit_message: str = ''
class ReviewOutput(EnvelopeBase):
    findings: list[str] = Field(default_factory=list)
    verdict: Literal['approve', 'reject']
class PlanOutput(EnvelopeBase):
    tasks: list[str]
    acceptance_refs: list[str]
