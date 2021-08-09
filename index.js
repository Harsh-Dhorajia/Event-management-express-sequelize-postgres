const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./server/models')
// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

require("./server/routes")(app);

db.sequelize.sync()
  .then(async () => {
    app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT))
    console.log('DB connection established')
  });
module.exports = app;