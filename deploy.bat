@echo off
echo === Adding all changes to Git ===

git init
git add .
git commit -m "user based auth added"
echo === 🌿 Setting branch to '%BRANCH%' ===
git branch -M %BRANCH%
git branch -M main
git remote add origin https://github.com/mosin11/moneytrackr.git
git push -u origin main
echo === 🚀 Pushing to GitHub (%BRANCH%) ===
git push -u origin %BRANCH% --force
echo === ✅ Deployment Complete ===
echo === Deploying to GitHub Pages ===
call npm run deploy
pause
