This builds the base image with nodejs + npm

cd nodejs
docker build -t nodejs .
docker tag nodejs:latest node:4.4.7
