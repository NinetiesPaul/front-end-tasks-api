# Node 18 LTS (README: Node >= 14, npm >= 6). CRA 5 is unstable on Node 20+
# with fresh transitive ESLint/Jest plugin resolutions.
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG REACT_APP_SERVER_HOST=http://localhost:8080
ENV REACT_APP_SERVER_HOST=$REACT_APP_SERVER_HOST

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
