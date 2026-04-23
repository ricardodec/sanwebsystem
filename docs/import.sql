-- SHOW VARIABLES LIKE 'secure_file_priv';

----------------------------------------------------------------------------------------------------------
--	agencia_dados
----------------------------------------------------------------------------------------------------------

DROP SCHEMA IF EXISTS exact_db;
CREATE SCHEMA IF NOT EXISTS exact_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;

USE exact_db;

DROP TABLE IF EXISTS agencia_dados;

CREATE TABLE IF NOT EXISTS agencia_dados (
	banco_codigo VARCHAR(4) NOT NULL,
	agencia_codigo VARCHAR(5) NOT NULL,
	nome VARCHAR(100) NOT NULL,
	endereco VARCHAR(100) NOT NULL,
	numero VARCHAR(10) NULL,
	complemento VARCHAR(50) NULL,
	bairro VARCHAR(50) NOT NULL,
	CEP VARCHAR(9) NOT NULL,
	municipio VARCHAR(50) NOT NULL,
	UF VARCHAR(2) NOT NULL,
	DDD VARCHAR(4) NULL,
	telefone VARCHAR(10) NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/agencia_dados.csv' INTO TABLE agencia_dados
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS;

ALTER TABLE agencia_dados ADD PRIMARY KEY (banco_codigo, agencia_codigo);

----------------------------------------------------------------------------------------------------------
--	cadastro
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS cadastro;

CREATE TABLE IF NOT EXISTS cadastro (
	CNPJ_CPF VARCHAR(14) NOT NULL,
	tipo_pessoa CHAR(1) NOT NULL,
	situacao TINYINT NOT NULL,
	partner BIT NOT NULL,
	cliente BIT NOT NULL,
	representante BIT NOT NULL,
	sacado BIT NOT NULL,
	fornecedor BIT NOT NULL,
	despacho JSON NULL,
	juridico JSON NULL,
	CNPJ_CPF_radical VARCHAR(11) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/cadastro.csv' INTO TABLE cadastro
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@CNPJ_CPF, @tipo_pessoa, @situacao, @partner, @cliente, @representante, @sacado, @fornecedor, @despacho, @juridico, @CNPJ_CPF_radical)
SET CNPJ_CPF = @CNPJ_CPF,
	tipo_pessoa = @tipo_pessoa,
	situacao = CAST(TRIM(BOTH FROM REPLACE(@situacao, '﻿', '')) AS UNSIGNED),
	partner = CAST(TRIM(BOTH FROM REPLACE(@partner, '﻿', '')) AS UNSIGNED),
	cliente = CAST(TRIM(BOTH FROM REPLACE(@cliente, '﻿', '')) AS UNSIGNED),
	representante = CAST(TRIM(BOTH FROM REPLACE(@representante, '﻿', '')) AS UNSIGNED),
	sacado = CAST(TRIM(BOTH FROM REPLACE(@sacado, '﻿', '')) AS UNSIGNED),
	fornecedor = CAST(TRIM(BOTH FROM REPLACE(@fornecedor, '﻿', '')) AS UNSIGNED),
    despacho = IF(@despacho IS NULL OR JSON_VALID(TRIM(BOTH FROM @despacho)) = 0, NULL, TRIM(BOTH FROM @despacho)),
    juridico = IF(@juridico IS NULL OR JSON_VALID(TRIM(BOTH FROM @juridico)) = 0, NULL, TRIM(BOTH FROM @juridico)),
    CNPJ_CPF_radical = @CNPJ_CPF_radical;

ALTER TABLE cadastro ADD PRIMARY KEY (CNPJ_CPF);

----------------------------------------------------------------------------------------------------------
--	cliente
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS cliente;

CREATE TABLE IF NOT EXISTS cliente (
	ID INT NOT NULL,
	pessoa_ID INT NOT NULL,
	mora DECIMAL(7,4) NULL,
	multa DECIMAL(7,4) NULL,
	fator_mes DECIMAL(7,4) NULL,
	taxa_juros DECIMAL(7,4) NULL,
	periodicidade TINYINT NULL,
	tipo_juros TINYINT NULL,
	ativo BIT NOT NULL,
	limite_suspenso BIT NOT NULL,
	juros_prorrogacao DECIMAL(7,4) NULL,
	dados_JSON JSON NULL,
	bloqueia_especie_sem_taxa BIT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/cliente.csv' INTO TABLE cliente
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @pessoa_ID, @mora, @multa, @fator_mes, @taxa_juros, @periodicidade, @tipo_juros, @ativo, @limite_suspenso, @juros_prorrogacao, @dados_JSON, @bloqueia_especie_sem_taxa)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
	mora = IF(REGEXP_REPLACE(@mora, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@mora, '\,', '\.') AS DOUBLE), NULL),
	multa = IF(REGEXP_REPLACE(@multa, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@multa, '\,', '\.') AS DOUBLE), NULL),
	fator_mes = IF(REGEXP_REPLACE(@fator_mes, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@fator_mes, '\,', '\.') AS DOUBLE), NULL),
	taxa_juros = IF(REGEXP_REPLACE(@taxa_juros, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@taxa_juros, '\,', '\.') AS DOUBLE), NULL),
	periodicidade = IF(@periodicidade REGEXP '^[0-9]$', CAST(TRIM(BOTH FROM REPLACE(@periodicidade, '﻿', '')) AS UNSIGNED), NULL),
	tipo_juros = IF(@tipo_juros REGEXP '^[0-9]$', CAST(TRIM(BOTH FROM REPLACE(@tipo_juros, '﻿', '')) AS UNSIGNED), NULL),
	ativo = CAST(TRIM(BOTH FROM REPLACE(@ativo, '﻿', '')) AS UNSIGNED),
	limite_suspenso = CAST(TRIM(BOTH FROM REPLACE(@limite_suspenso, '﻿', '')) AS UNSIGNED),
	juros_prorrogacao = IF(REGEXP_REPLACE(@juros_prorrogacao, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@juros_prorrogacao, '\,', '\.') AS DOUBLE), NULL),
    dados_JSON = IF(@dados_JSON  = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON)),
	bloqueia_especie_sem_taxa = CAST(TRIM(BOTH FROM REPLACE(@bloqueia_especie_sem_taxa, '﻿', '')) AS UNSIGNED);

