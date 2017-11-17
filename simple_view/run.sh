#!/usr/bin/env bash

CSV=`dirname $0`/../stats.csv
REPORT=`dirname $0`/../report.lua
EGG=egg@`sed -n 's/[ ]*\"version\": \"\([^,]*\)\"[,]*/\1/p' node_modules/egg/package.json`
NODE=node@`node -v`

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

sleep 5
curl 'http://127.0.0.1:7001/' -s | grep 'title'
curl 'http://127.0.0.1:7002/' -s | grep 'title'
curl 'http://127.0.0.1:7003/nunjucks' -s | grep 'title'
curl 'http://127.0.0.1:7003/ejs' -s | grep 'title'
curl 'http://127.0.0.1:7003/nunjucks-aa' -s | grep 'title'
curl 'http://127.0.0.1:7003/ejs-aa' -s | grep 'title'
curl 'http://127.0.0.1:7004/nunjucks' -s | grep 'title'
curl 'http://127.0.0.1:7004/ejs' -s | grep 'title'
curl 'http://127.0.0.1:7004/nunjucks-aa' -s | grep 'title'
curl 'http://127.0.0.1:7004/ejs-aa' -s | grep 'title'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

function print_head {
  NAME=$1
  printf "\"$EGG, $NODE\"," >> $CSV
  printf "\"$NAME\"," >> $CSV
}

echo ""
echo "------- koa1 view -------"
echo ""
print_head "koa1 view"
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

echo ""
echo "------- koa2 view -------"
echo ""
print_head "koa2 view"
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg1 nunjucks view -------"
echo ""
print_head "egg1 nunjucks view"
wrk 'http://127.0.0.1:7003/nunjucks' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg1 ejs view -------"
echo ""
print_head "egg1 ejs view"
wrk 'http://127.0.0.1:7003/ejs' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg1 nunjucks view (Async Await) -------"
echo ""
print_head "egg1 nunjucks view aa"
wrk 'http://127.0.0.1:7003/nunjucks-aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg1 ejs view (Async Await) -------"
echo ""
print_head "egg1 ejs view aa"
wrk 'http://127.0.0.1:7003/ejs-aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 nunjucks view -------"
echo ""
print_head "egg2 nunjucks view"
wrk 'http://127.0.0.1:7004/nunjucks' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 ejs view -------"
echo ""
print_head "egg2 ejs view"
wrk 'http://127.0.0.1:7004/ejs' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 nunjucks view (Async Await) -------"
echo ""
print_head "egg2 nunjucks view aa"
wrk 'http://127.0.0.1:7004/nunjucks-aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg2 ejs view (Async Await) -------"
echo ""
print_head "egg2 ejs view aa"
wrk 'http://127.0.0.1:7004/ejs-aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

kill $pid
