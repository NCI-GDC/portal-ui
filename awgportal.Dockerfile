FROM jenkins-agent:node as builder

COPY . /portal
WORKDIR /portal


ENV REACT_APP_API="https://portal.awg.gdc.cancer.gov/auth/api"
ENV REACT_APP_GDC_AUTH="https://portal.awg.gdc.cancer.gov/auth/"
ENV REACT_APP_FENCE="https://login.awg.gdc.cancer.gov"
ENV GDC_BASE="/"
ENV REACT_APP_GDC_AUTH_API="https://portal.awg.gdc.cancer.gov/auth/api"
ENV REACT_APP_AWG=true
ENV REACT_APP_IS_AUTH_PORTAL=true

RUN export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD`
RUN export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`

RUN npm run build

FROM quay.io/ncigdc/nginx-extras:1.10.3-redfish

RUN rm -v /etc/nginx/sites-enabled/default

COPY --from=builder build /usr/share/nginx/html
