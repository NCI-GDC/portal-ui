#!/bin/bash
# Copied from tungsten
export REACT_APP_GDC_DISPLAY_SLIDES=true
export REACT_APP_SLIDE_IMAGE_ENDPOINT="https://api.gdc.cancer.gov/tile/"
export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`
export REACT_APP_API="https://api.gdc.cancer.gov/v0/"
export REACT_APP_GDC_AUTH="https://portal.gdc.cancer.gov/auth/"
export GDC_BASE="/"
export ES_HOST="http://elasticsearch.service.consul:9200"
export ES_INDEX_VERSION="gdc-r7"
export REACT_APP_AWG=false
export REACT_APP_IS_AUTH_PORTAL=false
npm run build

