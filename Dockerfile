FROM node:20

RUN apt-get update && apt-get install -y python3 make g++ build-essential

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install -g pnpm

RUN pnpm install && pnpm approve-builds && pnpm install

RUN pnpm build

CMD ["pnpm", "start"]
