FROM node:16.20.2

WORKDIR /usr/src/app

COPY . .

RUN npm install
#ARG REACT_APP_BACKEND_URL
#ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

#EXPOSE 3000
CMD ["npm", "start"]