ALTER TABLE cliente ADD PRIMARY KEY (ID);
CREATE UNIQUE INDEX IDX_cliente_pessoa_ID ON cliente (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	conta
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS conta;

CREATE TABLE IF NOT EXISTS conta (
	ID INT NOT NULL,
	pessoa_ID INT NOT NULL,
	tipo_conta_ID INT NOT NULL,
	data_saldo DATE NULL,
	saldo DECIMAL(9,2) NOT NULL,
	saldo_bloqueado DECIMAL(9,2) NOT NULL,
	dados_JSON JSON NULL,
	ativo BIT NOT NULL,
	nome VARCHAR(50) NULL,
	codigo_compensacao VARCHAR(4) NULL,
	codigo_empresa VARCHAR(20) NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/conta.csv' INTO TABLE conta
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @pessoa_ID, @tipo_conta_ID, @data_saldo, @saldo, @saldo_bloqueado, @dados_JSON, @ativo, @nome, @codigo_compensacao, @codigo_empresa)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
	tipo_conta_ID = CAST(TRIM(BOTH FROM REPLACE(@tipo_conta_ID, '﻿', '')) AS UNSIGNED),
    data_saldo = IF(@data_saldo != 'NULL' AND STR_TO_DATE(@data_saldo, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_saldo, '%Y-%m-%d'), NULL),
	saldo = IF(REGEXP_REPLACE(@saldo, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@saldo, '\,', '\.') AS DOUBLE), 0.0),
	saldo_bloqueado = IF(REGEXP_REPLACE(@saldo_bloqueado, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@saldo_bloqueado, '\,', '\.') AS DOUBLE), 0.0),
    dados_JSON = IF(@dados_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON)),
	ativo = CAST(TRIM(BOTH FROM REPLACE(@ativo, '﻿', '')) AS UNSIGNED),
    nome = @nome,
    codigo_compensacao = @codigo_compensacao,
	codigo_empresa = @codigo_empresa;

ALTER TABLE conta ADD PRIMARY KEY (ID);
CREATE INDEX IDX_conta_pessoa_ID ON conta (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	conta_corrente
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS conta_corrente;

CREATE TABLE IF NOT EXISTS conta_corrente (
	conta_ID INT NOT NULL,
	banco_ID INT NOT NULL,
	agencia_codigo VARCHAR(5) NOT NULL,
	agencia_digito VARCHAR(1) NULL,
	conta_numero VARCHAR(12) NOT NULL,
	conta_digito VARCHAR(1) NULL,
	convenio VARCHAR(20) NULL,
	dados_JSON JSON NULL,
	CEP VARCHAR(9)
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/conta_corrente.csv' INTO TABLE conta_corrente
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@conta_ID, @banco_ID, @agencia_codigo, @agencia_digito, @conta_numero, @conta_digito, @convenio, @dados_JSON, @CEP)
SET conta_ID = CAST(TRIM(BOTH FROM REPLACE(@conta_ID, '﻿', '')) AS UNSIGNED),
	banco_ID = CAST(TRIM(BOTH FROM REPLACE(@banco_ID, '﻿', '')) AS UNSIGNED),
    agencia_codigo = IF(@agencia_codigo = 'NULL', NULL, TRIM(BOTH FROM @agencia_codigo)),
    agencia_digito = IF(@agencia_digito = 'NULL', NULL, TRIM(BOTH FROM @agencia_digito)),
    conta_numero = TRIM(BOTH FROM @conta_numero),
    conta_digito = IF(@conta_digito = 'NULL', NULL, TRIM(BOTH FROM @conta_digito)),
    convenio = IF(@convenio = 'NULL', NULL, TRIM(BOTH FROM @convenio)),
    dados_JSON = IF(@dados_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON)),
	CEP = IF(@CEP = 'NULL', NULL, TRIM(BOTH FROM @CEP));

ALTER TABLE conta_corrente ADD PRIMARY KEY (conta_ID);

----------------------------------------------------------------------------------------------------------
--	conta_saldo
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS conta_saldo;

CREATE TABLE IF NOT EXISTS conta_saldo (
	conta_ID INT NOT NULL,
	data DATE NOT NULL,
	saldo DECIMAL(9,2) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/conta_saldo.csv' INTO TABLE conta_saldo
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@conta_ID, @data, @saldo)
SET conta_ID = CAST(TRIM(BOTH FROM REPLACE(@conta_ID, '﻿', '')) AS UNSIGNED),
    data = IF(@data != 'NULL' AND STR_TO_DATE(@data, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data, '%Y-%m-%d'), NULL),
	saldo = IF(REGEXP_REPLACE(@saldo, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@saldo, '\,', '\.') AS DOUBLE), 0.0);

ALTER TABLE conta_saldo ADD PRIMARY KEY (conta_ID, data);

