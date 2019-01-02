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

exports.default = new _wizard2.default('receiveMoney', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
    var text, amount, source, dest, acc;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            text = ctx.message.text;
            amount = text.match(/(\d+(\.\d{0,2})?)/);
            source = text.match(/from\s["„'‚]?([^"„“'‚‘]+)["“'‘]?/);
            dest = text.match(/to\s["„'‚]([^"„“'‚‘]+)["“'‘]/);

            if (dest == null && ctx.session.cashAccount) {
              dest = ['placeholder', ctx.session.cashAccount.name];
            }

            if (!(amount == null || source == null || dest == null)) {
              _context.next = 10;
              break;
            }

            ctx.reply('There was some wrong syntax. Please try again.');
            return _context.abrupt('return', ctx.scene.leave());

          case 10:
            ctx.wizard.state.amount = amount[1];
            ctx.wizard.state.source = source[1];

            _context.next = 14;
            return _firefly2.default.getAssetAccountByName(dest[1]);

          case 14:
            acc = _context.sent;

            if (acc) {
              _context.next = 18;
              break;
            }

            ctx.reply('Account ' + dest[1] + ' does not exist. Aborting.');
            return _context.abrupt('return', ctx.scene.leave());

          case 18:
            ctx.wizard.state.acc = {};
            ctx.wizard.state.acc.name = acc.attributes.name;
            ctx.wizard.state.acc.id = acc.id;

          case 21:
            ctx.reply(ctx.wizard.state.acc.name + ' received ' + ctx.wizard.state.amount + ' from ' + ctx.wizard.state.source + '. Is this correct?', _markup2.default.keyboard(['Yes', 'No']).oneTime().extra());
            return _context.abrupt('return', ctx.wizard.next());

          case 23:
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

            ctx.reply('Ok. Aborting...');
            return _context2.abrupt('return', ctx.scene.leave());

          case 3:
            _context2.next = 5;
            return _firefly2.default.receiveMoney(ctx.wizard.state.amount, ctx.wizard.state.source, ctx.wizard.state.acc.id);

          case 5:
            res = _context2.sent;

            if (res === 200) {
              ctx.reply('Booked ' + ctx.wizard.state.amount + ' to ' + ctx.wizard.state.acc.name + '.');
            } else {
              ctx.reply('There was some kind of error...');
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