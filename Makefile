# LOCAL_IP := $(shell ipconfig getifaddr en0)

all:
	make docker-start

docker-build:
	docker-compose -f docker-compose.dev.yml build

docker-start:
	docker-compose -f docker-compose.dev.yml up --detach

docker-stop:
	docker-compose -f docker-compose.dev.yml down

docker-attach-api:
	docker-compose -f docker-compose.dev.yml exec api bash

docker-attach-frontend:
	docker-compose -f docker-compose.dev.yml exec frontend bash

install-dependencies:
	make api-install-dependencies; \
	make frontend-install-dependencies

api-install-dependencies:
	docker-compose -f docker-compose.dev.yml exec api npm i

frontend-install-dependencies:
	docker-compose -f docker-compose.dev.yml exec api npm i