----------------------------------------------------------------------------------------------------------
--	contas_pagar
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS contas_pagar;

CREATE TABLE IF NOT EXISTS contas_pagar (
	ID INT NOT NULL,
	empresa_ID INT NOT NULL,
	pessoa_ID INT NULL,
	plano_contas_ID INT NOT NULL,
	descricao VARCHAR(100) NOT NULL,
	conta_ID INT NULL,
	periodicidade TINYINT NOT NULL,
	dia_base TINYINT NOT NULL,
	mes_base TINYINT NOT NULL,
	ano_base SMALLINT NOT NULL,
	data_ultimo_periodo DATE NULL,
	data_proximo_periodo DATE NULL,
	valor DECIMAL(9,2) NOT NULL,
	ativo BIT NOT NULL,
	dados_JSON JSON NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/contas_pagar.csv' INTO TABLE contas_pagar
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @empresa_ID, @pessoa_ID, @plano_contas_ID, @descricao, @conta_ID, @periodicidade, @dia_base, @mes_base, @ano_base, @data_ultimo_periodo, @data_proximo_periodo, @valor, @ativo, @dados_JSON)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	empresa_ID = CAST(TRIM(BOTH FROM REPLACE(@empresa_ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = IF(@pessoa_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED)),
	plano_contas_ID = CAST(TRIM(BOTH FROM REPLACE(@plano_contas_ID, '﻿', '')) AS UNSIGNED),
    descricao = IF(@descricao = 'NULL', NULL, TRIM(BOTH FROM @descricao)),
	conta_ID = IF(@conta_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@conta_ID, '﻿', '')) AS UNSIGNED)),
	periodicidade = CAST(TRIM(BOTH FROM REPLACE(@periodicidade, '﻿', '')) AS UNSIGNED),
	dia_base = CAST(TRIM(BOTH FROM REPLACE(@dia_base, '﻿', '')) AS UNSIGNED),
	mes_base = CAST(TRIM(BOTH FROM REPLACE(@mes_base, '﻿', '')) AS UNSIGNED),
	ano_base = CAST(TRIM(BOTH FROM REPLACE(@ano_base, '﻿', '')) AS UNSIGNED),
    data_ultimo_periodo = IF(@data_ultimo_periodo != 'NULL' AND STR_TO_DATE(@data_ultimo_periodo, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_ultimo_periodo, '%Y-%m-%d'), NULL),
    data_proximo_periodo = IF(@data_proximo_periodo != 'NULL' AND STR_TO_DATE(@data_proximo_periodo, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_proximo_periodo, '%Y-%m-%d'), NULL),
	valor = IF(REGEXP_REPLACE(@valor, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@valor, '\,', '\.') AS DOUBLE), 0.0),
	ativo = CAST(TRIM(BOTH FROM REPLACE(@ativo, '﻿', '')) AS UNSIGNED),
    dados_JSON = IF(@dados_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON));

ALTER TABLE contas_pagar ADD PRIMARY KEY (ID);
CREATE INDEX IDX_contas_pagar_pessoa_ID ON contas_pagar (empresa_ID, pessoa_ID);
CREATE INDEX IDX_contas_pagar_plano_contas_ID ON contas_pagar (plano_contas_ID);
CREATE INDEX IDX_contas_pagar_conta_ID ON contas_pagar (conta_ID);

----------------------------------------------------------------------------------------------------------
--	contato
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS contato;

CREATE TABLE IF NOT EXISTS contato (
	ID INT NOT NULL,
	CNPJ_CPF VARCHAR(14) NOT NULL,
	dados_JSON JSON NULL,
	cobranca BIT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/contato.csv' INTO TABLE contato
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @CNPJ_CPF, @dados_JSON, @cobranca)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	CNPJ_CPF = @CNPJ_CPF,
    dados_JSON = IF(@dados_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON)),
    cobranca = CAST(TRIM(BOTH FROM REPLACE(@cobranca, '﻿', '')) AS UNSIGNED);

ALTER TABLE contato ADD PRIMARY KEY (ID);
CREATE INDEX IDX_contato_CNPJ_CPF ON contato (CNPJ_CPF);

DELETE FROM contato WHERE ID != 0 AND dados_JSON IS NULL;

----------------------------------------------------------------------------------------------------------
--	email
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS email;

CREATE TABLE IF NOT EXISTS email (
	ID INT NOT NULL,
	pessoa_ID INT NULL,
	endereco VARCHAR(100) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/email.csv' INTO TABLE email
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @pessoa_ID, @endereco)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
    endereco = @endereco;

ALTER TABLE email ADD PRIMARY KEY (ID);
CREATE INDEX IDX_email_pessoa_ID ON email (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	emissao
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS emissao;

CREATE TABLE IF NOT EXISTS emissao (
	ID INT NOT NULL,
	empresa_ID INT NULL,
	num_emissao SMALLINT NOT NULL,
	data_emissao DATE NOT NULL,
	data_vcto DATE NOT NULL,
	data_limite DATE NOT NULL,
	qtde INT NOT NULL,
	preco_unitario DECIMAL(9,2) NOT NULL,
	cod_registro VARCHAR(25) NULL,
	data_registro DATE NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/emissao.csv' INTO TABLE emissao
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @empresa_ID, @num_emissao, @data_emissao, @data_vcto, @data_limite, @qtde, @preco_unitario, @cod_registro, @data_registro)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	empresa_ID = CAST(TRIM(BOTH FROM REPLACE(@empresa_ID, '﻿', '')) AS UNSIGNED),
	num_emissao = CAST(TRIM(BOTH FROM REPLACE(@num_emissao, '﻿', '')) AS UNSIGNED),
    data_emissao = STR_TO_DATE(@data_emissao, '%Y-%m-%d'),
    data_vcto = STR_TO_DATE(@data_vcto, '%Y-%m-%d'),
    data_limite = STR_TO_DATE(@data_limite, '%Y-%m-%d'),
	qtde = CAST(TRIM(BOTH FROM REPLACE(@qtde, '﻿', '')) AS UNSIGNED),
	preco_unitario = IF(REGEXP_REPLACE(@preco_unitario, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@preco_unitario, '\,', '\.') AS DOUBLE), 0.0),
    cod_registro = IF(@cod_registro = 'NULL', NULL, @cod_registro),
    data_registro = IF(@data_registro != 'NULL' AND STR_TO_DATE(@data_registro, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_registro, '%Y-%m-%d'), NULL);

