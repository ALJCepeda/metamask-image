FROM node:16

WORKDIR /mnt/host

COPY . .
RUN apt-get update
RUN apt-get install -y dos2unix
RUN dos2unix setup.sh
RUN sh setup.sh; rm setup.sh
CMD zsh
