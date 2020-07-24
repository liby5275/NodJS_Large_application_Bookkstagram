const socket = io()
const search = document.querySelector('#search');
const searchForm = document.querySelector('#searchForm');
const contactListBarElement = document.querySelector('#contactListBar')
const contactIndicator = document.getElementById("contactIndicator")
const chatIndicator = document.getElementById("chatIndicator")
const connectionIndicator = document.getElementById("connectionIndicator")
const editIcon = document.getElementById("editIcon")
const bookSearchPanel = document.getElementById("bookSearchPanel")
const goButtonBookShelf = document.getElementById("goButtonBookShelf")
const sidebarTemplate = document.querySelector('#contactlistBar-template').innerHTML

var userList = '';
var availableTags = [];
var bookListLocal = [];
var bookListWithNameAndAuthor = [];
var isAddedToContact;
var isAddedAsConnection;


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
        this.isAddedAsConnection = isAddedConnection;
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
    document.getElementById('currentlyReading').innerHTML = 'CR: ' + userData.currentRead.substring(0, 35);
    document.getElementById('favDetails').innerHTML = userData.genre + ' ' + 'lover' + ' || ' + userData.author + ' fan';
})

socket.on('completeUserList', userListData => {

    this.userList = userListData

    this.userList.forEach(item => {
        availableTags.push(item.name)
    })
})

socket.on('contactAdded', contact => {
    alert(contact + ' has been added to your contact')
    document.getElementById("contactIndicator").src = "/images/tick.jpg";
})


socket.on('bookListPerSearch', bookListData => {
    for (let i = 0; i < bookListData.length || i < 5; i++) {
        this.bookListLocal.push(bookListData[i]);
    }

    //this.bookListWithNameAndAuthor = []
    if (bookListData != null && bookListData != undefined) {
        for (let i = 0; i < bookListData.length || i < 5; i++) {
            if (bookListData[i].volumeInfo.authors != undefined) {
                this.bookListWithNameAndAuthor.push(bookListData[i].volumeInfo.title + ' by '
                    + bookListData[i].volumeInfo.authors[0])
            }
            else {
                this.bookListWithNameAndAuthor.push(bookListData[i].volumeInfo.title)
            }
        }
    }



})

socket.on('connectionAdded', profileName => {
    this.isAddedAsConnection = true;
    alert(profileName+' has been added as your connection')
})

