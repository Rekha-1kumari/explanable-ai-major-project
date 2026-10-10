#!/usr/bin/env python3
"""
Application Launcher for MindLens Explainable AI Mental Health Platform.
Unified runner for the combined project.
"""

import sys
import os
from pathlib import Path

# Set root directory in sys.path and environment
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))
os.environ["PYTHONPATH"] = str(ROOT_DIR)

import uvicorn

def main():
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    
    print("=" * 65)
    print("  MindLens: Explainable AI Mental Health Classification")
    print(f"  Server starting at: http://{host}:{port}")
    print("=" * 65)
    
    uvicorn.run(
        "api.main:app",
        host=host,
        port=port,
        reload=False,
        log_level="info"
    )

if __name__ == "__main__":
    main()
