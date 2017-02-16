#!/usr/bin/env bash

export PATH=`dirname $0`/../wrk:$PATH

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

sleep 5
curl 'http://127.0.0.1:7002/' -s | grep 'title'
curl 'http://127.0.0.1:7003/' -s | grep 'title'
curl 'http://127.0.0.1:7001/' -s | grep 'title'
curl 'http://127.0.0.1:7001/aa' -s | grep 'title'

echo ""
echo "------- koa view -------"
echo ""
wrk 'http://127.0.0.1:7002/' \
  -d 10 \
  -c 50 \
  -t 8

sleep 3
echo ""
echo "------- toa view -------"
echo ""
wrk 'http://127.0.0.1:7003/' \
  -d 10 \
  -c 50 \
  -t 8

sleep 3
echo ""
echo "------- egg view -------"
echo ""
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 8

sleep 3
echo ""
echo "------- egg async-await view -------"
echo ""
wrk 'http://127.0.0.1:7001/aa' \
  -d 10 \
  -c 50 \
  -t 8

kill $pid
