FROM nginx:alpine

# Update
RUN apk add --update nodejs git

# Install app dependencies
COPY package.json typings.json bower.json .bowerrc /src/
RUN cd /src; npm install -g bower && bower install --allow-root && npm install

# Bundle app source
COPY . /src
RUN cd /src; GDC_API=https://gdc-api.nci.nih.gov/v0 npm run build

RUN cd /src; mv dist /usr/share/nginx/html

# Clean up
RUN rm -rf /src && apk del nodejs git
