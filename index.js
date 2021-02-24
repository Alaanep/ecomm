const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['hj4h5k432h5kj43h5kj243h']
}));
app.use(authRouter);

app.listen(3000, ()=>{
    console.log('listening');
})

