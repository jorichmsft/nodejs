
rem
rem Run the application from the created image.
rem

docker run --name httphello1 -p 8080:8080/tcp -it httphello

rem start iexplore.exe http://localhost:8080
