#!/bin/bash
# Copied from tungsten
export REACT_APP_GDC_DISPLAY_SLIDES=true
export REACT_APP_SLIDE_IMAGE_ENDPOINT="/auth/api/v0/tile/"
export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`
export REACT_APP_API="/auth/api/v0/"
export REACT_APP_GDC_AUTH="/auth/"
export GDC_BASE="/v1"
export PUBLIC_URL="/v1"
export NODE_ENV=production
export REACT_APP_COMMIT_HASH=$TRAVIS_COMMIT
unset REACT_APP_AWG_TOKEN_EXPIRY
unset REACT_APP_AWG
unset REACT_APP_FENCE
unset REACT_APP_IS_AUTH_PORTAL
npm run build
