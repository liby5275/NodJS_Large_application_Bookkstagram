const socket = io()

const contactListBarElement = document.querySelector('#contactListBar')
const sidebarTemplate = document.querySelector('#contactlistBar-template').innerHTML

socket.on('warning', (message) => {
    alert(message)
    location.href = '/'
})

socket.on('contactList', (userData) => {

    console.log('conatct lisr it '+userData[0].contactList)
    
    var contactList = userData[0].contactList
    var title ="your contact book"
    const html = Mustache.render(sidebarTemplate, {
        contactList
    })
    contactListBarElement.innerHTML = html
})

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


function fetchAndDisplayContactList (userName) {
    socket.emit('fetchContact',userName);
    
}

