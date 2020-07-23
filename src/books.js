const request = require('request')



const getBooksForSearchedString = (urlSearchString, callback) => {

    var url = 'https://www.googleapis.com/books/v1/volumes?q='+urlSearchString
    

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('error occured', undefined)
        } else {
            callback(undefined, response.body.items) 
        }
    })
}

module.exports = {
    getBooksForSearchedString: getBooksForSearchedString
}