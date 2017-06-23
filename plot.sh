#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

UNAME=`uname`
ARCH="unknown"
if [[ "$UNAME" == 'Linux' ]]; then
   ARCH='linux-x64'
elif [[ "$UNAME" == 'Darwin' ]]; then
   ARCH='darwin-x64'
fi

echo "Benchmarking against v7.x..."

nvm install 7
npm test
mv stats.csv plot/all.csv

echo "Benchmarking against v8.x..."

nvm install 8
npm test
tail -n +2 stats.csv >> plot/all.csv

function benchmark() {
  TYPE=$1
  echo "Benchmarking against $TYPE..."

  mkdir -p tmp
  echo "Downloading $TYPE index.json..."
  curl -o tmp/index.json https://nodejs.org/download/$TYPE/index.json

  VER=`sed -n 's/{\"version\":\"\([^,]*\)\",.*/\1/p' tmp/index.json | head -n 1`
  VER_URL="https://nodejs.org/download/$TYPE/$VER/node-$VER-$ARCH.tar.gz"
  echo "Downloading node-$VER-$ARCH.tar.gz..."
  curl -o tmp/$TYPE.tar.gz $VER_URL

  mkdir -p tmp/$TYPE
  tar zxf tmp/$TYPE.tar.gz -C tmp/$TYPE
  PATH=`pwd`/tmp/$TYPE/node-$VER-$ARCH/bin:$PATH node -p "process.versions"

  PATH=`pwd`/tmp/$TYPE/node-$VER-$ARCH/bin:$PATH npm test
  tail -n +2 stats.csv >> plot/all.csv
}

benchmark rc
benchmark nightly
benchmark v8-canary

rm -r tmp/*
