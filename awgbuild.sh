#!/bin/bash
# Copied from tungsten
# export REACT_APP_GDC_DISPLAY_SLIDES=true
export REACT_APP_SLIDE_IMAGE_ENDPOINT="/auth/api/v0/tile/"
export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`
export REACT_APP_API="https://portal.awg.gdc.cancer.gov/auth/api"
export REACT_APP_FENCE="https://portal.awg.gdc.cancer.gov/fence/"
export REACT_APP_GDC_AUTH="https://portal.awg.gdc.cancer.gov/auth/"
# export AWG_TOKEN_EXPIRY=5
export GDC_BASE="/"
export REACT_APP_AWG=true
export REACT_APP_IS_AUTH_PORTAL=true
npm run build
