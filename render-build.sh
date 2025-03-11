#!/bin/bash
apt-get update && apt-get install -y python3 python3-pip
npm install
npm run build
