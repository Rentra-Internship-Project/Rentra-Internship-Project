const axios = require('axios');
const payload = {
  messages: [{ role: 'user', text: 'Hi, what is Rentra?' }]
};

axios.post('http://localhost:3000/api/chat', payload)
  .then(res => console.log('Bot replied:', res.data.reply))
  .catch(err => console.error('Error:', err.response?.data || err.message));
