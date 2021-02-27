const fs = require('fs');
const crypto = require('crypto');
const { getAll } = require('./users');

module.exports = class Repository{
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

    async create(attrs){
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
        return attrs;
    }   

    async getAll(){
        //open the file calles this.fileName
        //Read its contents
        //parse the contents
        //return parsed data
        return JSON.parse(await fs.promises.readFile(this.fileName, {encoding: 'utf8'}));
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