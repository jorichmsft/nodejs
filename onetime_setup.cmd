
rem
rem Run this once on a new Windows Containers supporting host to build
rem the required base images into the repository.
rem

rem
rem build node.js base image
rem

cd dockerbuild\nodejs
docker build -t nodejs .  
docker tag nodejs:latest nodejs:4.4.7
cd ..\..

rem
rem build ONBUILD actions for node.js applications against base image
rem

cd dockerbuild\nodejs_onbuild
docker build -t nodejs:onbuild .
cd ..\..
