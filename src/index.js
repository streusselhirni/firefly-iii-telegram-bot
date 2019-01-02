import 'babel-polyfill';
import 'dotenv/config';
import Telegraf from 'telegraf';
import Session from 'telegraf/session';
import Stage from 'telegraf/stage';

import setDefaultAccountWizard from './wizards/setDefaultAccountWizard';
import setCashAccount from './wizards/setCashAccount';
import payMoneyWizard from './wizards/payMoneyWizard';
import takeMoneyWizard from './wizards/takeMoneyWizard';
import receiveMoneyWizard from './wizards/reveiveMoneyWizard';

const bot = new Telegraf(process.env.BOT_TOKEN, {
  getSessionKey: (ctx) => {
    if (ctx.from && ctx.chat) {
      return `${ ctx.from.id }:${ ctx.chat.id }`;
    }
    else if (ctx.from && ctx.inlineQuery) {
      return `${ ctx.from.id }:${ ctx.from.id }`;
    }
    return null;
  },
});
const stage = new Stage([
  setDefaultAccountWizard,
  setCashAccount,
  payMoneyWizard,
  takeMoneyWizard,
  receiveMoneyWizard,
]);

bot.use(Session());
bot.use(stage.middleware());

bot.start(ctx => {
  ctx.reply(`Hi ${ ctx.from.first_name }. Let's manage your money!`);
});

bot.command('setdefaultaccount', ctx => ctx.scene.enter('setDefaultAccount'));
bot.command('setcashaccount', ctx => ctx.scene.enter('setCashAccount'));
bot.command('getdefaultaccount', ctx => {
  if (ctx.session.defaultAccount) {
    ctx.reply(ctx.session.defaultAccount);
  }
  else {
    ctx.reply('No default selected.');
  }
});
bot.command('getcashaccount', ctx => {
  if (ctx.session.cashAccount) {
    ctx.reply(ctx.session.cashAccount);
  }
  else {
    ctx.reply('No cash account selected.');
  }
});

// Bot hears a message, starting with at least one digit, optionally followed by a dot and two digits
bot.hears(/^\d+(\.\d{0,2})?/gi, (ctx) => ctx.scene.enter('payMoney'));

// Bot hears a message, starting with take and then a currency ammount
bot.hears(/^[Tt]ake\s(\d+(\.\d{0,2})?)/g, (ctx) => ctx.scene.enter('takeMoney'));

bot.hears(/^[Rr]eceived?/g, (ctx) => ctx.scene.enter('receiveMoney'));

bot.command('help', ctx => {
  ctx.reply(`The following commands are available:
  /start - See welcome message
  /help - See this message
  /setdefaultaccount - Set default asset account
  /setcashaccount - Set default cash account
  /getdefaultaccount - See default asset account
  /getcashaccount - See default cash account
  
  To tell spend money: "[Amount] [Description] [Account]"
  ([Account] is optional if default asset account is set).
  ([Amount] is either just a number or an amount in this format: 12.45).
  
  To take money from bank to cash: "Take [Amount] from [Account]"
  ("from [Account]" is optional if default cash account is set).
  ([Amount] is either just a number or an amount in this format: 12.45).
  
  To receive money: "Received [Amount] from [RevenueAccount] to [AssetAccount]"
  ("from [RevenueAccount]" and "to [AssetAccount]" can by in either order).
  ("to [AssetAccount]" is optional if default cash account is set).
  ([Amount] is either just a number or an amount in this format: 12.45).
  `);
});

bot.on('message', ctx => ctx.reply('Sorry, I don\'t understand.'));

bot.startPolling();