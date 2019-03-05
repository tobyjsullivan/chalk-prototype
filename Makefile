deploy:
	rm -rf ./build
	yarn build
	aws s3 sync ./build/ s3://messy.codes/
