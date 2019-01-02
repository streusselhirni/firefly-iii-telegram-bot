const axios = require('axios');

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Authorization': 'Bearer ' + process.env.OAUTH_TOKEN,
  },
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

export default class Firefly {
  static async getAssetAccounts() {
    let { data } = await api.get('accounts?type=asset');
    return data;
  }

  static async getAssetAccountByName(name) {
    if (name === undefined) name = '';
    let { data } = await this.getAssetAccounts();
    return data.find((el) => el.attributes.name.toLowerCase() === name.toLowerCase());
  }

  static getToday() {
    let date = (new Date()).getDate();
    if (date < 10) {
      date = '0' + date.toString();
    }
    let month = ((new Date()).getMonth()) + 1;
    if (month < 10) {
      month = '0' + month.toString();
    }
    let year = (new Date()).getFullYear().toString();

    return (year + '-' + month + '-' + date);
  }

  static payMoney(amount, accountId, description) {
    return api.post('transactions', {
      'type': 'withdrawal',
      'description': description,
      'date': this.getToday(),
      'transactions': [
        { 'amount': amount, 'source_id': accountId },
      ],
    });
  }

  static async takeMoney(amount, sourceId, targetId) {
    let res = await api.post('transactions', {
      'type': 'transfer',
      'description': 'Geld abheben',
      'date': this.getToday(),
      'transactions': [
        {
          'amount': amount,
          'source_id': sourceId,
          'destination_id': targetId,
        },
      ],
    });
    return res.status;
  }

  static async receiveMoney(amount, sourceName, targetId) {
    let res = await api.post('transactions', {
      'type': 'deposit',
      'description': 'Geld erhalten',
      'date': this.getToday(),
      'transactions': [
        {
          'amount': amount,
          'source_name': sourceName,
          'destination_id': targetId,
        },
      ],
    });
    return res.status;
  }
}
