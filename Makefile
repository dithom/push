# LOCAL_IP := $(shell ipconfig getifaddr en0)

all:
	make docker-start

docker-build:
	@echo '\n\033[1m# Building docker images ...\033[0m\n'; \
	docker-compose -f docker-compose.dev.yml build

docker-start:
	@echo '\n\033[1m# Starting docker containers ...\033[0m\n'; \
	docker-compose -f docker-compose.dev.yml up --detach

docker-stop:
	@echo '\n\033[1m# Stopping docker containers ...\033[0m\n'; \
	docker-compose -f docker-compose.dev.yml down

docker-ssh-api:
	docker-compose -f docker-compose.dev.yml exec api bash

docker-ssh-frontend:
	docker-compose -f docker-compose.dev.yml exec frontend bash

install-dependencies:
	@echo '\n\033[1m# 1/2 Installing api dependencies ...\033[0m\n'; \
	make api-install-dependencies; \
	echo '\n\033[1m# 2/2 Installing frontend dependencies ...\033[0m\n'; \
	make frontend-install-dependencies

api-install-dependencies:
	docker-compose -f docker-compose.dev.yml exec api npm i

frontend-install-dependencies:
	docker-compose -f docker-compose.dev.yml exec api npm i