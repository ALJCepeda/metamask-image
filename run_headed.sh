#!/usr/bin/env sh
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

docker run --rm -it -v $SCRIPT_DIR/src:/mnt/host/src -e WALLET_SEED -e WALLET_PASSWORD metamask npx ts-node src/browser/headed.ts
