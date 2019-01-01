const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const bot = new Telegraf(process.env.BOT_TOKEN, {
  getSessionKey: (ctx) => {
    if (ctx.from && ctx.chat) {
      return `${ctx.from.id}:${ctx.chat.id}`
    } else if (ctx.from && ctx.inlineQuery) {
      return `${ctx.from.id}:${ctx.from.id}`
    }
    return null
  }
});

bot.start(ctx => {
  ctx.reply(`Hello ${ ctx.from.first_name }`);
});

bot.hears('What can you do?', ((ctx, next) => ctx.reply('I can manage your Firefly-III expenses.')));

bot.startPolling();

console.log('Test');
setTimeout(() => console.log('Timeout'), 2000);