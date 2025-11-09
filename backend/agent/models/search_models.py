from pydantic import BaseModel
from typing import List

class WebSearchInput(BaseModel):
    """
    Input Schema for Web Search Agent. Takes product name as input.
    """
    product_name: str

class IngredientSchema(BaseModel):
    """
    Ingredient Schema for one ingredient
    """
    name: str
    description: str

class WebSearchResult(BaseModel):
    """
    Output Schema for Web Search Agent. Returns a List of ingredients found in the product with their descriptions.
    """
    List_of_ingredients: List[IngredientSchema]

