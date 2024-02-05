FROM node:18.17-alpine AS builder

ARG USERNAME=studios
ARG GROUP_NAME=studios
ARG UID=1001
ARG GID=1001

WORKDIR /app

COPY package*.json ./

RUN npm i --force

COPY . .

# Rename environment file and update configurations
RUN mv .env.example .env \
    && sed -i 's/pre.panel.lms.elite-class.com/dash.staging.elite-class.com/g' .env \
    && sed -i 's/pre.lms.elite-class.com/app.staging.elite-class.com/g' .env \
    && npm run build \
    && ls -al

FROM node:18.17-alpine

ARG USERNAME=studios
ARG GROUP_NAME=studios
ARG UID=1001
ARG GID=1001

WORKDIR /app

COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public /app/standalone/public
COPY --from=builder /app/.next/static /app/standalone/.next/static

EXPOSE 3000

RUN addgroup --gid ${GID} --system ${GROUP_NAME} \
    && adduser --system --ingroup ${GROUP_NAME} --shell /bin/bash --uid ${UID} --disabled-password ${USERNAME} \
    && chown -R ${USERNAME}:${GROUP_NAME} .

USER $USERNAME

CMD ["node", "./standalone/server.js"]
