#!/usr/bin/env bash

export PATH=`dirname $0`/../wrk:$PATH
CSV=`dirname $0`/../stats.csv
REPORT=`dirname $0`/../report.lua

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

sleep 5
curl 'http://127.0.0.1:7002/'
curl 'http://127.0.0.1:7003/'
curl 'http://127.0.0.1:7001/'
curl 'http://127.0.0.1:7001/aa'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

echo ""
echo "------- koa hello -------"
echo ""
printf "\"koa hello\"," >> $CSV
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- toa hello -------"
echo ""
printf "\"toa hello\"," >> $CSV
wrk 'http://127.0.0.1:7003/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg hello -------"
echo ""
printf "\"egg hello\"," >> $CSV
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

sleep 3
echo ""
echo "------- egg hello (Async Await) -------"
echo ""
printf "\"egg hello (Async Await)\"," >> $CSV
wrk 'http://127.0.0.1:7001/aa' \
  -d 10 \
  -c 50 \
  -t 8 \
  -s $REPORT

kill $pid
