drop database if exists primare_ouvidoria;
create database primare_ouvidoria;
use primare_ouvidoria;

CREATE TABLE Config (
    chave VARCHAR(100) PRIMARY KEY,
    valor VARCHAR(100) NOT NULL
);

CREATE TABLE Tags (
    id_tag INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL UNIQUE,
    cor_tag VARCHAR(100) NOT NULL,
    cor_texto VARCHAR(100) NOT NULL
);

CREATE TABLE Usuarios (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    permissoes VARCHAR(100) NOT NULL
);

CREATE TABLE Fluxo (
    id_fluxo INT PRIMARY KEY AUTO_INCREMENT,
    posicao INT NOT NULL,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Cartoes (
    ID_Cartao INT PRIMARY KEY AUTO_INCREMENT,
    Cliente VARCHAR(100),
    Data_comentario DATE NOT NULL,
    Data_conclusao DATE Null,
    Comentario VARCHAR(10000) NOT NULL,
    Etapa INT NULL, 
    Tag INT NULL,
    titulo_tag varchar(50) Null,
    cor_tag varchar(50) null,
    cor_texto varchar(50) null,
    Administrador INT NULL,
    Nome_admin varchar(50) Null,
    status varchar(50) NOT NULL,
    FOREIGN KEY (Etapa) REFERENCES Fluxo(id_fluxo), 
    FOREIGN KEY (Administrador) REFERENCES Usuarios(id_user),
    FOREIGN KEY (Tag) REFERENCES Tags(id_tag)
);

CREATE TABLE Historico (
    ID_Historico INT PRIMARY KEY AUTO_INCREMENT,
    cartao INT NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    data_mudanca DATE NOT NULL,
    FOREIGN KEY (cartao) REFERENCES Cartoes(ID_Cartao)
);

-- Inserção na tabela Config
INSERT INTO Config (config1) VALUES (true);

-- Inserções na tabela Tags
INSERT INTO Tags (titulo, cor_tag, cor_texto) VALUES ('Urgente', '#FF0000', '#FFFFFF');
INSERT INTO Tags (titulo, cor_tag, cor_texto) VALUES ('Normal', '#0000FF', '#FFFFFF');
INSERT INTO Tags (titulo, cor_tag, cor_texto) VALUES ('Baixa Prioridade', '#FFD700', '#000000');

-- Inserções na tabela Usuarios
INSERT INTO Usuarios (email, senha, permissoes) VALUES ('luiz coelho', 'lcn2505@K', 'admin');
INSERT INTO Usuarios (email, senha, permissoes) VALUES ('mayara', 'primareodonto', 'admin');
INSERT INTO Usuarios (email, senha, permissoes) VALUES ('mateus pinheiro', 'primare123', 'user');

-- Inserções na tabela Fluxo
INSERT INTO Fluxo (posicao, nome) VALUES (1, 'Início');
INSERT INTO Fluxo (posicao, nome) VALUES (2, 'Processamento');
INSERT INTO Fluxo (posicao, nome) VALUES (3, 'Finalização');
