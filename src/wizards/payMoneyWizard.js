import WizardScene from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import Firefly from '../firefly';

export default new WizardScene(
  'payMoney', // name of scene
  ctx => {
    let txtParts = ctx.message.text.split(', ');
    ctx.wizard.state.amount = txtParts[ 0 ]; // Store amount in wizard state
    ctx.wizard.state.desc = txtParts[ 1 ]; // Store description in wizard state
    ctx.wizard.state.acc = ctx.session.defaultAccount ? ctx.session.defaultAccount : { name: undefined, id: undefined }; // store default account or null in wizard state
    if (txtParts.length > 2) {
      ctx.wizard.state.acc.name = txtParts[ 2 ]; // Overwrite account with account from message if it exists
      ctx.wizard.state.acc.id = undefined;
    }
    ctx.reply(
      `You paid ${ ctx.wizard.state.amount } for ${ ctx.wizard.state.desc } from ${ ctx.wizard.state.acc.name }. Is this correct?`,
      Markup.keyboard([ 'Yes', 'No' ]).oneTime().extra(),
    );
    return ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message.text.toLowerCase() === 'no') {
      ctx.reply('I\'ll ignore it. Please try again.');
      return ctx.scene.leave();
    }
    else {
      // If id is not set (no account given or default not set)
      if (!ctx.wizard.state.acc.id) {
        let account = await Firefly.getAssetAccountByName(ctx.wizard.state.acc.name);
        if (!account) {
          // No account found
          ctx.reply('No account found. Cancelling.');
          return ctx.scene.leave();
        }
        ctx.wizard.state.acc.name = account.attributes.name;
        ctx.wizard.state.acc.id = account.id;
      }
      // Pay Money
      Firefly.payMoney(ctx.wizard.state.amount, ctx.wizard.state.acc.id, ctx.wizard.state.desc).then((res) => {
        ctx.reply(`I booked ${ ctx.wizard.state.desc } (${ ctx.wizard.state.amount }) from ${ ctx.wizard.state.acc.name }.`);
      }).catch((err) => {
        ctx.reply('There was an error. The transaction has been cancelled.');
        console.error(err.response);
      });
      return ctx.scene.leave();
    }
  },
);