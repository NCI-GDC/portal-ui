ARG BASE_CONTAINER_REGISTRY=docker.osdc.io/ncigdc
ARG BASE_CONTAINER_VERSION=3.0.0
FROM node:13 as builder
ARG NPM_REGISTRY="https://registry.npmjs.org/"

WORKDIR /portal

COPY . .

ENV REACT_APP_WEBSITE_NAME=GDC \
    REACT_APP_API="https://portal.awg.gdc.cancer.gov/auth/api" \
    REACT_APP_FENCE="https://portal.awg.gdc.cancer.gov/fence/"\
    REACT_APP_GDC_AUTH="https://portal.awg.gdc.cancer.gov/auth/"\
    REACT_APP_AWG_LOGIN_EXPIRY=20 \
    GDC_BASE="/" \
    REACT_APP_AWG=true \
    REACT_APP_IS_AUTH_PORTAL=true \
    # REACT_APP_GDC_DISPLAY_SLIDES=true \
    REACT_APP_SLIDE_IMAGE_ENDPOINT="/auth/api/v0/tile/" \
    NODE_PATH=src/packages \
    npm_config_registry=$NPM_REGISTRY

RUN export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD` && export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`

RUN npm ci
RUN npm run build

FROM ${BASE_CONTAINER_REGISTRY}/nginx-extras:${BASE_CONTAINER_VERSION}

RUN rm -v /etc/nginx/sites-enabled/default

COPY --from=builder /portal/build /usr/share/nginx/html
