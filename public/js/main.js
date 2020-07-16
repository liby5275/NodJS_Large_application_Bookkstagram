const socket = io()
const fs = require('fs')

function saveUserData(userNAme, genre, author, book) {
    console.log('out to save the user details')

    socket.emit('joined', {
        name: userNAme,
        genre: genre,
        author:author,
        book:book
    }, (callback) => {
        
        console.log(callback)
    })
}

/*
function to add a contact to the fiile
*/

function addContact(userName, contact){
    socket.emit('addContact',{
        userName:userName,
        contact:contact
    }, (callback) => {
        console.log(callback)
    })
}


function getContactsList (userName) {
    console.log('entering the getcontactsContent function to check the presence of the file')
    socket.emit('fetchContact',userName, callback=>{
        console.log(callback)
    })
    
}

socket.on('warning', (message) => {
    alert(message)
    location.href = '/'
})