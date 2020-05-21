#!/bin/bash
# Copied from tungsten
export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`
export REACT_APP_API="/uat/auth/api/v0/"
export REACT_APP_GDC_AUTH="/auth/"
export REACT_APP_GDC_AUTH_API="/uat/auth/api/v0/"
export REACT_APP_FENCE="https://login.awg.gdc.cancer.gov"
export REACT_APP_AWG=true
export REACT_APP_IS_AUTH_PORTAL=true
unset REACT_APP_DISPLAY_DAVE_CA
npm run build
