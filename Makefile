develop: depends asset start
depends:
	glide install
	go get github.com/jteeuwen/go-bindata/...
	go get github.com/elazarl/go-bindata-assetfs/...
	npm install
asset:
	./node_modules/.bin/webpack -d --progress
	go-bindata-assetfs -o server/bindata_assetfs.go assets/*
start:
	go run server/*.go
