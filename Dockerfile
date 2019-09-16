FROM quay.io/ncigdc/nginx-extras:1.10.3-redfish

RUN rm -v /etc/nginx/sites-enabled/default

COPY build /usr/share/nginx/html
