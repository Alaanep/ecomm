const express = require('express');

const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/cart/show');

const router = express.Router();

//receive a post request to add  an item to a cart
router.post('/cart/products', async (req, res)=>{
   
    let cart;
    //figure out the cart!
    if(!req.session.cartId){
        //we dont have a cart, we need to create one
        //and store the cart id on the req.session.cartId property
        cart = await cartsRepo.create({items: []});
        req.session.cartId = cart.id;
    } else {
        //we have a cart! Lets get it from the repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId);

    if(existingItem){
    //increment qty for existing product and save cart
        existingItem.quantity++;
    } else {
    //OR add new product to items array
        cart.items.push({id: req.body.productId, quantity:1})
    }
    //save cart
    await cartsRepo.update(cart.id, {items: cart.items  });


    console.log(cart);
    res.redirect('/cart')
});

//receive a get request to show all items in cart
router.get('/cart', async (req, res) =>{
    if(!req.session.cartId){
        res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for(let item of cart.items){
        const product = await productsRepo.getOne(item.id);
        item.product= product;
    }
    res.send(cartShowTemplate({items: cart.items}))
});

//Receive a post request to delete an item from a cart
router.post('/cart/products/delete', async(req, res)=>{
    const {itemId} = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter(item=> item.id !== itemId);

    await cartsRepo.update(req.session.cartId, {items: items});
    res.redirect('/cart')
});


module.exports = router;