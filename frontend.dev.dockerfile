FROM node

WORKDIR "/app"

EXPOSE 80

ENTRYPOINT ["tail", "-f", "/dev/null"]