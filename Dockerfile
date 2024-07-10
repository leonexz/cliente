# Usa una imagen base de Node.js 18 para construir la aplicación
FROM node:18-alpine as build-step

# Crear el directorio de trabajo
RUN mkdir -p /app

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar las dependencias
COPY package.json ./
COPY yarn.lock ./

# Instalar las dependencias
RUN yarn install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación Angular
RUN yarn build -- --configuration production

# Usa una imagen base de Nginx para servir la aplicación
FROM nginx:1.27.0-alpine

RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos de build de Angular a la carpeta de Nginx
COPY --from=build-step /app/dist/cliente /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
