const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt=util.promisify(crypto.scrypt);

class UserRepository {
    constructor(fileName){
        if(!fileName){
            throw new Error('Creating a repository requires a filename');
        }
        this.fileName=fileName;
        try {
            fs.accessSync(this.fileName);
        } catch (err) {
            fs.writeFileSync(this.fileName, '[]');
        }
        
    }
    async getAll(){
        //open the file calles this.fileName
        //Read its contents
        //parse the contents
        //return parsed data
        return JSON.parse(await fs.promises.readFile(this.fileName, {encoding: 'utf8'}));
    }

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
    }

    async comparePasswords(saved, supplied){
        //saved -> password saved in our database 'hashed.salt'
        //supplied -> password given to us by user trying to sign in
        const [hashed, salt] = saved.split('.'); 
        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);
        
        return hashed === hashedSuppliedBuffer.toString('hex');
    }

    async writeAll(records){
        await fs.promises.writeFile(this.fileName, JSON.stringify(records, null, 2));
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record=>record.id===id );

    }

    async delete(id){
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !==id );
        await this.writeAll(filteredRecords);
    }
    async update(id, attrs){
        const records = await this.getAll();
        const record = records.find(record=> record.id===id);
        if(!record) {
            throw new Error(`Record with ${id} not found`);
        }
        Object.assign(record, attrs);
        await this.writeAll(records);
    }
    async getOneBy(filters){
        const records = await this.getAll();

        for(let record of records) {
            let found = true;
            for(let key in filters){
                if(record[key] !== filters[key]){
                    found = false;
                }
            }
            if(found){
                return record;
            }
        }
    }
}

module.exports = new UserRepository('users.json');