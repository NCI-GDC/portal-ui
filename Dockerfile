FROM quay.io/ncigdc/nginx-extras:1.10.3-oobleck

RUN rm -v /etc/nginx/sites-enabled/default

COPY build /usr/share/nginx/html