ALTER TABLE emissao ADD PRIMARY KEY (ID);
CREATE UNIQUE INDEX IDX_emissao_empresa_ID ON emissao (empresa_ID, num_emissao);

----------------------------------------------------------------------------------------------------------
--	empresa
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS empresa;

CREATE TABLE IF NOT EXISTS empresa (
	ID INT NOT NULL,
	pessoa_ID INT NOT NULL,
	controladora_ID INT NULL,
	tipo_operacao TINYINT NOT NULL,
	token VARCHAR(20) NULL,
	ativo BIT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/empresa.csv' INTO TABLE empresa
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @pessoa_ID, @controladora_ID, @tipo_operacao, @token, @ativo)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
	controladora_ID = IF(@controladora_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@controladora_ID, '﻿', '')) AS UNSIGNED)),
	tipo_operacao = CAST(TRIM(BOTH FROM REPLACE(@tipo_operacao, '﻿', '')) AS UNSIGNED),
    token = IF(@token = 'NULL', NULL, @token),
	ativo = CAST(TRIM(BOTH FROM REPLACE(@ativo, '﻿', '')) AS UNSIGNED);

ALTER TABLE empresa ADD PRIMARY KEY (ID);
CREATE UNIQUE INDEX IDX_empresa_pessoa_ID ON empresa (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	empresa_cliente
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS empresa_cliente;

CREATE TABLE IF NOT EXISTS empresa_cliente (
	empresa_ID INT NOT NULL,
	cliente_ID INT NOT NULL,
	data_vencimento DATE NOT NULL,
	limite_operacional DECIMAL(9,2) NOT NULL,
	obs TEXT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/empresa_cliente.csv' INTO TABLE empresa_cliente
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@empresa_ID, @cliente_ID, @data_vencimento, @limite_operacional, @obs)
SET empresa_ID = CAST(TRIM(BOTH FROM REPLACE(@empresa_ID, '﻿', '')) AS UNSIGNED),
	cliente_ID = CAST(TRIM(BOTH FROM REPLACE(@cliente_ID, '﻿', '')) AS UNSIGNED),
    data_vencimento = STR_TO_DATE(@data_vencimento, '%Y-%m-%d'),
	limite_operacional = IF(REGEXP_REPLACE(@limite_operacional, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@limite_operacional, '\,', '\.') AS DOUBLE), 0.0),
    obs = IF(@obs = 'NULL', NULL, @obs);

ALTER TABLE empresa_cliente ADD PRIMARY KEY (empresa_ID, cliente_ID);

----------------------------------------------------------------------------------------------------------
--	endereco
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS endereco;

CREATE TABLE IF NOT EXISTS endereco (
	ID INT NOT NULL,
	pessoa_ID INT NOT NULL,
	logradouro VARCHAR(100) NOT NULL,
	numero INT NULL,
	complemento VARCHAR(20) NULL,
	bairro VARCHAR(50) NULL,
	cidade VARCHAR(50) NOT NULL,
	estado_ID INT NULL,
	pais_ID INT NULL,
	cep VARCHAR(9) NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/endereco.csv' INTO TABLE endereco
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @pessoa_ID, @logradouro, @numero, @complemento, @bairro, @cidade, @estado_ID, @pais_ID, @cep)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
    logradouro = @logradouro,
	numero = IF(@numero = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@numero, '﻿', '')) AS UNSIGNED)),
    complemento = IF(@complemento = 'NULL', NULL, @complemento),
    bairro = IF(@bairro = 'NULL', NULL, @bairro),
    cidade = IF(@cidade = 'NULL', NULL, @cidade),
	estado_ID = IF(@estado_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@estado_ID, '﻿', '')) AS UNSIGNED)),
	pais_ID = IF(@pais_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@pais_ID, '﻿', '')) AS UNSIGNED)),
    cep = IF(@cep = 'NULL', NULL, @cep);

