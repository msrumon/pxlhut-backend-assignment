FROM node:lts-alpine AS build

WORKDIR /root

COPY package.json package-lock.json ./

RUN npm install

COPY nest-cli.json ./
COPY tsconfig.build.json tsconfig.json ./
COPY types types
COPY prisma prisma
COPY src src

RUN npm run prisma generate && npm run build

FROM node:lts-alpine AS main

ENV NODE_ENV=production

WORKDIR /home/node

COPY --from=build --chown=node:node /root/package.json /root/package-lock.json ./
COPY --from=build --chown=node:node /root/node_modules node_modules
COPY --from=build --chown=node:node /root/prisma prisma
COPY --from=build --chown=node:node /root/dist dist
COPY --chown=node:node init.sh ./

RUN npm prune

USER node

RUN chmod u+x ./init.sh

EXPOSE 3000

ENTRYPOINT ["./init.sh"]

CMD [ "node", "dist/main.js" ]
