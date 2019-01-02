'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');

var api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Authorization': 'Bearer ' + process.env.OAUTH_TOKEN
  }
});

/*

api.post('transactions', {
  'type': 'withdrawal',
  'description': 'Test',
  'date': '2019-01-01',
  'transactions': [
    {
      'amount': 15.45,
      'source_id': 147,
    },
  ],
}).then(res => console.log(res.data)).catch(err => console.log(err.response.data.errors));*/

var Firefly = function () {
  function Firefly() {
    _classCallCheck(this, Firefly);
  }

  _createClass(Firefly, null, [{
    key: 'getAssetAccounts',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _ref2, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return api.get('accounts?type=asset');

              case 2:
                _ref2 = _context.sent;
                data = _ref2.data;
                return _context.abrupt('return', data);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAssetAccounts() {
        return _ref.apply(this, arguments);
      }

      return getAssetAccounts;
    }()
  }, {
    key: 'getAssetAccountByName',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
        var _ref4, data;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (name === undefined) name = '';
                _context2.next = 3;
                return this.getAssetAccounts();

              case 3:
                _ref4 = _context2.sent;
                data = _ref4.data;
                return _context2.abrupt('return', data.find(function (el) {
                  return el.attributes.name.toLowerCase() === name.toLowerCase();
                }));

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getAssetAccountByName(_x) {
        return _ref3.apply(this, arguments);
      }

      return getAssetAccountByName;
    }()
  }, {
    key: 'getToday',
    value: function getToday() {
      var date = new Date().getDate();
      if (date < 10) {
        date = '0' + date.toString();
      }
      var month = new Date().getMonth() + 1;
      if (month < 10) {
        month = '0' + month.toString();
      }
      var year = new Date().getFullYear().toString();

      return year + '-' + month + '-' + date;
    }
  }, {
    key: 'payMoney',
    value: function payMoney(amount, accountId, description) {
      return api.post('transactions', {
        'type': 'withdrawal',
        'description': description,
        'date': this.getToday(),
        'transactions': [{ 'amount': amount, 'source_id': accountId }]
      });
    }
  }, {
    key: 'takeMoney',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(amount, sourceId, targetId) {
        var res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return api.post('transactions', {
                  'type': 'transfer',
                  'description': 'Geld abheben',
                  'date': this.getToday(),
                  'transactions': [{
                    'amount': amount,
                    'source_id': sourceId,
                    'destination_id': targetId
                  }]
                });

              case 2:
                res = _context3.sent;
                return _context3.abrupt('return', res.status);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function takeMoney(_x2, _x3, _x4) {
        return _ref5.apply(this, arguments);
      }

      return takeMoney;
    }()
  }, {
    key: 'receiveMoney',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(amount, sourceName, targetId) {
        var res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return api.post('transactions', {
                  'type': 'deposit',
                  'description': 'Geld erhalten',
                  'date': this.getToday(),
                  'transactions': [{
                    'amount': amount,
                    'source_name': sourceName,
                    'destination_id': targetId
                  }]
                });

              case 2:
                res = _context4.sent;
                return _context4.abrupt('return', res.status);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function receiveMoney(_x5, _x6, _x7) {
        return _ref6.apply(this, arguments);
      }

      return receiveMoney;
    }()
  }]);

  return Firefly;
}();

exports.default = Firefly;