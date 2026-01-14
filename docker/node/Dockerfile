FROM node:24

Label maintainer="KacperM"

WORKDIR app

COPY config/node/frontend/package.json .

RUN npm install

COPY config/node/frontend .

ENV CI=false

CMD ["npm", "start"]
