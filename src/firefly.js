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

  static payMoney(amount, accountId, description) {
    let date = (new Date()).getDate();
    if (date < 10) {
      date = '0' + date.toString();
    }
    let month = ((new Date()).getMonth()) + 1;
    if (month < 10) {
      month = '0' + month.toString();
    }
    let year = (new Date()).getFullYear().toString();

    let datestring = year + '-' + month + '-' + date;

    return api.post('transactions', {
      'type': 'withdrawal',
      'description': description,
      'date': datestring,
      'transactions': [
        { 'amount': amount, 'source_id': accountId },
      ],
    });
  }
}
