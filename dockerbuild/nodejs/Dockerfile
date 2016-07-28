FROM windowsservercore

ENV NPM_CONFIG_LOGLEVEL info  

RUN powershell -Command "wget -Uri https://nodejs.org/dist/v4.4.7/node-v4.4.7-x64.msi -OutFile nodejs.msi -UseBasicParsing"

RUN msiexec.exe /q /i nodejs.msi

CMD [ "node" ]  
