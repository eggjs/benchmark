#!/usr/bin/env bash

CSV=`dirname $0`/../stats.csv
REPORT=`dirname $0`/../report.lua
NODE=node@`node -v`

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

sleep 5
curl 'http://127.0.0.1:7002/'
curl 'http://127.0.0.1:7003/'
curl 'http://127.0.0.1:7004/'
curl 'http://127.0.0.1:7005/'
curl 'http://127.0.0.1:7006/'
curl 'http://127.0.0.1:8080/'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

function print_head {
  NAME=$1
  TITLE=$2
  PKG=$NAME@`sed -n 's/[ ]*\"version\": \"\([^,]*\)\"[,]*/\1/p' node_modules/$NAME/package.json`
  printf "\"$PKG, $NODE\"," >> $CSV
  printf "\"$TITLE\"," >> $CSV
}

echo ""
echo "------- koa hello -------"
echo ""
print_head "koa" "koa hello"
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg1 hello -------"
echo ""
print_head "egg1" "egg1 hello"
wrk 'http://127.0.0.1:7003/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 hello -------"
echo ""
print_head "egg2" "egg2 hello"
wrk 'http://127.0.0.1:7004/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg3 hello -------"
echo ""
print_head "egg3" "egg3 hello"
wrk 'http://127.0.0.1:7005/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

# sleep 3
# echo ""
# echo "------- egg3 hello with worker_threads=1 -------"
# echo ""
# print_head "egg3" "egg3 hello with worker_threads=1"
# wrk 'http://127.0.0.1:7006/' \
#   -d 10 \
#   -c 50 \
#   -t 8 \
#   -s $REPORT

sleep 3
echo ""
echo "------- egg3 hello with worker_threads=4 -------"
echo ""
print_head "egg3" "egg3 hello with worker_threads=4"
wrk 'http://127.0.0.1:8080/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

kill $pid

sleep 8
