const express = require('express');
const router = express.Router();
const productsRepo = require('../../repositories/products');
const { validationResult } = require('express-validator');
const productsNewTemplate = require('../../views/admin/products/new');
const {requireTitle, requirePrice } = require('./validators');


router.get('/admin/products', (req, res) => {
});

router.get('/admin/products/new', (req, res) =>{
    res.send(productsNewTemplate({}))
});

router.post('/admin/products/new',[requireTitle, requirePrice], (req, res) =>{
    const errors = validationResult(req);
    //console.log(req.body);

    req.on('data', data=>{
        console.log(data.toString());
    } )
    res.send('submitted');
});

module.exports = router;

