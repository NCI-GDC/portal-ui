FROM quay.io/ncigdc/nginx-extras:3.0.0

RUN rm -v /etc/nginx/sites-enabled/default

COPY build /usr/share/nginx/html
