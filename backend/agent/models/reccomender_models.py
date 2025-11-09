from pydantic import BaseModel
from typing import List


class Reccomendations(BaseModel):
    product_name: str
    health_score: str
    reason: str

class ReccomenderResult(BaseModel):
    recommendations: List[Reccomendations]