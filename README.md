# Firefly-III-Telegram-Bot

This bot can manage basic transactions on your firefly-iii server.

## Setup

Make a copy of the file `.env.example` and rename it `.env`.

Insert the URL of your Firefly-III server after `API_BASE_URL=`.

### Talk to the BotFather
First, you need to create a new Bot on Telegram.
Open up Telegram and look for the BotFather. Text him `/newbot`
and answer his questions. In the end, he will give you a token to access 
the HTTP API.

Insert this token after `BOT_TOKEN=` into the `.env` file.

### Get a Oauth2 Bearer Token
The last thing needed is the Oauth2 Bearer token. The easiest way, to get this,
is by using Postman.

Follow the steps in the [official Firefly-III docs](https://firefly-iii.readthedocs.io/en/latest/api/start.html)
and in the end, copy the Bearer token into your `.env` file.

your `.env` file shoud now look similar to this:

```text
API_BASE_URL=https://firefly.local/api/v1
BOT_TOKEN=thisisjustanexamplebottoken
OAUTH_TOKEN=thisisn0r34ltokenbutyoursmightlooksimilarjustwithmoredigitsandsymbolsandlonger
```

### Start the bot
To start the bot, you need to copy the files within `dist` to your server.
Then just run `node index.js` to start the bot.

You might want to use a Node.JS process manager like [pm2](http://pm2.keymetrics.io).