#!/bin/bash
# usage: shot.sh Page.dc.html  -> copies out/ to project, screenshots to qa/a/
S=@WORK@
P=$S/canvas
cp "$S/dsn/out/$1" "$P/$1"
(curl -s -o /dev/null http://localhost:8765/ || (cd $P && setsid nohup python3 -m http.server 8765 >/dev/null 2>&1 &)) ; sleep 0.5
cd $S/qa && NODE_PATH=$(npm root -g) node full.js "$1" "" it
