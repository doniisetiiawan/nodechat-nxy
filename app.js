const express = require('express');
const routes = require('./routes');

const app = express();
const port = 3000;

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.loginProcess);
app.get('/chat', routes.chat);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
