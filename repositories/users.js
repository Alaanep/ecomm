const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt=util.promisify(crypto.scrypt);

class UserRepository extends Repository {
    async create(attrs){
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer = await scrypt(attrs.password, salt, 64);

        attrs.id=this.randomId();
        const records = await this.getAll();
        const record = {
            ...attrs, 
            password: `${buffer.toString('hex')}.${salt}` 
        };

        records.push(record);
        //write the updated 'records' array back to this.filename
        await this.writeAll(records); 
        return record;
    };

    async comparePasswords(saved, supplied){
        //saved -> password saved in our database 'hashed.salt'
        //supplied -> password given to us by user trying to sign in
        const [hashed, salt] = saved.split('.'); 
        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);
        
        return hashed === hashedSuppliedBuffer.toString('hex');
    };
}

module.exports = new UserRepository('users.json');