socket.on('dummy',()=>{
    console.log('hello there')
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
        currentRead: currentRead
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


const getBooks = async (book) => {
    const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${book}`
    );
    const data = await response.json();
    return data;
};

const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}40`;
const toggleSwitch = document.querySelector(
    '.theme-switch input[type="checkbox"]'
);

const extractThumbnail = ({ imageLinks }) => {
    const DEFAULT_THUMBNAIL = "";
    if (!imageLinks || !imageLinks.thumbnail) {
        return DEFAULT_THUMBNAIL;
    }
    return imageLinks.thumbnail.replace("http://", "https://");
};

const drawListBook = async () => {
    document.getElementById('bookProfile').style.display='none';
    if (searchBooks.value != "") {
        bookContainer.style.display = "flex";
        bookContainer.innerHTML = `<div class='prompt'><div class="loader"></div></div>`;
        const data = await getBooks(`${searchBooks.value}&maxResults=4`);
        if (data.error) {
            bookContainer.innerHTML = `<div class='prompt'>ツ Limit exceeded! Try after some time</div>`;
        } else if (data.totalItems == 0 || data.totalItems == undefined) {
            bookContainer.innerHTML = `<div class='prompt'>ツ No results, try a different term!</div>`;
        } else {
            for (let i = 0; i < data.items.length; i++) {
                this.bookListLocal.push(data.items[i])
            }
            bookContainer.innerHTML = data.items
                .map(
                    ({ volumeInfo }) =>

                        `<div class='book' style='background: linear-gradient(` +
                        getRandomColor() +
                        `, rgba(0, 0, 0, 0));'><a onclick='displayBookCard("${volumeInfo.title}");' target='_blank'><img class='thumbnail' src='` +
                        extractThumbnail(volumeInfo) +
                        `' alt='cover'></a><div class='book-info'><h3 class='book-title'><a onclick='displayBookCard("${volumeInfo.title}");' target='_blank'>${volumeInfo.title}</a></h3><div class='book-authors'><a onclick='displayBookCard("${volumeInfo.title}");' target='_blank'>${volumeInfo.authors}</a></div><div class='info'  style='background-color: ` +
                        getRandomColor() +
                        `;'>` +
                        (volumeInfo.categories === undefined
                            ? "Others"
                            : volumeInfo.categories) +
                        `</div></div></div>`
                )
                .join("");
        }
    } else {
        bookContainer.style.display = "none";
    }
};

const debounce = (fn, time, to = 0) => {
    to ? clearTimeout(to) : (to = setTimeout(drawListBook, time));
};

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


$("#searchFriend").autocomplete({
    source: availableTags
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
    document.getElementById('contactIndicatorText').innerHTML = "Chat with " + this.profileNameLocal

})

chatIndicator.addEventListener('mouseleave', e => {
    document.getElementById('contactIndicatorText').style.display = "none"
})

connectionIndicator.addEventListener('mouseenter', e => {
    document.getElementById('contactIndicatorText').style.display = "block"
    document.getElementById('contactIndicatorText').style.color = "#000"
    if(this.isAddedAsConnection || this.isAddedAsConnection === true){
        document.getElementById('contactIndicatorText').innerHTML = "Already in connection " + this.profileNameLocal
    }else{
    document.getElementById('contactIndicatorText').innerHTML = "connect with " + this.profileNameLocal
    }
})

connectionIndicator.addEventListener('mouseleave', e => {
    document.getElementById('contactIndicatorText').style.display = "none"
})

connectionIndicator.addEventListener('click', e => {
    if(this.isAddedAsConnection || this.isAddedAsConnection ===  true){
        alert('Already a connection!')
    } else {
        socket.emit('addConnection', this.userNameLocal,profileNameLocal)
        
    }
})  



editIcon.addEventListener('click', e => {
    document.getElementById('search-box').style.background="yellow"
    setTimeout(function () {
        document.getElementById('search-box').style.background="white"
    }, 5000);
})

/*
* book suggestion section
*/
goButtonBookShelf.addEventListener('click', e => {
    var selected = document.getElementById('bookShelf').value;
    var bookName = document.getElementById('bookName').innerHTML
    if (selected === 'Not Read') {
        alert('please select a book shelf other that (not read)')
    } else {
        socket.emit('updateBookShelf', selected, this.userNameLocal, bookName)
        alert('Book shelf updated!')
    }
})






/***************************************************************
 */


let bookContainer = document.querySelector(".search");
let searchBooks = document.getElementById("search-box");


searchBooks.addEventListener("input", () => debounce(drawListBook, 1000));

function displayBookCard(title) {
    if (this.bookListLocal.length > 0) {

        document.getElementById('bookListSuggestion').style.display='none'

        for (let i = 0; i < bookListLocal.length; i++) {
            if (bookListLocal[i].volumeInfo.title === title) {
                document.getElementById('bookProfile').style.display = 'flex';
                document.getElementById('bookImage').src = bookListLocal[i].volumeInfo.imageLinks.thumbnail;
                document.getElementById('bookName').innerHTML = title.substring(0, 35);
                document.getElementById('bookAuthor').innerHTML = bookListLocal[i].volumeInfo.authors[0]
                document.getElementById('genreIconValue').innerHTML = bookListLocal[i].volumeInfo.categories[0];
                document.getElementById('ratingIconValue').innerHTML = bookListLocal[i].volumeInfo.averageRating + '/5';
                document.getElementById('totalPagesIconValue').innerHTML = bookListLocal[i].volumeInfo.pageCount + ' pages'
                document.getElementById('bookDescription').innerHTML = bookListLocal[i].volumeInfo.description;
                break;
            }
        }

    } else {
        alert('no such book found');
    }
}


