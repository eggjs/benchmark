#!/usr/bin/env bash

export PATH=`dirname $0`/../wrk:$PATH

echo
EGG_SERVER_ENV=prod node $NODE_FLAGS `dirname $0`/dispatch.js $1 &
pid=$!

sleep 6
curl 'http://127.0.0.1:7001/'

sleep 3
echo ""
echo "------- egg passport -------"
echo ""
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 8

kill $pid
