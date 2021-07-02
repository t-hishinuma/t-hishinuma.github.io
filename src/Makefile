all:  build

build:
	git submodule update --init HPC4CAE_book 
	git submodule foreach git pull origin master
	make -C ./HPC4CAE_book/ build
	- rm -rf static/HPC4CAE/
	mv HPC4CAE_book/HPC4CAE static
	make -C ./non-smoking/ 
	- rm -rf static/non-smoking/
	mv non-smoking/non-smoking/ static/non-smoking/
	hugo
	touch ../.nojekyll

server:  build
	touch ../.nojekyll
	$(eval IP := $(shell ip -f inet -o addr show eth0|cut -d\  -f 7 | cut -d/ -f 1))
	hugo server -p 1313 --buildDrafts --watch --baseUrl=${IP} --bind=0.0.0.0

clean:
	cd ..; ls | grep -v -E 'src' | grep -v -E 'CNAME' | xargs rm -r; cd -
