'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wizard = require('telegraf/scenes/wizard');

var _wizard2 = _interopRequireDefault(_wizard);

var _markup = require('telegraf/markup');

var _markup2 = _interopRequireDefault(_markup);

var _firefly = require('../firefly');

var _firefly2 = _interopRequireDefault(_firefly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = new _wizard2.default('setDefaultAccount', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
    var _ref2, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.reply('Let me check your accounts...');
            _context.next = 3;
            return _firefly2.default.getAssetAccounts();

          case 3:
            _ref2 = _context.sent;
            data = _ref2.data;


            ctx.wizard.state.accounts = [];
            ctx.wizard.state.ids = [];
            data.forEach(function (el) {
              ctx.wizard.state.accounts.push(el.attributes.name);
              ctx.wizard.state.ids.push(el.id);
            });

            ctx.reply('Which is your default account?', _markup2.default.keyboard(ctx.wizard.state.accounts).oneTime().extra());

            return _context.abrupt('return', ctx.wizard.next());

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), function (ctx) {
  if (ctx.message.text.toLowerCase() === 'cancel') {
    ctx.reply('Ok, I cancelled the operation.');
    return ctx.scene.leave();
  } else {
    ctx.wizard.state.chosenAccount = {
      name: ctx.message.text,
      id: ctx.wizard.state.ids[ctx.wizard.state.accounts.findIndex(function (el) {
        return el === ctx.message.text;
      })]
    };
    ctx.reply('Is this correct: ' + ctx.wizard.state.chosenAccount.name + ' (Id: ' + ctx.wizard.state.chosenAccount.id + ')?', _markup2.default.keyboard(['Yes', 'No']).oneTime().extra());
    return ctx.wizard.next();
  }
}, function (ctx) {
  if (ctx.message.text.toLowerCase() === 'cancel') {
    ctx.reply('Ok, I cancelled the operation.');
    return ctx.scene.leave();
  }
  if (ctx.message.text === 'Yes') {
    ctx.session.defaultAccount = ctx.wizard.state.chosenAccount;
    ctx.reply('I set your default account to ' + ctx.session.defaultAccount.name);
  }
  return ctx.scene.leave();
});