const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);



app.listen(5500, function () {
    console.log('Assignment app listening on port 5500!');
})