const Devour = require('devour-client');

let apiAddress = '';

// To configure the external API from which the chatbot fetch keyworded responses
// Change `apiaddress` to your external api address.
const jsonApi = new Devour(
    {
        apiUrl: 'apiaddress'
    }
)

// Define Model
// If your KeywordedResponse list view is in a different path
// Change `collectionPath` to the corresponding path for the resource.
jsonApi.define('keyworded_response', {
    keyword: '',
    response: '',
}, {
    collectionPath: 'keyworded_responses'
});

jsonApi.define('ignore_number', {
    number: '',
    note: '',
}, {
    collectionPath: 'ignore_numbers',
});

module.exports = { jsonApi, apiAddress };
