import json
from agents import function_tool
from dotenv import load_dotenv

load_dotenv(override=True)
import os

mcp_params = {
    "command": "npx",
    "args": ["-y", "mcp-memory-libsql"],
    "env": {
        "LIBSQL_URL": "file:./data/user_preferences.db",
    }
}


DB_PATH = os.getenv("DB_PATH", "data/")

@function_tool
async def write_to_db(filename: str, data: str) -> str:
    """Load existing JSON file and append new data to it."""
    file_path = os.path.join(DB_PATH, filename)
    
    # Load existing data
    with open(file_path, 'r') as f:
        existing_data = json.load(f)
    
    # Parse and append new data
    existing_data.append(json.loads(data))
    
    # Save back to file
    with open(file_path, 'w') as f:
        json.dump(existing_data, f, indent=4)
    
    return file_path