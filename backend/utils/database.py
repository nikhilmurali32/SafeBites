"""
Database utilities for reading and writing JSON data files
"""
import json
import os
from typing import Dict, List, Optional, Any
from pathlib import Path
from config import settings

# Ensure data directory exists
DATA_DIR = Path(settings.data_dir)
DATA_DIR.mkdir(exist_ok=True)

USERS_FILE = DATA_DIR / "users.json"
SCANS_FILE = DATA_DIR / "scans.json"


def read_json_file(file_path: Path, default: Any = None) -> Any:
    """Read JSON file, return default if file doesn't exist"""
    if not file_path.exists():
        return default if default is not None else {}
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        print(f"Error reading {file_path}: {e}")
        return default if default is not None else {}


def write_json_file(file_path: Path, data: Any) -> bool:
    """Write data to JSON file"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except IOError as e:
        print(f"Error writing {file_path}: {e}")
        return False


# User operations
def get_user(user_id: str) -> Optional[Dict]:
    """Get user by ID"""
    users = read_json_file(USERS_FILE, {})
    return users.get(user_id)


def create_or_update_user(user_data: Dict) -> Dict:
    """Create or update user"""
    users = read_json_file(USERS_FILE, {})
    user_id = user_data.get('id')
    if not user_id:
        raise ValueError("User ID is required")
    
    existing_user = users.get(user_id, {})
    
    # Preserve existing preferences if not provided in update
    user = {
        **existing_user,
        **user_data,
        'id': user_id,
        'createdAt': existing_user.get('createdAt') or user_data.get('createdAt'),
        'scans': existing_user.get('scans', []),
        # Preserve existing preferences if new ones aren't provided
        'allergies': user_data.get('allergies') if 'allergies' in user_data else existing_user.get('allergies'),
        'dietGoals': user_data.get('dietGoals') if 'dietGoals' in user_data else existing_user.get('dietGoals'),
        'avoidIngredients': user_data.get('avoidIngredients') if 'avoidIngredients' in user_data else existing_user.get('avoidIngredients'),
    }
    users[user_id] = user
    write_json_file(USERS_FILE, users)
    return user


def update_user_preferences(user_id: str, preferences: Dict) -> Optional[Dict]:
    """Update user preferences"""
    users = read_json_file(USERS_FILE, {})
    user = users.get(user_id)
    if not user:
        return None
    
    # Update preferences - handle both None and empty list cases
    if 'allergies' in preferences:
        user['allergies'] = preferences['allergies'] if preferences['allergies'] else []
    if 'dietGoals' in preferences:
        user['dietGoals'] = preferences['dietGoals'] if preferences['dietGoals'] else []
    if 'avoidIngredients' in preferences:
        user['avoidIngredients'] = preferences['avoidIngredients'] if preferences['avoidIngredients'] else []
    
    users[user_id] = user
    write_json_file(USERS_FILE, users)
    return user


# Scan operations
def get_user_scans(user_id: str, limit: Optional[int] = None) -> List[Dict]:
    """Get scans for a user"""
    scans = read_json_file(SCANS_FILE, {})
    user_scans = scans.get(user_id, [])
    if limit:
        return user_scans[:limit]
    return user_scans


def add_user_scan(user_id: str, scan_data: Dict) -> Dict:
    """Add a scan for a user"""
    from datetime import datetime
    
    scans = read_json_file(SCANS_FILE, {})
    if user_id not in scans:
        scans[user_id] = []
    
    # Add scan to beginning (most recent first)
    scan = {
        **scan_data,
        'id': scan_data.get('id') or f"scan_{user_id}_{len(scans[user_id])}",
        'timestamp': scan_data.get('timestamp') or datetime.utcnow().isoformat() + 'Z',
    }
    scans[user_id].insert(0, scan)
    
    write_json_file(SCANS_FILE, scans)
    return scan


def get_user_stats(user_id: str) -> Optional[Dict]:
    """Get statistics for a user"""
    user_scans = get_user_scans(user_id)
    if not user_scans:
        return {
            'totalScans': 0,
            'todayScans': 0,
            'safeToday': 0,
            'riskyToday': 0,
            'averageScore': 0,
        }
    
    from datetime import datetime
    
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    
    today_scans = []
    for scan in user_scans:
        try:
            # Handle both ISO format with and without Z
            timestamp_str = scan['timestamp'].replace('Z', '')
            if '+' in timestamp_str:
                timestamp_str = timestamp_str.split('+')[0]
            scan_date = datetime.fromisoformat(timestamp_str)
            if scan_date >= today_start:
                today_scans.append(scan)
        except (ValueError, KeyError):
            continue
    
    safe_today = sum(1 for scan in today_scans if scan.get('isSafe', False))
    risky_today = len(today_scans) - safe_today
    
    total_score = sum(scan.get('safetyScore', 0) for scan in user_scans)
    avg_score = int(total_score / len(user_scans)) if user_scans else 0
    
    return {
        'totalScans': len(user_scans),
        'todayScans': len(today_scans),
        'safeToday': safe_today,
        'riskyToday': risky_today,
        'averageScore': avg_score,
    }

