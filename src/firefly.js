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

const firefly = {
  getAssetAccounts: function() {
    return api.get('accounts?type=asset');
  }
};

export default firefly;
