#!/bin/sh
cd $1
echo "commiting from $var"
git config --global "user.email" "action@github.com"
git config --global "user.name" "GitHub Actions"
git add .
git commit -m "Update versions"
git push
