@echo off
echo === Adding all changes to Git ===

git init
git remote add origin https://github.com/mosin11/moneytrackr.git
git add .
git commit -m "added loading states and date search"
echo === 🌿 Setting branch to '%BRANCH%' ===
git branch -M %BRANCH%
git branch -M main

git push -u origin main
echo === 🚀 Pushing to GitHub (%BRANCH%) ===
git push -u origin %BRANCH% --force
echo === ✅ Deployment Complete ===
echo === Deploying to GitHub Pages ===
call npm run deploy
pause
