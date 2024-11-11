# **Compass Car**

Desafio da primeira semana do **Programa de Bolsas NodeJS [Compass.uol](https://compass.uol/)**.

O sistema se chama “Compass Car” e é feito para aluguel de carros, é uma API para gerenciar nossos carros (carro CRUD). Ela pode cadastrar, pesquisar, atualizar e excluir carros, bem como realizar as validações necessárias.

## Tecnologias

Node.js  
Javascript  
MySQL

Para o desenvolvimento deste projeto foi utilizada a linguagem Javascript, NodeJS com Express, MySQL2 para conexão ao banco de dados MySQL.

## Requisitos

Antes de começar, você vai precisar ter instalado em sua máquina o Node.js, também é necessário um banco de dados no MySQL e não se ver o arquivo configdatabase.txt que mostra um passo a passo da criação do banco de dados.

## Como inicializar

Como descrito nos requisitos acima, primeiramente você precisa instalar o [NodeJS](https://nodejs.org/en/)  
Depois você irá executar os seguintes comandos:

```bash
# Clona este repositório
$ git clone https://github.com/Luis-G-H-Souza/ANOUT24_D01_COMPASSCAR-.git
# Instala as dependências
$ npm install
```

## Inicializando a aplicação

```bash
# Inicia a aplicação em localhost:3001
$ npm start
```

## Endpoints

### Car Endpoints

| Route              | Method | Description                                |
| ------------------ | :----: | ------------------------------------------ |
| `/api/v1/cars`     |  GET   | Get the cars and show them with pagination |
| `/api/v1/cars/:id` |  GET   | Get a car using ID                         |
| `/api/v1/cars`     |  POST  | Creates a car                              |
| `/api/v1/cars/:id` | PATCH  | Updates parcial values of car by ID        |
| `/api/v1/cars/:id` | DELETE | Deletes product and its items by their ID  |

### Items Endpoints

| Route                    | Method | Description            |
| ------------------------ | :----: | ---------------------- |
| `/api/v1/cars/:id/items` |  PUT   | Upgrade items on a car |

## Schema

### Car Table

| FieldName    |    Type    | Required | Unique |
| ------------ | :--------: | :------: | :----: |
| `_id`        | Increments |   true   |  true  |
| `brand`      |   String   |   true   | false  |
| `model`      |   String   |   true   | false  |
| `plate`      |   String   |   true   |  true  |
| `year`       |  Integer   |   true   | false  |
| `created_at` | Timestamp  |   true   | false  |

### Item Table

| FieldName    |    Type    | Required | Unique |
| ------------ | :--------: | :------: | :----: |
| `_id`        | Increments |   true   |  true  |
| `name`       |   String   |   true   |  true  |
| `car_id`     |  Integer   |   true   | false  |
| `created_at` | Timestamp  |   true   | false  |
