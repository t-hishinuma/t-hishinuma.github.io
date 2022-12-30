OBJ = ./HPC4CAE
WWW = /var/www/html

all:

build:
	mdbook build -d $(OBJ)

server:
	rsync -aI $(OBJ)/* $(WWW)

clean:
	rm -rf $(OBJ)
