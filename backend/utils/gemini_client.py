import os
import logging
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv(override=True)

api_key = os.getenv("GOOGLE_API_KEY")

async def extract_product_name(img_bytes: bytes) -> str:
    """
    Functions take input the input image and calls the gemini API to prompt and return the product name as shown in the image
    """
    logger.info("Extracting product name from image using Gemini")
    
    client = genai.Client(api_key=api_key)
    
    response = client.models.generate_content(
        model='gemini-2.0-flash-exp',
        contents=[
            types.Part.from_bytes(
                data=img_bytes,
                mime_type='image/heic'
            ),
            "Return the product name shown in the image. Return only the cleaned product name nothing else."
        ]
    )
    
    product_name = response.text.strip()
    logger.info(f"Product name extracted successfully")
    
    return product_name

# ## Test function
# with open('./test.HEIC', 'rb') as f:
#     img_data = f.read()
#     product_name = extract_product_name(img_data)
# print(product_name)
