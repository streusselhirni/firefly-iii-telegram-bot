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

exports.default = new _wizard2.default('takeMoney', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
    var acc, account, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Check if an account has been specified with "from Foobar"
            acc = ctx.message.text.match(/from\s(.+)/);

            // If cashAccount is not yet set

            if (ctx.session.cashAccount) {
              _context.next = 4;
              break;
            }

            ctx.reply('No cash account set yet. Use /setCash to set cash account.');
            return _context.abrupt('return', ctx.scene.leave());

          case 4:
            if (!(!ctx.session.defaultAccount && acc === null)) {
              _context.next = 7;
              break;
            }

            ctx.reply('No default asset account set yet. Use /setDefault to set default asset account.');
            return _context.abrupt('return', ctx.scene.leave());

          case 7:

            ctx.wizard.state.acc = {};

            if (!(acc !== null)) {
              _context.next = 19;
              break;
            }

            _context.next = 11;
            return _firefly2.default.getAssetAccountByName(acc[1]);

          case 11:
            account = _context.sent;

            if (account) {
              _context.next = 15;
              break;
            }

            // No account found
            ctx.reply('Account "' + acc[1] + ' not found. Cancelling.');
            return _context.abrupt('return', ctx.scene.leave());

          case 15:
            ctx.wizard.state.acc.name = account.attributes.name;
            ctx.wizard.state.acc.id = account.id;
            _context.next = 21;
            break;

          case 19:
            ctx.wizard.state.acc.name = ctx.session.defaultAccount.name;
            ctx.wizard.state.acc.id = ctx.session.defaultAccount.id;

          case 21:
            res = ctx.message.text.match(/[Tt]ake\s(\d+(\.\d{0,2})?)/);

            ctx.wizard.state.amount = res[1];

            ctx.reply('You want to take ' + ctx.wizard.state.amount + ' from ' + ctx.wizard.state.acc.name + '. Correct?', _markup2.default.keyboard(['Yes', 'No']).oneTime().extra());
            return _context.abrupt('return', ctx.wizard.next());

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(ctx.message.text === 'No')) {
              _context2.next = 3;
              break;
            }

            ctx.reply('Ok. Cancelling');
            return _context2.abrupt('return', ctx.scene.leave());

          case 3:
            _context2.next = 5;
            return _firefly2.default.takeMoney(ctx.wizard.state.amount, ctx.wizard.state.acc.id, ctx.session.cashAccount.id);

          case 5:
            res = _context2.sent;

            if (res === 200) {
              ctx.reply('Took ' + ctx.wizard.state.amount + ' from ' + ctx.wizard.state.acc.name + '.');
            } else {
              ctx.reply('There was some kind of error');
            }
            return _context2.abrupt('return', ctx.scene.leave());

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());