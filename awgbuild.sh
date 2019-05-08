#!/bin/bash
# Copied from tungsten
export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`
export REACT_APP_API="https://portal.awg.gdc.cancer.gov/auth/api"
export REACT_APP_GDC_AUTH="https://portal.awg.gdc.cancer.gov/auth/"
export REACT_APP_FENCE="https://login.awg.gdc.cancer.gov"
export GDC_BASE="/"
export REACT_APP_GDC_AUTH_API="https://portal.awg.gdc.cancer.gov/auth/api"
export REACT_APP_AWG=true
export REACT_APP_IS_AUTH_PORTAL=true
npm run build
