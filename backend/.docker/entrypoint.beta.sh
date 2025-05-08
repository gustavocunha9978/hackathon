#!/bin/bash

yarn beta:build

yarn beta:server

/bin/sh -c "while sleep 1000; do :; done"
