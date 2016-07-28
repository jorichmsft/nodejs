
rem
rem Refresh the application images and container after update.
rem

rem
rem Remove the application container if present, even if already running.
rem

docker rm -f httphello1

rem
rem Remove the image if present
rem

docker rmi httphello

rem
rem Now rebuild the image
rem

cd httphello
docker build -t httphello .
cd ..

rem
rem Now create and launch a new container on the updated application image.
rem

docker run --name httphello1 -p 8080:8080/tcp -it httphello


