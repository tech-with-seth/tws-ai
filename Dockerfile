FROM node:20-alpine as development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine as production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
COPY ./prisma /app/prisma
WORKDIR /app
RUN npx prisma generate --schema=./prisma/schema.prisma  # Generate the Prisma client
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/prisma /app/prisma
WORKDIR /app
CMD ["npm", "run", "start"]
