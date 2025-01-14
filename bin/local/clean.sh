#!/bin/bash

# 実行ディレクトリ直下のassetと名前のつくディレクトリを削除する
for dir in ./asset*; do
  if [[ -d "$dir" ]]; then
    rm -rf "$dir"
  fi
done
