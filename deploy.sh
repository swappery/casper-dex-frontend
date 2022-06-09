#!/bin/sh     
git pull
yarn install
yarn build
cd ..
sudo systemctl restart nginx
sudo pm2 restart all