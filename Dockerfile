# Dockerfile do frontend
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do projeto
COPY . .

# Gera os arquivos otimizados de produção
RUN npm run build

# Expõe a porta onde o Vite Preview servirá o app
EXPOSE 3000

# Roda a aplicação em modo de produção
CMD ["npm", "start"]
