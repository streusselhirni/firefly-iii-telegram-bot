import 'dotenv/config';
import Telegraf from 'telegraf';
import Session from 'telegraf/session';
import Stage from 'telegraf/stage';
import Markup from 'telegraf/markup';
import Firefly from './firefly';

import setDefaultAccountWizard from './wizards/setDefaultAccountWizard';
  'setDefaultAccount',

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
const stage = new Stage([ setDefaultAccountWizard ]);

bot.use(Session());
bot.use(stage.middleware());

bot.start(ctx => {
  ctx.reply(`Hi ${ ctx.from.first_name }. Let's manage your money!`);
});

bot.command('getDefault', ctx => {
  if (ctx.session.defaultAccount) {
    ctx.reply(ctx.session.defaultAccount);
  }
  else {
    ctx.reply('No default selected.');
  }
});
bot.command('setDefault', ctx => ctx.scene.enter('setDefaultAccount'));

bot.startPolling();