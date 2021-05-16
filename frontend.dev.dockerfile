FROM node:15

WORKDIR "/app"

EXPOSE 80

ENTRYPOINT ["tail", "-f", "/dev/null"]