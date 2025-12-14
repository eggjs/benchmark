#!/usr/bin/env bash

DIR=`dirname $0`
CSV=$DIR/../stats.csv
REPORT=$DIR/../report.lua
NODE=node@`node -v`
LOG=$DIR/logs
rm -rf $LOG
mkdir -p $LOG

echo
# koa2
EGG_SERVER_ENV=prod node $NODE_FLAGS $DIR/dispatch.js koa2 7001 2>&1 > $LOG/koa2.log &
koa2_pid=$!
echo "koa2 pid: $koa2_pid"

# egg3
EGG_SERVER_ENV=prod node $NODE_FLAGS $DIR/dispatch.js egg3 7030 false 2>&1 > $LOG/egg3.log &
egg3_pid=$!
echo "egg3 pid: $egg3_pid"

# egg3 with reusePort=true
EGG_SERVER_ENV=prod node $NODE_FLAGS $DIR/dispatch.js egg3 7031 true 2>&1 > $LOG/egg3_reusePort.log &
egg3_reusePort_pid=$!
echo "egg3_reusePort pid: $egg3_reusePort_pid"

# egg3 startMode=worker_threads with reusePort=true
EGG_SERVER_ENV=prod node $NODE_FLAGS $DIR/dispatch.js egg3 7032 true worker_threads 2>&1 > $LOG/egg3_workerThreads_reusePort.log &
egg3_workerThreads_reusePort_pid=$!
echo "egg3_workerThreads_reusePort pid: $egg3_workerThreads_reusePort_pid"

# egg4
EGG_SERVER_ENV=prod node $NODE_FLAGS $DIR/dispatch.js egg4 7040 false 2>&1 > $LOG/egg4.log &
egg4_pid=$!
echo "egg4 pid: $egg4_pid"

sleep 8
# koa2
curl 'http://127.0.0.1:7001/'
# egg3
curl 'http://127.0.0.1:7030/'
curl 'http://127.0.0.1:7031/'
curl 'http://127.0.0.1:7032/'
# egg4
curl 'http://127.0.0.1:7040/'

test `tail -c 1 $CSV` && printf "\n" >> $CSV

function print_head {
  NAME=$1
  TITLE=$2
  PKG=$NAME@`sed -n 's/[ ]*\"version\": \"\([^,]*\)\"[,]*/\1/p' node_modules/$NAME/package.json`
  printf "\"$PKG, $NODE\"," >> $CSV
  printf "\"$TITLE\"," >> $CSV
}

sleep 5
echo ""
echo "------- egg3 hello -------"
echo ""
print_head "egg3" "egg3 hello"
wrk 'http://127.0.0.1:7030/' \
  -d 10 \
  -c 50 \
  -t 4 \
  --latency \
  -s $REPORT

sleep 5
echo ""
echo "------- egg3 hello with reusePort=true -------"
echo ""
print_head "egg3" "egg3 hello with reusePort=true"
wrk 'http://127.0.0.1:7031/' \
  -d 10 \
  -c 50 \
  -t 4 \
  --latency \
  -s $REPORT

sleep 5
echo ""
echo "------- egg3 hello with worker_threads and reusePort=true -------"
echo ""
print_head "egg3" "egg3 hello with worker_threads and reusePort=true"
wrk 'http://127.0.0.1:7032/' \
  -d 10 \
  -c 50 \
  -t 4 \
  --latency \
  -s $REPORT

sleep 5
echo ""
echo "------- egg4 hello -------"
echo ""
print_head "egg4" "egg4 hello"
wrk 'http://127.0.0.1:7040/' \
  -d 10 \
  -c 50 \
  -t 4 \
  --latency \
  -s $REPORT

# # sleep 5
# # echo ""
# # echo "------- egg4 hello with reusePort=true -------"
# # echo ""
# # print_head "egg4" "egg4 hello with reusePort=true"
# # wrk 'http://127.0.0.1:7011/' \
# #   -d 10 \
# #   -c 50 \
# #   -t 4 \
# #   --latency \
# #   -s $REPORT

sleep 5
echo ""
echo "------- koa2 hello -------"
echo ""
print_head "koa2" "koa2 hello"
wrk 'http://127.0.0.1:7001/' \
  -d 10 \
  -c 50 \
  -t 4 \
  --latency \
  -s $REPORT

# sleep 5
# echo ""
# echo "------- egg1 hello -------"
# echo ""
# print_head "egg1" "egg1 hello"
# wrk 'http://127.0.0.1:7003/' \
#   -d 10 \
#   -c 50 \
#   -t 4 \
#   --latency \
#   -s $REPORT

# sleep 5
# echo ""
# echo "------- egg2 hello -------"
# echo ""
# print_head "egg2" "egg2 hello"
# wrk 'http://127.0.0.1:7004/' \
#   -d 10 \
#   -c 50 \
#   -t 4 \
#   --latency \
#   -s $REPORT

kill $koa2_pid $egg3_pid $egg3_reusePort_pid $egg3_workerThreads_reusePort_pid $egg4_pid 2>&1 > $LOG/kill.log || true

sleep 8
