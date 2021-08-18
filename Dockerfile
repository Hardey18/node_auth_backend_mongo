FROM node:14

WORKDIR /src

COPY . /src

RUN yarn

RUN yarn tsc

EXPOSE 3000

CMD ["yarn", "start"]