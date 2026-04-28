const express = require('express')
const app = express()
const connectDB = require('./Configuration/DBConnection');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
const feedbackRoute = require('./route/feedbackroute');
app.use('/', feedbackRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
