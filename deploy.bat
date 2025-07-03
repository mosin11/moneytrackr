@echo off
echo === Adding all changes to Git ===

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/mosin11/moneytrackr.git
git push -u origin main

echo === ✅ Deployment Complete ===
pause
