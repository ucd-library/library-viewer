const express = require('express');
const app = express();
const path = require('path')

app.use(express.static(path.join(__dirname, 'client/public')));

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});