FROM node:15

WORKDIR "/app"

EXPOSE 3000

ENTRYPOINT ["tail", "-f", "/dev/null"]