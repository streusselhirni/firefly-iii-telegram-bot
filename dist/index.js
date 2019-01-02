'use strict';

require('babel-polyfill');

require('dotenv/config');

var _telegraf = require('telegraf');

var _telegraf2 = _interopRequireDefault(_telegraf);

var _session = require('telegraf/session');

var _session2 = _interopRequireDefault(_session);

var _stage = require('telegraf/stage');

var _stage2 = _interopRequireDefault(_stage);

var _setDefaultAccountWizard = require('./wizards/setDefaultAccountWizard');

var _setDefaultAccountWizard2 = _interopRequireDefault(_setDefaultAccountWizard);

var _setCashAccount = require('./wizards/setCashAccount');

var _setCashAccount2 = _interopRequireDefault(_setCashAccount);

var _payMoneyWizard = require('./wizards/payMoneyWizard');

var _payMoneyWizard2 = _interopRequireDefault(_payMoneyWizard);

var _takeMoneyWizard = require('./wizards/takeMoneyWizard');

var _takeMoneyWizard2 = _interopRequireDefault(_takeMoneyWizard);

var _reveiveMoneyWizard = require('./wizards/reveiveMoneyWizard');

var _reveiveMoneyWizard2 = _interopRequireDefault(_reveiveMoneyWizard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bot = new _telegraf2.default(process.env.BOT_TOKEN, {
  getSessionKey: function getSessionKey(ctx) {
    if (ctx.from && ctx.chat) {
      return ctx.from.id + ':' + ctx.chat.id;
    } else if (ctx.from && ctx.inlineQuery) {
      return ctx.from.id + ':' + ctx.from.id;
    }
    return null;
  }
});
var stage = new _stage2.default([_setDefaultAccountWizard2.default, _setCashAccount2.default, _payMoneyWizard2.default, _takeMoneyWizard2.default, _reveiveMoneyWizard2.default]);

bot.use((0, _session2.default)());
bot.use(stage.middleware());

bot.start(function (ctx) {
  ctx.reply('Hi ' + ctx.from.first_name + '. Let\'s manage your money!');
});

bot.command('setdefaultaccount', function (ctx) {
  return ctx.scene.enter('setDefaultAccount');
});
bot.command('setcashaccount', function (ctx) {
  return ctx.scene.enter('setCashAccount');
});
bot.command('getdefaultaccount', function (ctx) {
  if (ctx.session.defaultAccount) {
    ctx.reply(ctx.session.defaultAccount);
  } else {
    ctx.reply('No default selected.');
  }
});
bot.command('getcashaccount', function (ctx) {
  if (ctx.session.cashAccount) {
    ctx.reply(ctx.session.cashAccount);
  } else {
    ctx.reply('No cash account selected.');
  }
});

// Bot hears a message, starting with at least one digit, optionally followed by a dot and two digits
bot.hears(/^\d+(\.\d{0,2})?/gi, function (ctx) {
  return ctx.scene.enter('payMoney');
});

// Bot hears a message, starting with take and then a currency ammount
bot.hears(/^[Tt]ake\s(\d+(\.\d{0,2})?)/g, function (ctx) {
  return ctx.scene.enter('takeMoney');
});

bot.hears(/^[Rr]eceived?/g, function (ctx) {
  return ctx.scene.enter('receiveMoney');
});

bot.command('help', function (ctx) {
  ctx.reply('The following commands are available:\n  /start - See welcome message\n  /help - See this message\n  /setdefaultaccount - Set default asset account\n  /setcashaccount - Set default cash account\n  /getdefaultaccount - See default asset account\n  /getcashaccount - See default cash account\n  \n  To tell spend money: "[Amount] [Description] [Account]"\n  ([Account] is optional if default asset account is set).\n  ([Amount] is either just a number or an amount in this format: 12.45).\n  \n  To take money from bank to cash: "Take [Amount] from [Account]"\n  ("from [Account]" is optional if default cash account is set).\n  ([Amount] is either just a number or an amount in this format: 12.45).\n  \n  To receive money: "Received [Amount] from [RevenueAccount] to [AssetAccount]"\n  ("from [RevenueAccount]" and "to [AssetAccount]" can by in either order).\n  ("to [AssetAccount]" is optional if default cash account is set).\n  ([Amount] is either just a number or an amount in this format: 12.45).\n  ');
});

bot.on('message', function (ctx) {
  return ctx.reply('Sorry, I don\'t understand.');
});

bot.startPolling();