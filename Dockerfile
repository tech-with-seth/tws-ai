FROM node:20-alpine as development-dependencies-env
COPY . /app
COPY prisma ./prisma
WORKDIR /app
RUN npm ci
RUN npx prisma generate --schema=./prisma/schema.prisma

FROM node:20-alpine as production-dependencies-env
COPY ./package.json package-lock.json /app/
COPY prisma ./prisma
WORKDIR /app
RUN npm ci --omit=dev
RUN npx prisma generate --schema=./prisma/schema.prisma

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]