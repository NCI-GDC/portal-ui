#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

docker build -t portal-ui .

# If this is not a pull request, update the branch's docker tag.
if [ $TRAVIS_PULL_REQUEST = 'false' ]; then
  docker tag portal-ui quay.io/ncigdc/portal-ui:${TRAVIS_BRANCH/\//_} \
    && docker push quay.io/ncigdc/portal-ui:${TRAVIS_BRANCH/\//_};

  # If this commit has a tag, use on the registry too.
  if ! test -z $TRAVIS_TAG; then
    docker tag portal-ui quay.io/ncigdc/portal-ui:${TRAVIS_TAG} \
      && docker push quay.io/ncigdc/portal-ui:${TRAVIS_TAG};
  fi
fi