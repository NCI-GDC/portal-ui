#!/bin/bash
# Copied from tungsten
export REACT_APP_GDC_DISPLAY_SLIDES=true
export REACT_APP_SLIDE_IMAGE_ENDPOINT="https://gdc-portal-staging.datacommons.io/auth/tile/"
export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`
export REACT_APP_API="https://gdc-portal-staging.datacommons.io/auth/api/v0/"
export REACT_APP_GDC_AUTH="https://gdc-portal-staging.datacommons.io/auth"
export GDC_BASE="/"
export NODE_ENV=production
export REACT_APP_COMMIT_HASH=$TRAVIS_COMMIT
export REACT_APP_IS_CDAVE_DEV=true
export REACT_APP_DISPLAY_CDAVE=true
unset REACT_APP_AWG
unset REACT_APP_IS_AUTH_PORTAL
npm run build
