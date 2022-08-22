ARG registry=docker.osdc.io
FROM node:13 as builder

COPY ./ /portal

WORKDIR /portal

ENV REACT_APP_GDC_DISPLAY_SLIDES=true \
    REACT_APP_SLIDE_IMAGE_ENDPOINT="https://api.gdc.cancer.gov/tile/" \
    REACT_APP_GDC_AUTH="https://portal.gdc.cancer.gov/auth/" \
    REACT_APP_API="https://portal.gdc.cancer.gov/auth/api/v0/" \
    GDC_BASE="/" \
    REACT_APP_WEBSITE_NAME=GDC \
    NODE_PATH=src/packages \
    npm_config_registry="https://nexus.osdc.io/repository/npm-all/"


RUN export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD` && export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`

RUN npm install
RUN npm update @datadog/browser-rum
RUN npm install @types/node@latest
RUN npm install @types/hoist-non-react-statics@latest
RUN npm run build

FROM ${registry}/ncigdc/nginx-extras:2.0.1

RUN rm -v /etc/nginx/sites-enabled/default

COPY --from=builder /portal/build /usr/share/nginx/html
