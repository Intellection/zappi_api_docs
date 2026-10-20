FROM 471112705198.dkr.ecr.us-east-1.amazonaws.com/zappi/base/nodejs:24.13.0 AS builder

# ARGs & ENVs
ARG CODE_PATH="/srv/code"

WORKDIR ${CODE_PATH}

# Cache & install node dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app
ADD . ${CODE_PATH}

# Generate the static site and its search index
RUN npm run build

FROM 471112705198.dkr.ecr.us-east-1.amazonaws.com/docker-hub/zappi/nginx:1.27.4

# ARGs & ENVs
ARG CODE_PATH="/srv/code"

WORKDIR ${CODE_PATH}

# Copy files from builder
COPY --from=builder --chown=nginx:nginx ${CODE_PATH}/build/ ${CODE_PATH}/build/
USER nginx:nginx

ARG GIT_RELEASE
ENV GIT_RELEASE="${GIT_RELEASE:-unset}"
