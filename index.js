const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['hj4h5k432h5kj43h5kj243h']
}));

app.get('/signup', (req, res) =>{
    res.send(`
        <form method="POST">
            Your id is: ${req.session .userId}
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    `);
    
});


app.post('/signup', async (req, res)=>{
    const {email, password, passwordConfirmation}=req.body;
    const existingUser = await usersRepo.getOneBy({email});

    if(existingUser){
        return res.send('Email in use');    
    }
    if(password!==passwordConfirmation){
        return res.send('Passwords must match');
    }

    //create a user in our user repo to represent this person
    const user = await usersRepo.create({email: email, password: password});

    //store  the if of  that user inside the users cookie
    req.session.userId = user.id;

    console.log(req.body);
    res.send('account created');
})

app.get('/signout', (req, res)=>{
    req.session=null;
    res.send('You are logged out');
});

app.get('/signin', (req, res) =>{
    res.send(`
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form> 
    `);
})

app.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    const user = await usersRepo.getOneBy({email: email});

    if(!user){
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    )

    if(!validPassword){
        return res.send('Invalid password');
    }

    req.session.userId = user.id;
    res.send('You are signed in');
    
}); 

app.listen(3000, ()=>{
    console.log('listening');
})

