const socket = io()


const contactListBarElement = document.querySelector('#contactListBar')
const sidebarTemplate = document.querySelector('#contactlistBar-template').innerHTML

socket.on('warning', (message) => {
    alert(message)
    location.href = '/'
})

socket.on('contactList', (userData) => {

    if (userData.length > 0) {
        var contactList = userData[0].contactList
    } else {
        contactList = []
    }

    var title = "your contact book"
    const html = Mustache.render(sidebarTemplate, {
        contactList
    })
    contactListBarElement.innerHTML = html
    addClickableActionToContacts();

})

socket.on('profileDetails', (userData) => {
    if(userData === undefined || userData === null){
        alert('invalid profile')
        document.getElementById('userProfile').style.display="none";
    } else {
        
    }
})

function saveUserData(userNAme, password, genre, author, book) {

    socket.emit('joined', {
        name: userNAme,
        password: password,
        genre: genre,
        author: author,
        book: book
    }, (callback) => {

        console.log(callback)
    })
}

function validateLoginCreds(userName, password) {
    socket.emit('validateCreds', {
        name: userName,
        password: password
    })
}

/*
function to add a contact to the fiile
*/

function addContact(userName, contact) {
    socket.emit('addContact', {
        userName: userName,
        contact: contact
    }, (callback) => {
        console.log(callback)
    })
}


function fetchAndDisplayContactList(userName) {
    socket.emit('fetchContact', userName);

}



function addClickableActionToContacts() {
    const buttons = document.getElementsByClassName('contactItem');
    for (let i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener('mouseenter', e => {
            buttons[i].style.height = '20px';
        });

        buttons[i].addEventListener('mouseleave', e => {
            buttons[i].style.height = '10px';
        });

        buttons[i].addEventListener('click', e => {
            var profileName = buttons[i].innerText;
            socket.emit('getUserDetails', profileName);
            document.getElementById('userProfile').style.display="block";
        });
    }
}

