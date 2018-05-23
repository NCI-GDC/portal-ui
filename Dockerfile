FROM node:9

WORKDIR /build

COPY package.json package-lock.json ./ 
RUN npm install

COPY .git .git/
COPY __mocks__ __mocks__/
COPY data data/
COPY public public/
COPY src src/
COPY jsconfig.json .* ./
RUN ls -lah . 
RUN npm run build

FROM nginx:stable-alpine
WORKDIR /portal-ui
COPY --from=0 /build/build /portal-ui
COPY infra/nginx.conf /etc/nginx/conf.d/portal-ui.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
      && ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["nginx", "-g", "daemon off;"]
