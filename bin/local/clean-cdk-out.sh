#!/bin/bash

# cdk.outディレクトリ直下のassetと名前のつくディレクトリを削除する
for dir in cdk.out/asset*; do
  if [[ -d "$dir" ]]; then
    rm -rf "$dir"
  fi
done