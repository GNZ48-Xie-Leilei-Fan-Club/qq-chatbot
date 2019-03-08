const Devour = require('devour-client');

const jsonApi = new Devour(
    {
        apiUrl: 'apiaddress'
    }
)

// Define Model
jsonApi.define('keyworded_response', {
    keyword: '',
    response: '',
}, {
    collectionPath: 'keyworded_response'
});

module.exports = jsonApi;
