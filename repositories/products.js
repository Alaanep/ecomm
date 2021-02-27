const Repository = require('./repository');

class ProductsRepsitory extends Repository {
}

module.exports = new ProductsRepsitory('products.json');