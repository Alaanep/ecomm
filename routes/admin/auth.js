const express        = require('express');

const {handleErrors} = require('./middlewares')
const usersRepo      = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

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
    [requireEmail, checkPassword, checkpasswordConfirmation ], handleErrors(signupTemplate),  
    async (req, res)=>{
        const {email, password}=req.body;
        //create a user in our user repo to represent this person
        const user = await usersRepo.create({email: email, password: password});
        //store  the if of  that user inside the users cookie
        req.session.userId = user.id;
        res.redirect('/admin/products');
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
    handleErrors(signinTemplate), 
    async (req, res) => {
        const {email, password} = req.body;
        const user = await usersRepo.getOneBy({email});
        req.session.userId = user.id;
        res.redirect('/admin/products');
    
}); 

module.exports=router;