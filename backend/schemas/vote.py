from pydantic import BaseModel


class VoteStatusResponse(BaseModel):
    has_voted: bool
    voted_school_code: str | None
    own_school_id: int | None


class VoteCountResponse(BaseModel):
    school_id: int
    school_code: str
    school_name: str
    color: str
    vote_count: int

    class Config:
        from_attributes = True