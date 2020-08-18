FROM node:13 as builder

WORKDIR /portal

COPY ./ /portal

ENV REACT_APP_WEBSITE_NAME=GDC \
    REACT_APP_API="https://portal.awg.gdc.cancer.gov/auth/api" \
    REACT_APP_GDC_AUTH="https://portal.awg.gdc.cancer.gov/auth/"\
    REACT_APP_FENCE="https://login.awg.gdc.cancer.gov"\
    GDC_BASE="/" \
    REACT_APP_GDC_AUTH_API="https://portal.awg.gdc.cancer.gov/auth/api" \
    REACT_APP_AWG=true \
    REACT_APP_IS_AUTH_PORTAL=true \
    REACT_APP_GDC_DISPLAY_SLIDES=true \
    REACT_APP_SLIDE_IMAGE_ENDPOINT="/auth/api/v0/tile/" \
    NODE_PATH=src/packages

RUN export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD` && export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`

RUN npm install
RUN npm run build

FROM quay.io/ncigdc/nginx-extras:1.10.3-redfish

RUN rm -v /etc/nginx/sites-enabled/default

COPY --from=builder /portal/build /usr/share/nginx/html
