#!/bin/sh
cd $1
echo "commiting from $1"
git config --global --add safe.directory $1
git config --global "user.email" "action@github.com"
git config --global "user.name" "GitHub Actions"
git add -A .
git commit -m "$2: updated rollback workflows after deployment"
git push
