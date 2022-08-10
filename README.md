# Welcome to Talker Manager 👋

</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

Talker Manager is a CRUD API developed in my studies at [Trybe](https://www.betrybe.com/). Talkers are managed in `./talker.json`

## Features

- Create new talker
- List talkers
- Edit talkers
- Delete talkers

## API Reference

#### Get all talkers

```http
  GET /talker
```

#### Get talker by ID

```http
  GET /talker/${id}
```

| Parameter | Type     | Description             |
| :-------- | :------- | :---------------------- |
| `id`      | `string` | **Required**. Talker ID |

#### Login

```http
  POST /login
```

| Request body | Type     | Description                    |
| :----------- | :------- | :----------------------------- |
| `email`      | `string` | **Required.** Valid email      |
| `password`   | `string` | **Required.** Min 6 characters |

#### Add talker

```http
  POST /talker
```

| Request body       | Type     | Description                                     |
| :----------------- | :------- | :---------------------------------------------- |
| `name`             | `string` | **Required.** Min 3 characters                  |
| `age`              | `number` | **Required.** At least 18 years old             |
| `talker`           | `object` | **Required.** Must have `watchedAt` and `rate`  |
| `talker.watchedAt` | `string` | **Required.** Must be a valid date `dd/mm/yyyy` |
| `talker.rate`      | `number` | **Required** Between 1 and 5                    |

#### Edit talker

```http
  PUT /talker/${id}
```

| Request body       | Type     | Description                                     |
| :----------------- | :------- | :---------------------------------------------- |
| `name`             | `string` | **Required.** Min 3 characters                  |
| `age`              | `number` | **Required.** At least 18 years old             |
| `talker`           | `object` | **Required.** Must have `watchedAt` and `rate`  |
| `talker.watchedAt` | `string` | **Required.** Must be a valid date `dd/mm/yyyy` |
| `talker.rate`      | `number` | **Required** Between 1 and 5                    |

#### Delete talker

```http
  DELETE /talker/${id}
```

> Must have valid token in request **headers.authorization**

| Parameter | Type     | Description             |
| :-------- | :------- | :---------------------- |
| `id`      | `string` | **Required**. Talker ID |

#### Get talker by name

```http
  GET /talker/search?q=${name}
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `name`    | `string` | **Required** |

## Run Locally

Clone the project

```bash
  git clone git@github.com:tostesdaniel/talker-manager.git
```

Go to the project directory

```bash
  cd talker-manager
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Author

👤 **Daniel Tostes**

- Github: [@tostesdaniel](https://github.com/tostesdaniel)
- LinkedIn: [@danieltostes](https://linkedin.com/in/danieltostes)

## Lessons Learned

- Node.js
- Express
