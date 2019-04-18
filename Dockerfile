FROM quay.io/ncigdc/nginx-extras:latest

RUN rm -v /etc/nginx/conf.d/default.conf

COPY build /usr/share/nginx/html
