rm -rf dist/
rm -f dist.tar.gz
npm run build
tar cvzf dist.tar.gz -C dist .
