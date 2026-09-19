from datetime import datetime

from pydantic import BaseModel, ConfigDict


class VotingSettingsResponse(BaseModel):
    id: int
    is_open: bool
    starts_at: datetime | None
    ends_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
    
class VotingSettingsUpdate(BaseModel):
    is_open: bool
    starts_at: datetime | None = None
    ends_at: datetime | None = None