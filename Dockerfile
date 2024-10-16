FROM 471112705198.dkr.ecr.us-east-1.amazonaws.com/zappi/base/ruby:3.3.5-3 AS builder

# ARGs & ENVs
ENV BUNDLE_PATH="/srv/bundle"
ARG CODE_PATH="/srv/code"

WORKDIR ${CODE_PATH}

# Cache, install & clean ruby gem dependencies
COPY Gemfile Gemfile.lock ./
RUN mkdir -p ${BUNDLE_PATH} && \
    export BUNDLER_VERSION=$(cat Gemfile.lock | tail -1 | tr -d "[:space:]") && \
    gem install bundler -v "${BUNDLER_VERSION}" && \
    bundle config set frozen 'true' && \
    bundle config set without "test development" && \
    bundle install --jobs 8 --retry 3 && \
    rm -rf ${BUNDLE_PATH}/{cache,ruby/*/cache}

# Copy the rest of the app
ADD . ${CODE_PATH}

# Generate static files from raw docs
RUN bundle exec middleman build

FROM 471112705198.dkr.ecr.us-east-1.amazonaws.com/docker-hub/zappi/nginx:1.27.1

# ARGs & ENVs
ARG CODE_PATH="/srv/code"

WORKDIR ${CODE_PATH}

# Copy files from builder
COPY --from=builder --chown=nginx:nginx ${CODE_PATH}/build/ ${CODE_PATH}/build/
USER nginx:nginx

ARG GIT_RELEASE
ENV GIT_RELEASE="${GIT_RELEASE:-unset}"
