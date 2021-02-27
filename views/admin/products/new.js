const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
    return layout ({
        content: 
            `
            <form method='post' enctype='multipart/form-data'>
                <input placeholder='Title' name='title'/>
                <input placeholder='Price' name='price'/>
                <input type='file' name='image' />
                <button>Submit</button>
            </form>
            `
    })
};