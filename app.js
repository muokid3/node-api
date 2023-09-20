const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Contol-Allow-Origin', '*');
    res.setHeader("Access-Contol-Allow-Methods", "GET< POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Contol-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use('/feed', feedRoutes);


app.listen(8080);