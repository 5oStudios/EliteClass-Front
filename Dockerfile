# Build node js app
FROM node:18.17-alpine

ARG USERNAME=studios
ARG GROUP_NAME=studios
ARG UID=1001
ARG GID=1001

WORKDIR /app

COPY . .

RUN mv .env.example .env  \
    && npm install pm2 -g;

RUN yarn install --force \
    && yarn run build;

EXPOSE 3000

RUN addgroup --gid ${GID} --system ${GROUP_NAME}
RUN adduser --system --ingroup ${GROUP_NAME} --shell /bin/bash --uid ${UID} --disabled-password ${USERNAME}
RUN chown -R ${USERNAME}:${GROUP_NAME} .

USER $USERNAME

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
