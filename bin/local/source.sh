#!/bin/bash

# .env.developmentの環境変数をexportする
if [ -f .env.development ]; then
  echo "Exporting environment variables from .env.development"
  export $(grep -v '^#' .env.development | xargs)
fi
