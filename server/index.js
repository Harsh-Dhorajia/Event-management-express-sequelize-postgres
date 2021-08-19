require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./models');
// Set up the express app
const app = express();
const { port } = require('./config/config');
// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

require('./routes')(app);

db.sequelize.sync({ alter: true })
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`listening on port ${port}`);
    });
    // eslint-disable-next-line no-console
    console.log('DB connection established');
  }).catch(error => {
    // eslint-disable-next-line no-console
    console.log('Error in db connection');
    throw new Error(error);
  });
module.exports = app;
