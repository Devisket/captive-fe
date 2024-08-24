FROM node:20.16.0-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

COPY . .

RUN npm run build

FROM nginx:stable
COPY --from=build /app/dist/ordering/ /usr/share/nginx/html
EXPOSE 80

