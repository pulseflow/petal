FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

RUN npm install -g pnpm

COPY example-welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt
