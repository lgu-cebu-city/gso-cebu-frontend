# #stage 1
FROM node:18.9.0-alpine3.15 As development
WORKDIR /app
RUN apk add --no-cache g++ make python3
ENV ENV_BACKEND_URI = ${ENV_BACKEND_URI}
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# #stage 2
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=development /app/dist/gso-front /usr/share/nginx/html
