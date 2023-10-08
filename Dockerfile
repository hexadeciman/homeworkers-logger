# build environment
FROM node:13.12.0-alpine as build
WORKDIR ./
ENV PATH /ui/node_modules/.bin:$PATH
COPY . ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /build /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
