#!/bin/bash

yarn build

yarn prod:server

/bin/sh -c "while sleep 1000; do :; done"
