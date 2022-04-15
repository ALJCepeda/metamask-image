FROM node:16

WORKDIR /mnt/host

COPY . .
RUN sh setup.sh; rm setup.sh
CMD zsh
