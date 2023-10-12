FROM node:16.20.2

WORKDIR /usr/src/app

COPY . .

RUN npm install
#ARG REACT_APP_BACKEND_URL
#ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
RUN CI=true npm run test
RUN npm run build
RUN npm install -g serve

EXPOSE 4000

CMD ["serve", "-l", "4000", "build"]

