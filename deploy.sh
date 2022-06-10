#!/bin/sh     
sudo git pull origin main
sudo yarn install
sudo yarn build
sudo systemctl restart nginx
sudo pm2 restart all