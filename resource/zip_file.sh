#!/bin/sh

echo "=> zip -q $1 $2"

DIST_PATH="${$2%/*}"
ITEM="${$2##*/}"

cd "$DIST_PATH" || exit 1

zip -rq $1 "$ITEM"
