FROM quay.io/ncigdc/nginx-extras:1.1.0

RUN rm -v /etc/nginx/sites-enabled/default

COPY build /usr/share/nginx/html
