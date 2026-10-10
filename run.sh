#!/usr/bin/env bash
# MindLens Run Script
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Check if .venv exists
if [ -d ".venv" ]; then
    PYTHON="$DIR/.venv/bin/python"
elif command -v python3 &>/dev/null; then
    PYTHON="python3"
else
    echo "Error: Python 3 not found."
    exit 1
fi

export PYTHONPATH="$DIR"

echo "=========================================================="
echo " Starting MindLens Explainable AI Mental Health Platform"
echo " Access the Web Dashboard at: http://127.0.0.1:8000"
echo " API Docs at: http://127.0.0.1:8000/docs"
echo "=========================================================="

exec "$PYTHON" "$DIR/run.py" "$@"
