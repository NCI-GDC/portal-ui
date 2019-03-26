FROM nginx:stable-alpine

RUN rm -v /etc/nginx/conf.d/default.conf

COPY build /usr/share/nginx/html
