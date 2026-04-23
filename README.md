# No WSL, use the following command to generate the password hash":

perl -e 'print crypt("MH5ghW!JQ&", "salt"),"\n"'

# Criar as imagens

docker build -t sanwebsystem.frontend:v1.0.0 -f Dockerfile.ui -e ENV NEXT_PUBLIC_API_URL="https://api.sanwebsystem.com.br" .
docker build -t sanwebsystem.backend:v1.0.0 -f Dockerfile.api .

# Publicar a Imagem no Docker Hub

docker tag sanwebsystem.frontend:v1.0.0 ricardodec/sanwebsystem.frontend:v1.0.0
docker push ricardodec/sanwebsystem.frontend:v1.0.0

docker tag sanwebsystem.backend:v1.0.0 ricardodec/sanwebsystem.backend:v1.0.0
docker push ricardodec/sanwebsystem.backend:v1.0.0

# Criar um volume persistente

docker volume create sanwebsystem.pgdb.data

# Criar uma rede personalizada

docker network create sanwebsystem-network

# 1. Criar o segredo a partir de um arquivo

docker secret create db_password ./db_password.txt
docker secret create db_root_password ./db_root_password.txt

# Criar o contêiner do banco de dados

docker run -it --name sanwebsystem.pgdb \
 -d dhi.io/postgres:18-alpine3.22-dev
--network sanwebsystem-network \
 --secret db_root_password \
 -h localhost \
 -p 3306:3306 \
 -e POSTGRES_USER="sanweb_adm" \
 -e POSTGRES_PASSWORD_FILE="/run/secrets/db_root_password" \
 -e POSTGRES_DB="sanwebsystem" \
 -e LANG="pt_BR.UTF-8" \
 -e POSTGRES_INITDB_ARGS="--encoding=UTF-8 --lc-collate=pt_BR.UTF-8 --lc-ctype=pt_BR.UTF-8" \
 -v ./init-scripts:/docker-entrypoint-initdb.d:/init-scripts:/docker-entrypoint-initdb.d
-v sanwebsystem.pgdb.data:/var/lib/postgresql/data \

# Criar os contêiner da aplicação

docker run --name sanwebsystem.frontend -p 3000:3000 -d sanwebsystem.frontend:v1.0.0
docker run --name sanwebsystem.backend -p 5212:5212 -p 7079:7079 -d sanwebsystem.backend:v1.0.0

## Compose

# Inicia os contêineres em segundo plano.

docker-compose up -d

# Inicia os contêineres em segundo plano e cria as imagens, se necessário.

docker-compose up -d --build

# Verifica o status dos contêineres.

docker-compose ps

# Para e remove os contêineres e redes.

docker-compose down
