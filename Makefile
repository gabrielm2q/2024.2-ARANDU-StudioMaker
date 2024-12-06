.PHONY: build
build:
	docker compose build

.PHONY: start
start:
	docker compose up

.PHONY: run
run:
	docker compose up --build

.PHONY: stop
stop:
	docker compose down