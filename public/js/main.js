const socket = io()
const search = document.querySelector('#search');
const searchForm = document.querySelector('#searchForm');
const contactListBarElement = document.querySelector('#contactListBar')
const contactIndicator = document.getElementById("contactIndicator")
const chatIndicator = document.getElementById("chatIndicator")
const editIcon = document.getElementById("editIcon")
const bookSearchPanel = document.getElementById("bookSearchPanel")
const goButtonBookShelf = document.getElementById("goButtonBookShelf")
const sidebarTemplate = document.querySelector('#contactlistBar-template').innerHTML

var userList = '';
var availableTags = [];
var bookListLocal = [];
var bookListWithNameAndAuthor = [];
var isAddedToContact;


/*
************************************************
* This section is for socket listeners *********
************************************************
*/

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

socket.on('profileDetails', ({ userData, isAddedToContact, isAddedConnection }) => {
    if (userData === undefined || userData === null) {
        alert('invalid profile')
        document.getElementById('userProfile').style.display = "none";
    } else {
        
        document.getElementById('centerContent').style.opacity = '1'
        document.getElementById('profileName').innerHTML = userData.name;
        document.getElementById('favGenre').innerHTML = 'Favourite Genre - ' + userData.genre;
        document.getElementById('favAuthor').innerHTML = 'Most Favourite Author - ' + userData.author;
        document.getElementById('favBook').innerHTML = 'Favourite Book - ' + userData.book;
        document.getElementById('lastReadBook').innerHTML = 'Last Book Read - ' + userData.lastReadBook;
        document.getElementById("myImg").src = "/images/bg1.jpg";
        this.isAddedToContact = isAddedToContact;
        if (isAddedToContact || isAddedToContact === 'true') {
            document.getElementById("contactIndicator").src = "/images/tick.jpg";
        } else {
            document.getElementById("contactIndicator").src = "/images/add.jpg";
        }
        document.getElementById('userProfile').style.display = "block";
    }

})

socket.on('SelfProfileDetails', userData => {
    document.getElementById("profilePic").src = "/images/bg1.jpg";
    document.getElementById('myProfileName').innerHTML = userData.name;
    document.getElementById('currentlyReading').innerHTML = 'Current Read - '+userData.currentRead;
    document.getElementById('favDetails').innerHTML = userData.genre + ' '+'lover'+' || ' +userData.author + ' fan';
})

socket.on('completeUserList', userListData => {

    this.userList = userListData

    this.userList.forEach(item => {
        availableTags.push(item.name)
    })
})

socket.on('contactAdded',contact=>{
    alert(contact + ' has been added to your contact')
    document.getElementById("contactIndicator").src = "/images/tick.jpg";
})


socket.on('bookListPerSearch', bookListData => {
    for(let i=0; i<bookListData.length || i<5; i++){
    this.bookListLocal.push(bookListData[i]);
    }
    
    //this.bookListWithNameAndAuthor = []
    if(bookListData != null && bookListData !=undefined){
    for(let i=0; i<bookListData.length || i<5; i++){
        if(bookListData[i].volumeInfo.authors != undefined){
        this.bookListWithNameAndAuthor.push(bookListData[i].volumeInfo.title+' by '
        +bookListData[i].volumeInfo.authors[0])}
        else {
            this.bookListWithNameAndAuthor.push(bookListData[i].volumeInfo.title)
        }
    }
}

    

})




/***********************************************
 * This is for functions
 ***********************************************/

function saveUserData(userNAme, password, genre, author, book, lastReadBook, currentRead) {

    socket.emit('joined', {
        name: userNAme,
        password: password,
        genre: genre,
        author: author,
        book: book,
        lastReadBook: lastReadBook,
        currentRead:currentRead
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
            this.profileNameLocal = profileName;
            socket.emit('getUserDetails', {
                profileName: profileName,
                userName: this.userNameLocal
            });

        });
    }
}

