develop: depends assetdev start
depends:
	glide install
	go get -u github.com/jteeuwen/go-bindata/...
	go get -u github.com/elazarl/go-bindata-assetfs/...
	go get -u github.com/golang/lint/golint
	npm install
asset:
	./node_modules/.bin/webpack -p --progress
	go-bindata-assetfs -o server/bindata_assetfs.go assets/*
assetdev:
	./node_modules/.bin/webpack -d --progress
	go-bindata-assetfs -o server/bindata_assetfs.go assets/*
start:
	go run server/*.go
lint:
	golint ./server/...
	./node_modules/.bin/eslint --ext .js --ext .jsx ./