ALTER TABLE endereco ADD PRIMARY KEY (ID);
CREATE INDEX IDX_endereco_pessoa_ID ON endereco (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	estado
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS estado;

CREATE TABLE IF NOT EXISTS estado (
	ID INT NOT NULL,
	UF CHAR(2) NOT NULL,
	nome VARCHAR(30) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/estado.csv' INTO TABLE estado
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @UF, @nome)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
    UF = @UF,
    nome = @nome;

ALTER TABLE estado ADD PRIMARY KEY (ID);
CREATE UNIQUE INDEX IDX_estado_UF ON estado (UF);

----------------------------------------------------------------------------------------------------------
--	favorecido
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS favorecido;

CREATE TABLE IF NOT EXISTS favorecido (
	conta_ID INT NOT NULL,
	nome VARCHAR(60) NOT NULL,
	CNPJ_CPF VARCHAR(14) NOT NULL,
	tipo_pessoa CHAR(1) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/favorecido.csv' INTO TABLE favorecido
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@conta_ID, @nome, @CNPJ_CPF, @tipo_pessoa)
SET conta_ID = CAST(TRIM(BOTH FROM REPLACE(@conta_ID, '﻿', '')) AS UNSIGNED),
    nome = @nome,
    CNPJ_CPF = @CNPJ_CPF,
    tipo_pessoa = @tipo_pessoa;

ALTER TABLE favorecido ADD PRIMARY KEY (conta_ID);

----------------------------------------------------------------------------------------------------------
--	grupo_economico
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS grupo_economico;

CREATE TABLE IF NOT EXISTS grupo_economico (
	ID INT NOT NULL,
	nome VARCHAR(50) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/grupo_economico.csv' INTO TABLE grupo_economico
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @nome)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
    nome = @nome;

ALTER TABLE grupo_economico ADD PRIMARY KEY (ID);

----------------------------------------------------------------------------------------------------------
--	grupo_economico_pessoa
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS grupo_economico_pessoa;

CREATE TABLE IF NOT EXISTS grupo_economico_pessoa (
	grupo_economico_ID INT NOT NULL,
	pessoa_ID INT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/grupo_economico_pessoa.csv' INTO TABLE grupo_economico_pessoa
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@grupo_economico_ID, @pessoa_ID)
SET grupo_economico_ID = CAST(TRIM(BOTH FROM REPLACE(@grupo_economico_ID, '﻿', '')) AS UNSIGNED),
    pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED);

ALTER TABLE grupo_economico_pessoa ADD PRIMARY KEY (grupo_economico_ID, pessoa_ID);
CREATE UNIQUE INDEX IDX_grupo_economico_pessoa ON grupo_economico_pessoa (pessoa_ID, grupo_economico_ID);

----------------------------------------------------------------------------------------------------------
--	minuta_padrao
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS minuta_padrao;

CREATE TABLE IF NOT EXISTS minuta_padrao (
	ID INT NOT NULL,
	nome VARCHAR(100) NOT NULL,
	aplicacao TINYINT NOT NULL,
	data_inclusao DATE NOT NULL,
	data_validade DATE NULL,
	documento TEXT NOT NULL,
	obrigatorio BIT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/minuta_padrao.csv' INTO TABLE minuta_padrao
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @nome, @aplicacao, @data_inclusao, @data_validade, @documento, @obrigatorio)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
    nome = TRIM(BOTH FROM @nome),
    aplicacao = CAST(TRIM(BOTH FROM REPLACE(@aplicacao, '﻿', '')) AS UNSIGNED),
    data_inclusao = STR_TO_DATE(@data_inclusao, '%Y-%m-%d'),
    data_validade = IF(@data_validade != 'NULL' AND STR_TO_DATE(@data_validade, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_validade, '%Y-%m-%d'), NULL),
    documento = @documento,
    obrigatorio = CAST(TRIM(BOTH FROM REPLACE(@obrigatorio, '﻿', '')) AS UNSIGNED);

ALTER TABLE minuta_padrao ADD PRIMARY KEY (ID);

----------------------------------------------------------------------------------------------------------
--	pessoa
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS pessoa;

CREATE TABLE IF NOT EXISTS pessoa (
	ID INT NOT NULL,
	nome VARCHAR(60) NOT NULL,
	CNPJ_CPF VARCHAR(14) NOT NULL,
	tipo_pessoa CHAR(1) NOT NULL,
	restricao_JSON JSON NULL,
	vadu_JSON JSON NULL,
	CNPJ_CPF_radical VARCHAR(11)
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/pessoa.csv' INTO TABLE pessoa
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @nome, @CNPJ_CPF, @tipo_pessoa, @restricao_JSON, @vadu_JSON, @CNPJ_CPF_radical)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
    nome = TRIM(BOTH FROM @nome),
    CNPJ_CPF = TRIM(BOTH FROM @CNPJ_CPF),
    tipo_pessoa = TRIM(BOTH FROM @tipo_pessoa),
    restricao_JSON = IF(@restricao_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @restricao_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @restricao_JSON) AS JSON)),
    vadu_JSON = IF(@vadu_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @vadu_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @vadu_JSON) AS JSON)),
    CNPJ_CPF_radical = TRIM(BOTH FROM @CNPJ_CPF_radical);

ALTER TABLE pessoa ADD PRIMARY KEY (ID);
CREATE UNIQUE INDEX IDX_pessoa_CNPJ_CPF ON pessoa (CNPJ_CPF);

----------------------------------------------------------------------------------------------------------
--	pessoa_fisica
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS pessoa_fisica;

