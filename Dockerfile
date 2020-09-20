# from https://github.com/disney/meteor-base/blob/f8acb5de78e487b6f027d34339b22fd25c1080e6/example/default.dockerfile

# The tag here should match the Meteor version of your app, per .meteor/release
FROM geoffreybooth/meteor-base:1.11

# Copy app package.json and package-lock.json into container
COPY ./package*.json $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-app-npm-dependencies.sh

# Copy app source into container
COPY . $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-meteor-bundle.sh


# Use the specific version of Node expected by your Meteor release, per https://docs.meteor.com/changelog.html; this is expected for Meteor 1.11
FROM node:12.18.3-alpine

ENV APP_BUNDLE_FOLDER /opt/bundle
ENV SCRIPTS_FOLDER /docker

# Runtime dependencies; if your dependencies need compilation (native modules such as bcrypt) or you are using Meteor <1.8.1, use app-with-native-dependencies.dockerfile instead
RUN apk --no-cache add \
		bash \
		ca-certificates

# Copy in entrypoint
COPY --from=0 $SCRIPTS_FOLDER $SCRIPTS_FOLDER/

# Copy in app bundle
COPY --from=0 $APP_BUNDLE_FOLDER/bundle $APP_BUNDLE_FOLDER/bundle/

RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh

# Start app
ENV PORT 3000

# Get gcp secret to env tool https://github.com/binxio/gcp-get-secret
# It replaces env var values that start with gcp:///path/to/secret with the actual value from secret manager
COPY --from=binxio/gcp-get-secret:0.3.1 /gcp-get-secret /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/gcp-get-secret"]
CMD ["/bin/bash", "-c", "/docker/entrypoint.sh", "node", "main.js"]
