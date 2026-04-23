# DOMÍNIO

api.sanwebsystem.com.br

# SERVIDOR

sudo apt update -y
sudo apt upgrade -y

sudo apt install git curl

# MYSQL

sudo apt install mysql-server -y
sudo systemctl status mysql
sudo mysql_secure_installation

# PERMITIR ACESSO REMOTO

sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
=> bind-address = 127.0.0.1 para bind-address = 0.0.0.0

# ACESSAR A ÁREA DE COMANDO

sudo mysql

# Dicas de Gerenciamento

# Iniciar:

    sudo systemctl start mysql

# Parar:

    sudo systemctl stop mysql

# Reiniciar:

    sudo systemctl restart mysql

# Habilitar no boot:

    sudo systemctl enable mysql

CREATE USER 'sanweb_adm'@'localhost' IDENTIFIED BY 'cgE1Y2U6Dd';
CREATE USER 'sanweb_user'@'localhost' IDENTIFIED BY 'MHSunAt!Qx';

GRANT ALL PRIVILEGES ON _._ TO 'sanweb_adm'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

# POSTGRESQL

sudo apt install postgresql
sudo -u postgres psql

ALTER USER postgres WITH ENCRYPTED PASSWORD 'cgE1Y2U6Dd';

CREATE USER sanweb_adm WITH ENCRYPTED PASSWORD 'cgE1Y2U6Dd';
CREATE USER sanweb_user WITH ENCRYPTED PASSWORD 'MHSunAt!Qx';

CREATE DATABASE sanwebsystem WITH OWNER sanweb_adm;
CREATE DATABASE sanwebtest WITH OWNER sanweb_adm;

GRANT ALL PRIVILEGES ON DATABASE sanwebsystem TO sanweb_adm;
GRANT ALL PRIVILEGES ON DATABASE sanwebtest TO sanweb_adm;

CREATE SCHEMA IF NOT EXISTS "sanwebsystem.sanweb_maindb";
CREATE SCHEMA IF NOT EXISTS "sanwebsystem.sanweb_db_0";

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "sanwebsystem.sanweb_maindb" TO sanweb_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "sanwebsystem.sanweb_db_0" TO sanweb_user;

CREATE SCHEMA IF NOT EXISTS "sanwebtest.sanweb_maindb";
CREATE SCHEMA IF NOT EXISTS "sanwebtest.sanweb_db_0";

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "sanwebtest.sanweb_maindb" TO sanweb_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "sanwebtest.sanweb_db_0" TO sanweb_user;

"\q" => sair
sudo systemctl restart postgresql

# NODE

# installs nvm (Node Version Manager - version v0.40.0)

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# download and install Node.js (you may need to restart the terminal)

nvm install --lts

# criar a chave e copiar a chave pública

ssh-keygen
cat ~/.ssh/id\_?.pub

# BAIXAR O CÓDIGO DO GITHUB

rm -fr sanwebsystem/
git clone git@github.com:ricardodec/sanwebsystem.git sanwebsystem --no-checkout
cd sanwebsystem/
git sparse-checkout init --cone
git sparse-checkout set sanwebsystem.backend
git checkout

# .env

NODE_ENV="production"
APP_PORT=80

DATABASE_HOST="api.sanwebsystem.com.br"
DATABASE_PORT=5432
DATABASE_USERNAME="sanweb_adm"
DATABASE_PASSWORD="MHSunAt!Qx"
DATABASE_NAME="sanwebsystem"
DATABASE_AUTOLOADENTITIES=true
DATABASE_SYNCHRONIZE=false

JWT_SECRET="m5lUXyTgZkiHDc0JhwmGbNDVW1g716p46sJ4Gw8S4my"
JWT_AUDIENCE="sanwebsystem.com.br"
JWT_ISSUER="sanwebsystem.com.br"
JWT_TTL="3600"
JWT_REFRESH_TTL="86400"

EMAIL_HOST="email-ssl.com.br"
EMAIL_PORT=465
EMAIL_USER="ricardo.castro@sanwebsystem.com.br"
EMAIL_PASS="Nwjubb=3vi"
EMAIL_FROM="no-reply@sanwebsystem.com.br"

