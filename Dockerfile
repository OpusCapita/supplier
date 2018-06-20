FROM node:8-alpine
MAINTAINER patrykkopycinski

WORKDIR /home/node/supplier

RUN chown -Rf node:node .

RUN apk add --no-cache curl

ENV NODE_ENV=development

# Bundle app source by overwriting all WORKDIR content.
COPY --chown=node:node . .

USER node

RUN npm install && npm cache clean --force

ARG CI="false"
RUN if $CI -eq "true"; then npm run build:client ; fi

# A container must expose a port if it wants to be registered in Consul by Registrator.
# The port is fed both to node express server and Consul => DRY principle is observed with ENV VAR.
# NOTE: a port can be any, not necessarily different from exposed ports of other containers.
EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=3s --retries=12 \
  CMD curl --silent --fail http://localhost:3001/api/health/check || exit 1

CMD [ "npm", "start"]
