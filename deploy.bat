@echo off
echo === Adding all changes to Git ===
git init
git remote add origin https://github.com/mosin11/moneytrackr.git
git add .

echo === Committing changes ===
git commit -m "Initial commit of MoneyTrackr project"

echo === Pushing to origin master ===
git push -u origin master

echo === Renaming branch from master to main ===
git branch -m master main

echo === Building the app ===
npm run build

echo === Deploying the app ===
npm run deploy

echo === ✅ Deployment Complete ===
pause
