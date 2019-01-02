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

exports.default = new _wizard2.default('payMoney', // name of scene
function (ctx) {
  var txtParts = ctx.message.text.split(', ');
  ctx.wizard.state.amount = txtParts[0]; // Store amount in wizard state
  ctx.wizard.state.desc = txtParts[1]; // Store description in wizard state
  ctx.wizard.state.acc = ctx.session.defaultAccount ? ctx.session.defaultAccount : { name: undefined, id: undefined }; // store default account or null in wizard state
  if (txtParts.length > 2) {
    ctx.wizard.state.acc.name = txtParts[2]; // Overwrite account with account from message if it exists
    ctx.wizard.state.acc.id = undefined;
  }
  ctx.reply('You paid ' + ctx.wizard.state.amount + ' for ' + ctx.wizard.state.desc + ' from ' + ctx.wizard.state.acc.name + '. Is this correct?', _markup2.default.keyboard(['Yes', 'No']).oneTime().extra());
  return ctx.wizard.next();
}, function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
    var account;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(ctx.message.text.toLowerCase() === 'no')) {
              _context.next = 5;
              break;
            }

            ctx.reply('I\'ll ignore it. Please try again.');
            return _context.abrupt('return', ctx.scene.leave());

          case 5:
            if (ctx.wizard.state.acc.id) {
              _context.next = 14;
              break;
            }

            _context.next = 8;
            return _firefly2.default.getAssetAccountByName(ctx.wizard.state.acc.name);

          case 8:
            account = _context.sent;

            if (account) {
              _context.next = 12;
              break;
            }

            // No account found
            ctx.reply('No account found. Cancelling.');
            return _context.abrupt('return', ctx.scene.leave());

          case 12:
            ctx.wizard.state.acc.name = account.attributes.name;
            ctx.wizard.state.acc.id = account.id;

          case 14:
            // Pay Money
            _firefly2.default.payMoney(ctx.wizard.state.amount, ctx.wizard.state.acc.id, ctx.wizard.state.desc).then(function (res) {
              ctx.reply('I booked ' + ctx.wizard.state.desc + ' (' + ctx.wizard.state.amount + ') from ' + ctx.wizard.state.acc.name + '.');
            }).catch(function (err) {
              ctx.reply('There was an error. The transaction has been cancelled.');
              console.error(err.response);
            });
            return _context.abrupt('return', ctx.scene.leave());

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());