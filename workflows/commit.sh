#!/bin/sh
cd $1
echo "commiting from $1"
git config --global --add safe.directory $1
git config --global "user.email" "action@github.com"
git config --global "user.name" "GitHub Actions"
git add .
git commit -m "Update versions"
git push
