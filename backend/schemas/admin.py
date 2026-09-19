from pydantic import BaseModel


class SchoolVoteCount(BaseModel):
    school_id: int
    school_name: str
    color: str
    votes: int


class AdminDashboardResponse(BaseModel):
    voting_open: bool
    total_users: int
    total_votes: int
    users_not_voted: int
    schools: list[SchoolVoteCount]
    
class VotingToggle(BaseModel):
    is_open: bool