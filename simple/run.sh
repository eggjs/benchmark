#!/usr/bin/env bash

export PATH=`dirname $0`/../wrk:$PATH

echo
EGG_SERVER_ENV=prod node `dirname $0`/dispatch.js $1 &
pid=$!

sleep 3
curl 'http://127.0.0.1:7001/'
curl 'http://127.0.0.1:7002/'
curl 'http://127.0.0.1:7003/'

echo "------- egg hello -------"
echo ""
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 8

sleep 3
echo "------- koa hello -------"
echo ""
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8

sleep 3
echo "------- toa hello -------"
echo ""
wrk 'http://127.0.0.1:7003/' \
  -d 10 \
  -c 50 \
  -t 8

kill $pid
