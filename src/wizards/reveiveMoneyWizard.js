import SceneWizard from 'telegraf/scenes/wizard';
import Markup from 'telegraf/markup';
import Firefly from '../firefly';

export default new SceneWizard(
  'receiveMoney',
  async ctx => {
    let text = ctx.message.text;
    let amount = text.match(/(\d+(\.\d{0,2})?)/);
    let source = text.match(/from\s["„'‚]?([^"„“'‚‘]+)["“'‘]?/);
    let dest = text.match(/to\s["„'‚]([^"„“'‚‘]+)["“'‘]/);
    if (dest == null && ctx.session.cashAccount) {
      dest = [ 'placeholder', ctx.session.cashAccount.name ];
    }
    if (amount == null || source == null || dest == null) {
      ctx.reply('There was some wrong syntax. Please try again.');
      return ctx.scene.leave();
    }
    else {
      ctx.wizard.state.amount = amount[ 1 ];
      ctx.wizard.state.source = source[ 1 ];

      let acc = await Firefly.getAssetAccountByName(dest[ 1 ]);
      if (!acc) {
        ctx.reply(`Account ${ dest[ 1 ] } does not exist. Aborting.`);
        return ctx.scene.leave();
      }
      ctx.wizard.state.acc = {};
      ctx.wizard.state.acc.name = acc.attributes.name;
      ctx.wizard.state.acc.id = acc.id;
    }
    ctx.reply(
      `${ ctx.wizard.state.acc.name } received ${ ctx.wizard.state.amount } from ${ ctx.wizard.state.source }. Is this correct?`,
      Markup.keyboard([ 'Yes', 'No' ]).oneTime().extra(),
    );
    return ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message.text === 'No') {
      ctx.reply('Ok. Aborting...');
      return ctx.scene.leave();
    }
    let res = await Firefly.receiveMoney(ctx.wizard.state.amount, ctx.wizard.state.source, ctx.wizard.state.acc.id);
    if (res === 200) {
      ctx.reply(`Booked ${ ctx.wizard.state.amount } to ${ ctx.wizard.state.acc.name }.`);
    }
    else {
      ctx.reply('There was some kind of error...');
    }
    return ctx.scene.leave();
  },
);