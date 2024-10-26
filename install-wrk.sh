#!/usr/bin/env bash

[ ! -f wrk/bin/wrk ] && rm -rf wrk && git clone --depth 1 https://github.com/wg/wrk.git && make -j10 -C wrk && mkdir wrk/bin && mv wrk/wrk wrk/bin || true
