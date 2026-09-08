FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NG_APP_SERVER_HOST=http://localhost:3000
RUN sed -i "s|__SERVER_HOST__|${NG_APP_SERVER_HOST}|g" src/environments/environment.prod.ts

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/task-manager/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
