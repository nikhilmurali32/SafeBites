from pydantic import BaseModel
from typing import List


class IngredientScoreSchema(BaseModel):
    """
    Output Schema for Scorer Models. Returns a score between 0 and 1.
    """
    ingredient_name: str
    safety_score: str # Score "low", "medium", "high"
    reasoning: str

class ScorerResult(BaseModel):
    """
    Output Schema for Scorer Models. Returns a list of ingredient scores.
    """
    ingredient_scores: List[IngredientScoreSchema]
    overall_score: float # score between 0 an 10, higher is better

