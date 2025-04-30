#!/bin/bash
PWD=${pwd}
cd "$PWD/GamerParadise/frontend" && npm run format;
cd "$PWD/GamerParadise/backend" && npm run format;
