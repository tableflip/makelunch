FROM node:4.8.3
MAINTAINER olizilla <oli@tableflip.io>

WORKDIR /src

# Add Tini a lightweight init system that properly handles running as PID 1.
# A Node.js process running as PID 1 will not respond to SIGTERM (CTRL-C) and similar signals.
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#handling-kernel-signals
ENV TINI_VERSION v0.14.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

ENV METEOR_ALLOW_SUPERUSER=true
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh

ADD package.json /src
RUN npm install --production --quiet

ADD . /src
RUN meteor build --directory .. \
    && cd /bundle/programs/server \
    && npm install --production --quiet

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
WORKDIR /bundle
CMD ["node", "main.js"]
