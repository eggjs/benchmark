#!/usr/bin/env bash

CSV=`dirname $0`/../stats.csv
REPORT=`dirname $0`/../report.lua
EGG=egg@`sed -n 's/[ ]*\"version\": \"\([^,]*\)\"[,]*/\1/p' node_modules/egg/package.json`
NODE=node@`node -v`

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

sleep 5
curl 'http://127.0.0.1:7002/' -s | grep 'title'
curl 'http://127.0.0.1:7003/nunjucks' -s | grep 'title'
curl 'http://127.0.0.1:7003/ejs' -s | grep 'title'
curl 'http://127.0.0.1:7004/nunjucks' -s | grep 'title'
curl 'http://127.0.0.1:7004/ejs' -s | grep 'title'
curl 'http://127.0.0.1:7005/nunjucks' -s | grep 'title'
curl 'http://127.0.0.1:7005/ejs' -s | grep 'title'
curl 'http://127.0.0.1:7006/nunjucks' -s | grep 'title'
curl 'http://127.0.0.1:7006/ejs' -s | grep 'title'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

function print_head {
  NAME=$1
  TITLE=$2
  PKG=$NAME@`sed -n 's/[ ]*\"version\": \"\([^,]*\)\"[,]*/\1/p' node_modules/$NAME/package.json`
  printf "\"$PKG, $NODE\"," >> $CSV
  printf "\"$TITLE\"," >> $CSV
}

echo ""
echo "------- koa view -------"
echo ""
print_head "koa" "koa view"
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg1 nunjucks view -------"
echo ""
print_head "egg1" "egg1 nunjucks view"
wrk 'http://127.0.0.1:7003/nunjucks' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg1 ejs view -------"
echo ""
print_head "egg1" "egg1 ejs view"
wrk 'http://127.0.0.1:7003/ejs' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 nunjucks view -------"
echo ""
print_head "egg2" "egg2 nunjucks view"
wrk 'http://127.0.0.1:7004/nunjucks' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 ejs view -------"
echo ""
print_head "egg2" "egg2 ejs view"
wrk 'http://127.0.0.1:7004/ejs' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg3 nunjucks view -------"
echo ""
print_head "egg3" "egg3 nunjucks view"
wrk 'http://127.0.0.1:7005/nunjucks' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg3 ejs view -------"
echo ""
print_head "egg3" "egg3 ejs view"
wrk 'http://127.0.0.1:7005/ejs' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg3 nunjucks view with worker_threads=1 -------"
echo ""
print_head "egg3" "egg3 nunjucks view with worker_threads=1"
wrk 'http://127.0.0.1:7006/nunjucks' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg3 ejs view with worker_threads=1 -------"
echo ""
print_head "egg3" "egg3 ejs view with worker_threads=1"
wrk 'http://127.0.0.1:7006/ejs' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

kill $pid

sleep 8
