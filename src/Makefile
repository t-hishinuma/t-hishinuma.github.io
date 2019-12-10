all:  build

build:
	hugo
	touch ../.nojekyll

server:  build
	touch ../.nojekyll
	$(eval IP := $(shell ip -f inet -o addr show eth0|cut -d\  -f 7 | cut -d/ -f 1))
	hugo server -p 1313 --buildDrafts --watch --baseUrl=${IP} --bind=0.0.0.0

clean:
	cd ..; ls | grep -v -E 'src' | xargs rm -r; cd -
