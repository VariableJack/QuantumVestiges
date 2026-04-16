#!/bin/bash
PWD=${pwd}
cd "$PWD/GamerParadise/frontend" && npm install;
cd "$PWD/GamerParadise/backend" && npm install;

cd $PWD
sudo apt install unzip && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install
npm install -g aws-cdk
