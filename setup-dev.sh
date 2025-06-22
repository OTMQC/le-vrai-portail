#!/bin/bash
PYTHON_PATH="/Library/Frameworks/Python.framework/Versions/3.13/bin/python3"
ENV_DIR="env"
if [ ! -d "$ENV_DIR" ]; then
  $PYTHON_PATH -m venv $ENV_DIR
fi
source $ENV_DIR/bin/activate
pip install --upgrade pip
pip install firebase-admin requests
echo "env ok"
