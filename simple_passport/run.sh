#!/usr/bin/env bash

CSV=`dirname $0`/../stats.csv
REPORT=`dirname $0`/../report.lua
EGG=egg@`sed -n 's/[ ]*\"version\": \"\([^,]*\)\"[,]*/\1/p' node_modules/egg/package.json`
NODE=node@`node -v`

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

function print_head {
  NAME=$1
  printf "\"$EGG, $NODE\"," >> $CSV
  printf "\"$NAME\"," >> $CSV
}

sleep 6
curl 'http://127.0.0.1:7001/'
curl 'http://127.0.0.1:7001/aa'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

sleep 3
echo ""
echo "------- egg passport -------"
echo ""
print_head "egg passport"
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg passport (Async Await) -------"
echo ""
print_head "egg passport aa"
wrk 'http://127.0.0.1:7001/aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

kill $pid
