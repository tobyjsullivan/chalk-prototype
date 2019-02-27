deploy:
	rm -rf ./build
	yarn build
	aws s3 sync --delete ./build/ s3://messy.codes/
