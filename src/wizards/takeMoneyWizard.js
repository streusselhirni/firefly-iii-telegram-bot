import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import Firefly from '../firefly';

export default new WizardScene(
  'takeMoney',
  async ctx => {
    // Check if an account has been specified with "from Foobar"
    let acc = ctx.message.text.match(/from\s(.+)/);

    // If cashAccount is not yet set
    if (!ctx.session.cashAccount) {
      ctx.reply('No cash account set yet. Use /setCash to set cash account.');
      return ctx.scene.leave();
    }
    // If defaultAccount is not set and there is no account specified in message
    if (!ctx.session.defaultAccount && acc === null) {
      ctx.reply('No default asset account set yet. Use /setDefault to set default asset account.');
      return ctx.scene.leave();
    }

    ctx.wizard.state.acc = {};
    if (acc !== null) {
      let account = await Firefly.getAssetAccountByName(acc[ 1 ]);
      if (!account) {
        // No account found
        ctx.reply(`Account "${ acc[ 1 ] } not found. Cancelling.`);
        return ctx.scene.leave();
      }
      ctx.wizard.state.acc.name = account.attributes.name;
      ctx.wizard.state.acc.id = account.id;
    }
    else {
      ctx.wizard.state.acc.name = ctx.session.defaultAccount.name;
      ctx.wizard.state.acc.id = ctx.session.defaultAccount.id;
    }

    let res = ctx.message.text.match(/[Tt]ake\s(\d+(\.\d{0,2})?)/);
    ctx.wizard.state.amount = res[ 1 ];

    ctx.reply(
      `You want to take ${ ctx.wizard.state.amount } from ${ ctx.wizard.state.acc.name }. Correct?`,
      Markup.keyboard([ 'Yes', 'No' ]).oneTime().extra(),
    );
    return ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message.text === 'No') {
      ctx.reply('Ok. Cancelling');
      return ctx.scene.leave();
    }
    let res = await Firefly.takeMoney(ctx.wizard.state.amount, ctx.wizard.state.acc.id, ctx.session.cashAccount.id);
    if (res.status) {
      ctx.reply(`Took ${ ctx.wizard.state.amount } from ${ ctx.wizard.state.acc.name }.`);
    }
    else {
      ctx.reply('There was some kind of error');
    }
    return ctx.scene.leave();
  },
);