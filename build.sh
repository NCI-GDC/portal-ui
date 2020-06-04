#!/bin/bash

# Base URL of the portal deployment.
# To assume the portal is deployed at the root of some domain, use "/".
# Note that the "homepage" in package.json also affects some static files.
export GDC_BASE="/"

# Base URLs for various links and APIs. These are usually relative to
# GDC_BASE, but can be overridden if appropriate for the deployment.
export REACT_APP_API="${GDC_BASE}auth/api/v0/"
export REACT_APP_GDC_AUTH="${GDC_BASE}auth/"
export REACT_APP_GDC_AUTH_API="${GDC_BASE}auth/api/v0/"
export REACT_APP_SLIDE_IMAGE_ENDPOINT="${GDC_BASE}auth/api/v0/tile/"
unset REACT_APP_FENCE

export REACT_APP_LEGACY_PORTAL="${GDC_BASE}legacy-archive"
export REACT_APP_SUBMISSION_PORTAL="${GDC_BASE}submission"

export REACT_APP_GDC_DISPLAY_SLIDES=true
export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`
export NODE_ENV=production
export REACT_APP_COMMIT_HASH=$TRAVIS_COMMIT
export REACT_APP_DISPLAY_DAVE_CA=true
unset REACT_APP_AWG
unset REACT_APP_IS_AUTH_PORTAL

npm run build
