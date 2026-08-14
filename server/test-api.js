const http = require('http');

http.get('http://localhost:3000/api/equipment', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const equipment = JSON.parse(data);
      if (!equipment || equipment.length === 0) {
        console.log('No equipment found in API');
        return;
      }
      
      const equipId = equipment[0]._id || equipment[0].id;
      console.log('Testing equipment ID:', equipId);
      
      http.get(`http://localhost:3000/api/equipment/${equipId}/reviews`, (res2) => {
        let data2 = '';
        res2.on('data', chunk => { data2 += chunk; });
        res2.on('end', () => {
          console.log('Reviews API Response Code:', res2.statusCode);
          console.log('Reviews API Response:', data2);
        });
      });
      
    } catch(e) {
      console.error('Error parsing response:', e);
    }
  });
}).on('error', (err) => {
  console.error('API request failed:', err.message);
});
