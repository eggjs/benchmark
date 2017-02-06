#!/usr/bin/env bash

WRK_DIR=`dirname $0`/wrk

git clone --depth 1 https://github.com/wg/wrk.git $WRK_DIR
cd $WRK_DIR
make
cd -
