const socket = io()
const search = document.querySelector('#search');
const searchForm = document.querySelector('#searchForm');
const contactListBarElement = document.querySelector('#contactListBar')
const sidebarTemplate = document.querySelector('#contactlistBar-template').innerHTML

var userList='';
var availableTags = [];

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
        document.getElementById('userProfile').style.display="block";
        document.getElementById('centerContent').style.opacity='1'
        document.getElementById('profileName').innerHTML = userData.name;
        document.getElementById('favGenre').innerHTML = 'Favourite Genre - '+userData.genre;
        document.getElementById('favAuthor').innerHTML = 'Most Favourite Author - '+userData.author;
        document.getElementById('favBook').innerHTML = 'Favourite Book - '+userData.book;
        document.getElementById('lastReadBook').innerHTML = 'Last Book Read - '+userData.lastReadBook;
        document.getElementById("myImg").src = "/images/bg1.jpg";
    }
})

socket.on('completeUserList',userListData =>{
    
    this.userList = userListData
    
    this.userList.forEach(item =>{
        availableTags.push(item.name)
    })
})

function saveUserData(userNAme, password, genre, author, book, lastReadBook) {

    socket.emit('joined', {
        name: userNAme,
        password: password,
        genre: genre,
        author: author,
        book: book,
        lastReadBook:lastReadBook
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
            
        });
    }
}

 function fetchAndStoreCompleteUserList() {
    socket.emit('fetchCompleteUserList');
} 

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const profileName = e.currentTarget[0].value;
    socket.emit('getUserDetails', profileName);
})


$( "#search" ).autocomplete({
    source: availableTags
  });