function fetchAndStoreCompleteUserList() {
    socket.emit('fetchCompleteUserList');
}

function fetchAndDisplaySelfProfile(userName) {
    
    socket.emit('getUserDetails', {
        profileName: userName,
        userName: userName
    });
}


/*
*  search related listeners
*/
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const profileName = e.currentTarget[0].value;
    this.profileNameLocal = profileName;
    
    socket.emit('getUserDetails', {
        profileName: profileName,
        userName: this.userNameLocal
    });
})

bookSearchForm.addEventListener('submit', e => {
    e.preventDefault();
    const searchedBookName = e.currentTarget[0].value;
    const valueSplitted = searchedBookName.split(' by ');
    if(this.bookListLocal.length>0){

        for(let i =0; i<bookListLocal.length; i++){
            if(bookListLocal[i].volumeInfo.title === valueSplitted[0]) {
                document.getElementById('bookProfile').style.display='flex';
                document.getElementById('bookImage').src = bookListLocal[i].volumeInfo.imageLinks.thumbnail;
                document.getElementById('bookName').innerHTML = valueSplitted[0].substring(0, 35);
                document.getElementById('bookAuthor').innerHTML = bookListLocal[i].volumeInfo.authors[0]
                document.getElementById('genreIconValue').innerHTML = bookListLocal[i].volumeInfo.categories[0];
                document.getElementById('ratingIconValue').innerHTML =  bookListLocal[i].volumeInfo.averageRating +'/5';
                document.getElementById('totalPagesIconValue').innerHTML =  bookListLocal[i].volumeInfo.pageCount+ ' pages'
                document.getElementById('bookDescription').innerHTML = bookListLocal[i].volumeInfo.description;
                break;
            }
        }

    } else {
        alert('no such book found');
    }
})

bookSearchPanel.addEventListener('input', e =>{
    var currentTypedString = e.target.value;
    
    if(currentTypedString.length > 2){
        socket.emit('searchBookWithString', currentTypedString);
    }
})


$("#search").autocomplete({
    source: availableTags
});

$("#bookSearchArea").autocomplete({
    source: bookListWithNameAndAuthor
});
     
/*
* contact and my profile section
*/

contactIndicator.addEventListener('mouseenter', e => {
    document.getElementById('contactIndicatorText').style.display = "block"
    document.getElementById('contactIndicatorText').style.color = "#000"
    if (this.isAddedToContact || this.isAddedToContact === true) {
        document.getElementById('contactIndicatorText').innerHTML = "Already in your contacts"
    } else {
        document.getElementById('contactIndicatorText').innerHTML = "Add to your contacts"
    }
})

contactIndicator.addEventListener('mouseleave', e => {
    document.getElementById('contactIndicatorText').style.display = "none"
})

contactIndicator.addEventListener('click', e => {
    if (this.isAddedToContact || this.isAddedToContact === true) {
        alert('already present in your contact')
    } else {
        this.addContact(this.userNameLocal, profileNameLocal)
    }
})


chatIndicator.addEventListener('mouseenter', e => {
    document.getElementById('contactIndicatorText').style.display = "block"
    document.getElementById('contactIndicatorText').style.color = "#000"
    document.getElementById('contactIndicatorText').innerHTML = "Chat with "+this.profileNameLocal
   
})

chatIndicator.addEventListener('mouseleave', e => {
    document.getElementById('contactIndicatorText').style.display = "none"
})

editIcon.addEventListener('click', e =>{
    document.getElementById('bookSearchPanel').style.display = "block"
})

/*
* book suggestion section
*/
goButtonBookShelf.addEventListener('click', e => {
    var selected = document.getElementById('bookShelf').value;
    var bookName = document.getElementById('bookName').innerHTML
    if( selected === 'Not Read'){
        alert('please select a book shelf other that (not read)')
    } else {
        socket.emit('updateBookShelf', selected,this.userNameLocal,bookName)
        alert('Book shelf updated!')
    }
})


