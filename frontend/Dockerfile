FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --quiet
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm","run","preview"]
