FROM node

WORKDIR "/app"

EXPOSE 3000

ENTRYPOINT ["tail", "-f", "/dev/null"]