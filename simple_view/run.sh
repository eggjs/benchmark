#!/usr/bin/env bash

export PATH=`dirname $0`/../wrk:$PATH
CSV=`dirname $0`/../stats.csv
REPORT=`dirname $0`/../report.lua

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

sleep 5
curl 'http://127.0.0.1:7002/' -s | grep 'title'
curl 'http://127.0.0.1:7003/' -s | grep 'title'
curl 'http://127.0.0.1:7001/nunjucks' -s | grep 'title'
curl 'http://127.0.0.1:7001/ejs' -s | grep 'title'
curl 'http://127.0.0.1:7001/nunjucks-aa' -s | grep 'title'
curl 'http://127.0.0.1:7001/ejs-aa' -s | grep 'title'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

echo ""
echo "------- koa view -------"
echo ""
printf "\"koa view\"," >> $CSV
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- toa view -------"
echo ""
printf "\"toa view\"," >> $CSV
wrk 'http://127.0.0.1:7003/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg nunjucks view -------"
echo ""
printf "\"egg nunjucks view\"," >> $CSV
wrk 'http://127.0.0.1:7001/nunjucks' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg ejs view -------"
echo ""
printf "\"egg ejs view\"," >> $CSV
wrk 'http://127.0.0.1:7001/ejs' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg nunjucks view (Async Await) -------"
echo ""
printf "\"egg nunjucks view (Async Await)\"," >> $CSV
wrk 'http://127.0.0.1:7001/nunjucks-aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg ejs view (Async Await) -------"
echo ""
printf "\"egg ejs view (Async Await)\"," >> $CSV
wrk 'http://127.0.0.1:7001/ejs-aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

kill $pid
