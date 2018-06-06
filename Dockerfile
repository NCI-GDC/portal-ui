FROM nginx:stable-alpine

RUN rm -v /etc/nginx/conf.d/default.conf

COPY infra/nginx.conf /etc/nginx/conf.d/nginx.conf

COPY build /usr/share/nginx/html
