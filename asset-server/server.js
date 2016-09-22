var send  = require('koa-send');
var koa   = require('koa');
var path  = require('path');

var app   = koa();

// Always serve index.html and a 200 status code for every request
app.use(function *() {
    yield send(this, 'index.html', { root: path.join(__dirname, '../build') });
});

app.listen(8081);