CREATE TABLE IF NOT EXISTS pessoa_fisica (
	pessoa_ID INT NOT NULL,
	data_nascimento DATE NULL,
	RG VARCHAR(15) NULL,
	emissor_RG VARCHAR(6) NULL,
	data_emissao_RG DATE NULL,
	estado_civil TINYINT NOT NULL,
	profissao VARCHAR(50) NULL,
	pais_ID INT NULL,
	conjuge_JSON JSON NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/pessoa_fisica.csv' INTO TABLE pessoa_fisica
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@pessoa_ID, @data_nascimento, @RG, @emissor_RG, @data_emissao_RG, @estado_civil, @profissao, @pais_ID, @conjuge_JSON)
SET pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
    data_nascimento = IF(@data_nascimento != 'NULL' AND STR_TO_DATE(@data_nascimento, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_nascimento, '%Y-%m-%d'), NULL),
    RG = IF(@RG = 'NULL', NULL, TRIM(BOTH FROM @RG)),
    emissor_RG = IF(@emissor_RG = 'NULL', NULL, TRIM(BOTH FROM @emissor_RG)),
    data_emissao_RG = IF(@data_emissao_RG != 'NULL' AND STR_TO_DATE(@data_emissao_RG, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_emissao_RG, '%Y-%m-%d'), NULL),
    estado_civil = CAST(TRIM(BOTH FROM REPLACE(@estado_civil, '﻿', '')) AS UNSIGNED),
    profissao = IF(@profissao = 'NULL', NULL, TRIM(BOTH FROM @profissao)),
    pais_ID = IF(@pais_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@pais_ID, '﻿', '')) AS UNSIGNED)),
    conjuge_JSON = IF(@conjuge_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @conjuge_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @conjuge_JSON) AS JSON));

ALTER TABLE pessoa_fisica ADD PRIMARY KEY (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	pessoa_juridica
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS pessoa_juridica;

CREATE TABLE IF NOT EXISTS pessoa_juridica (
	pessoa_ID INT NOT NULL,
	nome_fantasia VARCHAR(60) NOT NULL,
	inscricao_estadual VARCHAR(20) NULL,
	inscricao_municipal VARCHAR(20) NULL,
	data_abertura DATE NULL,
	ramo_atividade VARCHAR(60) NULL,
	dados_JSON JSON NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/pessoa_juridica.csv' INTO TABLE pessoa_juridica
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@pessoa_ID, @nome_fantasia, @inscricao_estadual, @inscricao_municipal, @data_abertura, @ramo_atividade, @dados_JSON)
SET pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
    nome_fantasia = IF(@nome_fantasia = 'NULL', NULL, TRIM(BOTH FROM @nome_fantasia)),
    inscricao_estadual = IF(@inscricao_estadual = 'NULL', NULL, TRIM(BOTH FROM @inscricao_estadual)),
    inscricao_municipal = IF(@inscricao_municipal = 'NULL', NULL, TRIM(BOTH FROM @inscricao_municipal)),
    data_abertura = IF(@data_abertura != 'NULL' AND STR_TO_DATE(@data_abertura, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_abertura, '%Y-%m-%d'), NULL),
    ramo_atividade = IF(@ramo_atividade = 'NULL', NULL, TRIM(BOTH FROM @ramo_atividade)),
    dados_JSON = IF(@dados_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON));

ALTER TABLE pessoa_juridica ADD PRIMARY KEY (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	plano_contas
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS plano_contas;

CREATE TABLE IF NOT EXISTS plano_contas (
	ID INT NOT NULL,
	superior_ID INT NULL,
	codigo VARCHAR(6) NOT NULL,
	nome VARCHAR(50) NOT NULL,
	analitico BIT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/plano_contas.csv' INTO TABLE plano_contas
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @superior_ID, @codigo, @nome, @analitico)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	superior_ID = IF(@superior_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@superior_ID, '﻿', '')) AS UNSIGNED)),
    codigo = IF(@codigo = 'NULL', NULL, TRIM(BOTH FROM @codigo)),
    nome = IF(@nome = 'NULL', NULL, TRIM(BOTH FROM @nome)),
    analitico = CAST(TRIM(BOTH FROM REPLACE(@analitico, '﻿', '')) AS UNSIGNED);

ALTER TABLE plano_contas ADD PRIMARY KEY (ID);
CREATE INDEX IDX_plano_contas_superior_ID ON plano_contas (superior_ID);

----------------------------------------------------------------------------------------------------------
--	representante
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS representante;

CREATE TABLE IF NOT EXISTS representante (
	ID INT NOT NULL,
	representada_ID INT NOT NULL,
	pessoa_ID INT NOT NULL,
	funcao TINYINT NOT NULL,
	departamento VARCHAR(50) NULL,
	data_vcto_procuracao DATE NULL,
	avalista BIT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/representante.csv' INTO TABLE representante
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @representada_ID, @pessoa_ID, @funcao, @departamento, @data_vcto_procuracao, @avalista)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	representada_ID = CAST(TRIM(BOTH FROM REPLACE(@representada_ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
	funcao = CAST(TRIM(BOTH FROM REPLACE(@funcao, '﻿', '')) AS UNSIGNED),
    departamento = IF(@departamento = 'NULL', NULL, TRIM(BOTH FROM @departamento)),
    data_vcto_procuracao = IF(@data_vcto_procuracao != 'NULL' AND STR_TO_DATE(@data_vcto_procuracao, '%Y-%m-%d') IS NOT NULL, STR_TO_DATE(@data_vcto_procuracao, '%Y-%m-%d'), NULL),
    avalista = CAST(TRIM(BOTH FROM REPLACE(@avalista, '﻿', '')) AS UNSIGNED);

ALTER TABLE representante ADD PRIMARY KEY (ID);
CREATE UNIQUE INDEX IDX_representante_representada ON representante (representada_ID, pessoa_ID);
CREATE UNIQUE INDEX IDX_representante_pessoa ON representante (pessoa_ID, representada_ID);

----------------------------------------------------------------------------------------------------------
--	resgate
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS resgate;

CREATE TABLE IF NOT EXISTS resgate (
	ID INT NOT NULL,
	cliente_ID INT NOT NULL,
	data DATE NOT NULL,
	valor DECIMAL(9,2) NOT NULL,
	IR DECIMAL(9,2) NOT NULL,
	dados_JSON JSON NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/resgate.csv' INTO TABLE resgate
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @cliente_ID, @data, @valor, @IR, @dados_JSON)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	cliente_ID = CAST(TRIM(BOTH FROM REPLACE(@cliente_ID, '﻿', '')) AS UNSIGNED),
    data = STR_TO_DATE(@data, '%Y-%m-%d'),
	valor = IF(REGEXP_REPLACE(@valor, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@valor, '\,', '\.') AS DOUBLE), 0.0),
	IR = IF(REGEXP_REPLACE(@IR, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@IR, '\,', '\.') AS DOUBLE), 0.0),
    dados_JSON = IF(@dados_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON));

