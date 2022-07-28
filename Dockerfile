# Imagen que tiene cliente oracle
FROM psazop/node-instantclient:latest

# utilizar /app como carpeta destino del proyecto
WORKDIR /app

# Instalar los componentes necesarios
COPY package*.json ./
RUN npm install

# Instalar typescript, copiar los fuentes en formato .ts y archivo de configuracion
RUN npm i -g typescript
COPY src ./src
COPY tsconfig.json ./

# Generar los archivos .js en carpeta build (definida en tsconfig.json), solo genera los .js
RUN tsc -b

#copiar los otros archivos y carpetas que no son copiados durante el build del tsc
COPY public ./public
COPY src/*.json         build/
COPY src/api-docs       build/api-docs

EXPOSE 3000

CMD ["npm", "run", "start"]