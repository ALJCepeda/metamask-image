FROM node:16

WORKDIR /mnt/host
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY . .
RUN sh setup.sh; rm setup.sh
CMD zsh