ALTER TABLE resgate ADD PRIMARY KEY (ID);
CREATE INDEX IDX_resgate_cliente ON resgate (cliente_ID, data);

----------------------------------------------------------------------------------------------------------
--	resgate_subscricao
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS resgate_subscricao;

CREATE TABLE IF NOT EXISTS resgate_subscricao (
	resgate_ID INT NOT NULL,
	subscricao_ID INT NOT NULL,
	valor_principal DECIMAL(9,2) NOT NULL,
	valor_rendimento DECIMAL(9,2) NOT NULL,
	IR DECIMAL(9,2) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/resgate_subscricao.csv' INTO TABLE resgate_subscricao
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@resgate_ID, @subscricao_ID, @valor_principal, @valor_rendimento, @IR)
SET resgate_ID = CAST(TRIM(BOTH FROM REPLACE(@resgate_ID, '﻿', '')) AS UNSIGNED),
	subscricao_ID = CAST(TRIM(BOTH FROM REPLACE(@subscricao_ID, '﻿', '')) AS UNSIGNED),
	valor_principal = IF(REGEXP_REPLACE(@valor_principal, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@valor_principal, '\,', '\.') AS DOUBLE), 0.0),
	valor_rendimento = IF(REGEXP_REPLACE(@valor_rendimento, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@valor_rendimento, '\,', '\.') AS DOUBLE), 0.0),
	IR = IF(REGEXP_REPLACE(@IR, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@IR, '\,', '\.') AS DOUBLE), 0.0);

ALTER TABLE resgate_subscricao ADD PRIMARY KEY (resgate_ID, subscricao_ID);
CREATE UNIQUE INDEX IDX_resgate_subscricao ON resgate_subscricao (subscricao_ID, resgate_ID);

----------------------------------------------------------------------------------------------------------
--	serie
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS serie;

CREATE TABLE IF NOT EXISTS serie (
	emissao_ID INT NOT NULL,
	num_serie SMALLINT NOT NULL,
	taxa_juros DECIMAL(7,4) NOT NULL,
	periodicidade TINYINT NOT NULL,
	tipo_juros TINYINT NOT NULL,
	indexador_ID INT NULL,
	perc_indexador DECIMAL(7,4) NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/serie.csv' INTO TABLE serie
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@emissao_ID, @num_serie, @taxa_juros, @periodicidade, @tipo_juros, @indexador_ID, @perc_indexador)
SET emissao_ID = CAST(TRIM(BOTH FROM REPLACE(@emissao_ID, '﻿', '')) AS UNSIGNED),
	num_serie = CAST(TRIM(BOTH FROM REPLACE(@num_serie, '﻿', '')) AS UNSIGNED),
	taxa_juros = IF(REGEXP_REPLACE(@taxa_juros, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@taxa_juros, '\,', '\.') AS DOUBLE), 0.0),
	periodicidade = CAST(TRIM(BOTH FROM REPLACE(@periodicidade, '﻿', '')) AS UNSIGNED),
	tipo_juros = CAST(TRIM(BOTH FROM REPLACE(@tipo_juros, '﻿', '')) AS UNSIGNED),
	indexador_ID = IF(@indexador_ID = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@indexador_ID, '﻿', '')) AS UNSIGNED)),
	perc_indexador = IF(@indexador_ID = 'NULL', NULL, IF(REGEXP_REPLACE(@perc_indexador, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@perc_indexador, '\,', '\.') AS DOUBLE), 0.0));

ALTER TABLE serie ADD PRIMARY KEY (emissao_ID, num_serie);

----------------------------------------------------------------------------------------------------------
--	subscricao
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS subscricao;

CREATE TABLE IF NOT EXISTS subscricao (
	ID INT NOT NULL,
	cliente_ID INT NOT NULL,
	emissao_ID INT NOT NULL,
	num_serie SMALLINT NOT NULL,
	num_cautela SMALLINT NOT NULL,
	data_subscricao DATE NOT NULL,
	qtde SMALLINT NOT NULL,
	data_integralizacao DATE NOT NULL,
	valor_integralizacao DECIMAL(9,2) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/subscricao.csv' INTO TABLE subscricao
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @cliente_ID, @emissao_ID, @num_serie, @num_cautela, @data_subscricao, @qtde, @data_integralizacao, @valor_integralizacao)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	cliente_ID = CAST(TRIM(BOTH FROM REPLACE(@cliente_ID, '﻿', '')) AS UNSIGNED),
	emissao_ID = CAST(TRIM(BOTH FROM REPLACE(@emissao_ID, '﻿', '')) AS UNSIGNED),
	num_serie = CAST(TRIM(BOTH FROM REPLACE(@num_serie, '﻿', '')) AS UNSIGNED),
	num_cautela = CAST(TRIM(BOTH FROM REPLACE(@num_cautela, '﻿', '')) AS UNSIGNED),
    data_subscricao = STR_TO_DATE(@data_subscricao, '%Y-%m-%d'),
	qtde = CAST(TRIM(BOTH FROM REPLACE(@qtde, '﻿', '')) AS UNSIGNED),
    data_integralizacao = STR_TO_DATE(@data_integralizacao, '%Y-%m-%d'),
	valor_integralizacao = IF(REGEXP_REPLACE(@valor_integralizacao, '\,', '\.') REGEXP '^[0-9]+(\.[0-9]+)?$', CAST(REGEXP_REPLACE(@valor_integralizacao, '\,', '\.') AS DOUBLE), 0.0);

