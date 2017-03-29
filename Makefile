VERSION := $(shell git rev-parse HEAD)

all: glide deps webpack bindata test lint run

glide:
ifeq ($(shell command -v glide),)
	@echo "start installing glide"
	curl https://glide.sh/get | sh
else
	@echo "glide is already installed"
endif

deps: glide
	glide install
	go get -u github.com/jteeuwen/go-bindata/...
	go get -u github.com/elazarl/go-bindata-assetfs/...
	go get -u github.com/golang/lint/golint
	npm install

watch:
	NODE_ENV="development" DEBUG="trunks:*" ./node_modules/.bin/webpack -d --progress --watch

webpack:
	./node_modules/.bin/webpack -p --progress

bindata:
	go-bindata-assetfs -o server/bindata_assetfs.go -pkg server assets/*

test:
	go test -v -cover ./server
	npm run test

lint:
	golint ./server/...
	./node_modules/.bin/eslint --ext .js --ext .jsx ./client

run:
	go run main.go

build:
	go build -v -work

.PHONY: all glide deps watch webpack bindata lint run