# BUILD

npm run build

# LETSENCRYPT

sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
sudo apt-get install certbot
sudo apt install nginx
sudo service nginx stop
sudo certbot certonly --standalone -d api.sanwebsystem.com.br

# Successfully received certificate.

# Certificate is saved at: /etc/letsencrypt/live/api.sanwebsystem.com.br/fullchain.pem

# Key is saved at: /etc/letsencrypt/live/api.sanwebsystem.com.br/privkey.pem

sudo service nginx start

# NGINX

sudo nano /etc/nginx/sites-available/api.sanwebsystem.com.br

# Redireciona para HTTPS

server {
listen 80;
listen [::]:80;
server_name api.sanwebsystem.com.br;
return 301 https://$host$request_uri;
}

# HTTPS

server {
listen 443 ssl http2;
listen [::]:443 ssl http2;

    server_name api.sanwebsystem.com.br;

    # O servidor só vai responder pra este domínio
    if ($host != "api.sanwebsystem.com.br") {
    	return 404;
    }

    ssl_certificate /etc/letsencrypt/live/api.sanwebsystem.com.br/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/api.sanwebsystem.com.br/privkey.pem; # managed by Certbot
    ssl_trusted_certificate /etc/letsencrypt/live/api.sanwebsystem.com.br/chain.pem;

    # Improve HTTPS performance with session resumption
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 5m;

    # Enable server-side protection against BEAST attacks
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

    # Disable SSLv3
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    # Diffie-Hellman parameter for DHE ciphersuites
    # $ sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096
    ssl_dhparam /etc/ssl/certs/dhparam.pem;

    # Enable HSTS (https://developer.mozilla.org/en-US/docs/Security/HTTP_Strict_Transport_Security)
    add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";

    # Enable OCSP stapling (http://blog.mozilla.org/security/2013/07/29/ocsp-stapling-in-firefox)
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html index.php;

    location / {
    	proxy_pass http://localhost:3000;
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection 'upgrade';
    	proxy_set_header Host $host;
    	proxy_cache_bypass $http_upgrade;
    }

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    location ~ /\.ht {
    	deny all;
    }

    location ~ /\. {
    	access_log off;
    	log_not_found off;
    	deny all;
    }

    gzip on;
    gzip_disable "msie6";

    gzip_comp_level 6;
    gzip_min_length 1100;
    gzip_buffers 4 32k;
    gzip_proxied any;
    gzip_types
    	text/plain
    	text/css
    	text/js
    	text/xml
    	text/javascript
    	application/javascript
    	application/x-javascript
    	application/json
    	application/xml
    	application/rss+xml
    	image/svg+xml;

    access_log off;
    #access_log  /var/log/nginx/api.sanwebsystem.com.br-access.log;
    error_log   /var/log/nginx/api.sanwebsystem.com.br-error.log;

    #include /etc/nginx/common/protect.conf;

}

sudo ln /etc/nginx/sites-available/api.sanwebsystem.com.br /etc/nginx/sites-enabled/api.sanwebsystem.com.br
sudo systemctl restart nginx

# PM2

npm i -g pm2

# inside in the project folder

pm2 start dist/main.js --name sanwebsystem.api
pm2 startup

# it shows a command to execute

# sudo env PATH=$PATH:/home/ricardodec/.nvm/versions/node/v24.14.0/bin /home/ricardodec/.nvm/versions/node/v24.14.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ricardodec --hp /home/ricardodec

pm2 save
pm2 list

# NGINX UPLOAD

sudo nano /etc/nginx/nginx.conf

        client_max_body_size 5M;

sudo systemctl restart nginx

# WHEN YOU CHANGES YOUR CODE

git pull origin main
npm run build
pm2 restart sanwebsystem.api
sudo systemctl restart nginx
sudo systemctl restart postgresql

# Se o timezone do servidor estiver incorreto, você pode conferir com o comando:

```sh
timedatectl # Confira seu timezone atual. Meu:  Time zone: Etc/UTC (UTC, +0000)
timedatectl list-timezones | grep Sao_Paulo # Procura o timezone contendo "Sao_Paulo"
sudo timedatectl set-timezone America/Sao_Paulo # Altere
```