ALTER TABLE subscricao ADD PRIMARY KEY (ID);
CREATE INDEX IDX_subscricao_cliente ON subscricao (cliente_ID, data_subscricao);

----------------------------------------------------------------------------------------------------------
--	subscricao_minuta
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS subscricao_minuta;

CREATE TABLE IF NOT EXISTS subscricao_minuta (
	ID INT NOT NULL,
	subscricao_ID INT NOT NULL,
	minuta_padrao_ID int NOT NULL,
	documento TEXT NOT NULL,
	dados_JSON JSON NULL,
	nro_referencia INT NULL,
	nro_documento BIGINT NULL,
	situacao CHAR(1) NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/subscricao_minuta.csv' INTO TABLE subscricao_minuta
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @subscricao_ID, @minuta_padrao_ID, @documento, @dados_JSON, @nro_referencia, @nro_documento, @situacao)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	subscricao_ID = CAST(TRIM(BOTH FROM REPLACE(@subscricao_ID, '﻿', '')) AS UNSIGNED),
	minuta_padrao_ID = CAST(TRIM(BOTH FROM REPLACE(@minuta_padrao_ID, '﻿', '')) AS UNSIGNED),
    documento = @documento,
    dados_JSON = IF(@dados_JSON = 'NULL' OR JSON_VALID(TRIM(BOTH FROM @dados_JSON)) = 0, NULL, CAST(TRIM(BOTH FROM @dados_JSON) AS JSON)),
	nro_referencia = IF(@nro_referencia = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@nro_referencia, '﻿', '')) AS UNSIGNED)),
	nro_documento = IF(@nro_documento = 'NULL', NULL, CAST(TRIM(BOTH FROM REPLACE(@nro_documento, '﻿', '')) AS UNSIGNED)),
	situacao = IF(@situacao = 'NULL', NULL, TRIM(BOTH FROM @situacao));

ALTER TABLE subscricao_minuta ADD PRIMARY KEY (ID);
CREATE INDEX IDX_subscricao_minuta ON subscricao_minuta (subscricao_ID);
CREATE INDEX IDX_subscricao_minuta_padrao ON subscricao_minuta (minuta_padrao_ID);

----------------------------------------------------------------------------------------------------------
--	telefone
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS telefone;

CREATE TABLE IF NOT EXISTS telefone (
	ID INT NOT NULL,
	pessoa_ID INT NOT NULL,
	DDI VARCHAR(3) NULL,
	DDD VARCHAR(3) NULL,
	numero VARCHAR(10) NOT NULL,
	tipo_telefone TINYINT NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/telefone.csv' INTO TABLE telefone
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @pessoa_ID, @DDI, @DDD, @numero, @tipo_telefone)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	pessoa_ID = CAST(TRIM(BOTH FROM REPLACE(@pessoa_ID, '﻿', '')) AS UNSIGNED),
	DDI = IF(@DDI = 'NULL', NULL, TRIM(BOTH FROM @DDI)),
	DDD = IF(@DDD = 'NULL', NULL, TRIM(BOTH FROM @DDD)),
	numero = TRIM(BOTH FROM @numero),
	tipo_telefone = CAST(TRIM(BOTH FROM REPLACE(@tipo_telefone, '﻿', '')) AS UNSIGNED);

ALTER TABLE telefone ADD PRIMARY KEY (ID);
CREATE INDEX IDX_telefone_pessoa_ID ON telefone (pessoa_ID);

----------------------------------------------------------------------------------------------------------
--	tipo_conta
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS tipo_conta;

CREATE TABLE IF NOT EXISTS tipo_conta (
	ID INT NOT NULL,
	descricao VARCHAR(50) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/tipo_conta.csv' INTO TABLE tipo_conta
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @descricao)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	descricao = TRIM(BOTH FROM @descricao);

ALTER TABLE tipo_conta ADD PRIMARY KEY (ID);

----------------------------------------------------------------------------------------------------------
--	variavel
----------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS variavel;

CREATE TABLE IF NOT EXISTS variavel (
	ID INT NOT NULL,
	TAG VARCHAR(50) NOT NULL,
	descricao VARCHAR(100) NOT NULL
)
ENGINE = InnoDB;

LOAD DATA INFILE 'D:/ProgramData/MySQL/MySQL Server 8.0/Uploads/variavel.csv' INTO TABLE variavel
FIELDS TERMINATED BY ';' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 0 ROWS
(@ID, @TAG, @descricao)
SET ID = CAST(TRIM(BOTH FROM REPLACE(@ID, '﻿', '')) AS UNSIGNED),
	TAG = TRIM(BOTH FROM @TAG),
	descricao = TRIM(BOTH FROM @descricao);

ALTER TABLE variavel ADD PRIMARY KEY (ID);
CREATE INDEX IDX_variavel_TAG ON variavel (TAG);