const express                   = require('express');
const usersRepo                 = require('../../repositories/users.js');
const signupTemplate            = require('../../views/admin/auth/signup');
const signinTemplate            = require('../../views/admin/auth/signin');
const {check, validationResult} = require('express-validator');
const { requireEmail, 
        checkPassword, 
        checkpasswordConfirmation, 
        requireEmailExists, 
        requireValidPasswordForUser 
        }                       = require('./validators');

const router= express.Router();

router.get('/signup', (req, res) =>{
    res.send(signupTemplate({req}));
});


router.post('/signup', 
    [requireEmail, checkPassword, checkpasswordConfirmation ],  
    async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.send(signupTemplate({req, errors}));
        }
        console.log(errors)

        const {email, password, passwordConfirmation}=req.body;


        //create a user in our user repo to represent this person
        const user = await usersRepo.create({email: email, password: password});
        
        //store  the if of  that user inside the users cookie
        req.session.userId = user.id;
        
        console.log(req.body);
        res.send('account created');
    }
);

router.get('/signout', (req, res)=>{
    req.session=null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) =>{
    res.send(signinTemplate({req}));
})

router.post('/signin',
    [   
        requireEmailExists,
        requireValidPasswordForUser
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.send(signinTemplate({req, errors}))
        }
        console.log(errors);
        const {email, password} = req.body;
        const user = await usersRepo.getOneBy({email});
        req.session.userId = user.id;
        res.send('You are signed in');
    
}); 

module.exports=router;