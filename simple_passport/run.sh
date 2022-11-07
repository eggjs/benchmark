#!/usr/bin/env bash

CSV=`dirname $0`/../stats.csv
REPORT=`dirname $0`/../report.lua
NODE=node@`node -v`

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

function print_head {
  NAME=$1
  TITLE=$2
  PKG=$NAME@`sed -n 's/[ ]*\"version\": \"\([^,]*\)\"[,]*/\1/p' node_modules/$NAME/package.json`
  printf "\"$PKG, $NODE\"," >> $CSV
  printf "\"$TITLE\"," >> $CSV
}

sleep 6
curl 'http://127.0.0.1:7001/'
curl 'http://127.0.0.1:7002/'
curl 'http://127.0.0.1:7003/'
curl 'http://127.0.0.1:7004/'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

sleep 3
echo ""
echo "------- egg1 passport -------"
echo ""
print_head "egg1" "egg1 passport"
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 passport -------"
echo ""
print_head "egg2" "egg2 passport"
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg3 passport -------"
echo ""
print_head "egg3" "egg3 passport"
wrk 'http://127.0.0.1:7003/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg3 passport with worker_threads=1 -------"
echo ""
print_head "egg3" "egg3 passport with worker_threads=1"
wrk 'http://127.0.0.1:7004/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

kill $pid

sleep 8
