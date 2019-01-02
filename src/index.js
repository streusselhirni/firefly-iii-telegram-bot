import 'dotenv/config';
import Telegraf from 'telegraf';
import Session from 'telegraf/session';
import Markup from 'telegraf/markup';
import Stage from 'telegraf/stage';
import WizardScene from 'telegraf/scenes/wizard';
import Firefly from './firefly';

const setDefaultAccount = new WizardScene(
  'setDefaultAccount',
  async ctx => {
    ctx.reply('Let me check your accounts...');
    let { data } = await Firefly.getAssetAccounts();

    ctx.wizard.state.accounts = [];
    ctx.wizard.state.ids = [];
    data.forEach((el) => {
      ctx.wizard.state.accounts.push(el.attributes.name);
      ctx.wizard.state.ids.push(el.id);
    });

    ctx.reply('Which is your default account?', Markup.keyboard(ctx.wizard.state.accounts).oneTime().extra());

    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text.toLowerCase() === 'cancel') {
      ctx.reply('Ok, I cancelled the operation.');
      return ctx.scene.leave();
    }
    else {
      ctx.wizard.state.chosenAccount = {
        name: ctx.message.text,
        id: ctx.wizard.state.ids[ ctx.wizard.state.accounts.findIndex((el) => el === ctx.message.text) ],
      };
      ctx.reply(`Is this correct: ${ ctx.wizard.state.chosenAccount.name } (Id: ${ ctx.wizard.state.chosenAccount.id })?`,
        Markup.keyboard([ 'Yes', 'No' ]).oneTime().extra());
      return ctx.wizard.next();
    }
  },
  ctx => {
    if (ctx.message.text.toLowerCase() === 'cancel') {
      ctx.reply('Ok, I cancelled the operation.');
      return ctx.scene.leave();
    }
    if (ctx.message.text === 'Yes') {
      ctx.session.defaultAccount = ctx.wizard.state.chosenAccount;
      ctx.reply(`I set your default account to ${ ctx.session.defaultAccount.name }`);
    }
    return ctx.scene.leave();
  },
);

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
const stage = new Stage([ setDefaultAccount ]);

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