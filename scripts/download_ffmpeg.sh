#!/bin/bash

mkdir src-tauri/bin

if [ "$(uname)" == "Darwin" ]; then
    OS="macOS"
    if [ "$(uname -m)" == "arm64" ]; then
        FILENAME="ffmpeg71arm.zip"
        TRIPLES="aarch64-apple-darwin"
    else
        FILENAME="ffmpeg71intel.zip"
        TRIPLES="x86_64-apple-darwin"
    fi
    FFMPEG_URL="https://www.osxexperts.net/$FILENAME"
    curl -O $FFMPEG_URL
    unzip $FILENAME
    mv ffmpeg src-tauri/bin/ffmpeg-$TRIPLES
    rm -rf $FILENAME __MACOSX
elif [ "$(uname)" == "Linux" ]; then
    OS="Linux"
    if [ "$(uname -m)" == "x86_64" ]; then
        FILENAME="ffmpeg-release-amd64-static.tar.xz"
        FFMPEG_URL="https://johnvansickle.com/ffmpeg/releases/$FILENAME"
        TRIPLES="x86_64-unknown-linux-gnu"
        curl -O $FFMPEG_URL
        tar xf $FILENAME
        mv ffmpeg-*-static/ffmpeg src-tauri/bin/ffmpeg-$TRIPLES
        rm -rf ffmpeg-*-static ffmpeg-release-amd64-static.tar.xz
    else
        echo "Unsupported architecture"
        exit 1
    fi
fi
