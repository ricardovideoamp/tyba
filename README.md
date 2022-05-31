
# Tyba Test

API to query restaurants given a city name or coordinates.



## Badges

[![Build Status](https://app.travis-ci.com/ricardovideoamp/ricardovideoamp.svg?branch=main)](https://app.travis-ci.com/ricardovideoamp/ricardovideoamp)
[![Coverage Status](https://coveralls.io/repos/github/ricardovideoamp/tyba/badge.svg?branch=master)](https://coveralls.io/github/ricardovideoamp/tyba?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/d2d1906a2259eb2e133e/maintainability)](https://codeclimate.com/github/ricardovideoamp/tyba/maintainability)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GOOGLE_MAPS_API_KEY`

`GOOGLE_API_URL`

## Run Locally

Clone the project

```bash
  git clone https://github.com/ricardovideoamp/tyba.git
```

Go to the project directory

```bash
  cd tyba
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  docker-compose up
```


## Usage/Examples

returns a list of restaurants in Barranquilla * must be authenticated
```
GET URL/v1/restaurants?city=barranquilla
```

returns a list of restaurant related to the coordinates * must be authenticated
```
GET URL/v1/restaurants?coordinates=6.2529275%2C-75.5749500
```

Login 
```
POST URL/v1/login
body {
  "email": "tyba@example.com",
  "password": "password"
}
```

Sign up
```
POST URL/v1/register
body {
  "name": "Tyba1",
  "email": "tyba@example.com",
  "password": "password"
}
```


