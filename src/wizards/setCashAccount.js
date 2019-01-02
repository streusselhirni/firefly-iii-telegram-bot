import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import Firefly from '../firefly';

export default new WizardScene(
  'setCashAccount',
  async ctx => {
    ctx.reply('Let me check your accounts...');
    let { data } = await Firefly.getAssetAccounts();

    ctx.wizard.state.accounts = [];
    ctx.wizard.state.ids = [];
    data.forEach((el) => {
      ctx.wizard.state.accounts.push(el.attributes.name);
      ctx.wizard.state.ids.push(el.id);
    });

    ctx.reply('Which is your cash account?', Markup.keyboard(ctx.wizard.state.accounts).oneTime().extra());

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
      ctx.session.cashAccount = ctx.wizard.state.chosenAccount;
      ctx.reply(`I set your cash account to ${ ctx.session.defaultAccount.name }`);
    }
    return ctx.scene.leave();
  }
);