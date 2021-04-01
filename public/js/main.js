const socket = io()
const search = document.querySelector('#search');
const searchForm = document.querySelector('#searchForm');
const contactListBarElement = document.querySelector('#contactListBar')
const notificsListBarElement = document.querySelector("#notifcsListBar")
const contactIndicator = document.getElementById("contactIndicator")
const chatIndicator = document.getElementById("chatIndicator")
const connectionIndicator = document.getElementById("connectionIndicator")
const editIcon = document.getElementById("editIcon")
const bookSearchPanel = document.getElementById("bookSearchPanel")
const goButtonBookShelf = document.getElementById("goButtonBookShelf")
const goButtonBookShelf2 = document.getElementById("goButtonBookShelf2")
const notificationNumber = document.getElementById("notificationNumber")
const notificationIcon = document.getElementById('notificationIcon')
const bookSuggestionList = document.getElementById('bookSuggestionList')
const bookSuggestionRefresh = document.getElementById('bookSuggestionRefresh')
const refreshIcon = document.getElementById('refreshIcon')
const activitiesList = document.getElementById('activitiesList')
const postStatusTextArea = document.getElementById('postStatusTextArea');
const w3review = document.getElementById('w3review')
const sidebarTemplate = document.querySelector('#contactlistBar-template').innerHTML
const notifcslistBartemplate = document.querySelector('#notifcslistBar-template').innerHTML


var userList = '';
var availableTags = [];
var bookListLocal = [];
var bookListWithNameAndAuthor = [];
var notificationListLocal = []
var isAddedToContact;
var isAddedAsConnection;
var toggleNotification = true;
var favAuthorOfThisUser = '';
var favGenreOfThisUSer = '';
var lastReadBookByThisUser = '';
var descLocal ='';
var statusAreaToggle = false;


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
    contactList = contactList.slice(0,5)
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
        bookSuggestionList.style.display = "none";
        bookSuggestionRefresh.innerHTML = ""
    }

})

socket.on('SelfProfileDetails', userData => {
    document.getElementById("profilePic").src = "/images/bg1.jpg";
    document.getElementById('myProfileName').innerHTML = userData.name;
    document.getElementById('currentlyReading').innerHTML = 'CR: ' + userData.currentRead.substring(0, 35);
    document.getElementById('favDetails').innerHTML = userData.genre + ' ' + 'lover' + ' || ' + userData.author + ' fan';
    this.favAuthorOfThisUser = userData.author;
    this.favGenreOfThisUSer = userData.genre;
    this.lastReadBookByThisUser = userData.lastReadBook;
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
    alert(profileName + ' has been added as your connection')
})

socket.on('notifyTheUser', (userName, profileName) => {
    if (profileName === this.userNameLocal) {
        var currentNumber = notificationNumber.innerHTML
        notificationNumber.innerHTML = Number(currentNumber) + 1
        notificationNumber.style.display = "block"
        notificationListLocal.push(userName + ' is now connected to you. Click to view more')
    }
})

socket.on('getNotifcsResponse', notifcsForCurrentUser => {

    var anyNewNotifcs = false;
    let count = 0;
    notifcsForCurrentUser[0].notificList.forEach(item => {
        if (item.state === "new") {
            anyNewNotifcs = true;
            count = count + 1;

        }
        notificationListLocal.push(item.fromId + ' is now connected to you. Click to view more')
    })

    if (anyNewNotifcs || anyNewNotifcs === 'true') {
        var currentNumber = notificationNumber.innerHTML
        notificationNumber.innerHTML = Number(currentNumber) + count;
        notificationNumber.style.display = "block"
    }
})

socket.on('activites', async activitesTotal => {

    document.getElementById('bookListSuggestion').style.display = "none"
    bookSuggestionList.style.display = "none";
    activitiesList.innerHTML = `<div class='prompt'><div class="loader"></div></div>`;

    await activitesTotal.forEach(async activity => {
        if (activity.type === 'currentRead') {

            var data = activity.data;
            var result = await extractImage(data)
            var author = result.author;
            var imageSrc = result.imageSrc;
            var rating = result.rating;
            var desc = result.desc.substring(0, 100) + '.Click on the image to Read more..';
            var descFull = escapeHtml(result.desc);
            var header = activity.name + ' is reading ' + data + ' now';
            activitiesList.innerHTML = activitiesList.innerHTML + `<div id="activityOuter"><div id="activityOuterHeadFirst">${activity.name}</div>` +
            `<div id="activityOuterHeadSecond"><span>has marked their current read</span></div></div>`

            activitiesList.innerHTML = activitiesList.innerHTML + `<div class='activityBlock' style='background: linear-gradient(` +
        getRandomColor()  +
            `, rgba(0,0,0,0));'>` +
            `<div id="activity-area"><p id="activityHeader">${header}</p>` +
            `<p id="titleInActivity">${data}</p>` +
            `<p id="author">${author}</p>` +
            `<p id="activityRating">${rating}</p>` +
            `<p id="activityDesc">${desc}</p>` +
            `</div>` +
            `<img class='activityImage' src='${imageSrc}' onclick='displayBookCardFromActivity("${result.title}","${descFull}","${result.imageSrc}","${result.author}","${result.pages}","${result.category}", "${result.rating}");'` +
            `' alt='cover'><a onclick='displayBookCardFromActivity2("${result.title}","${result.author}");' target='_blank'>` +

            `</div>`
              
        } else if (activity.type === 'lastRead') {
            var data = activity.data;
            var result = await extractImage(data)
            var author = result.author;
            var imageSrc = result.imageSrc;
            var rating = result.rating;
            var desc = result.desc.substring(0, 100) + '.Click on the image to Read more..';
            var descFull = escapeHtml(result.desc);
            var header = activity.name + ' has finished ' + data;
            activitiesList.innerHTML = activitiesList.innerHTML + `<div id="activityOuter"><div id="activityOuterHeadFirstFinished">Well Done!</div>` +
            `<div id="activityOuterHeadSecondFinsihed"><span>${activity.name} has finsihed a book</span></div></div>`

            activitiesList.innerHTML = activitiesList.innerHTML + `<div class='activityBlock' style='background: linear-gradient(` +
        getRandomColor()  +
            `, rgba(0,0,0,0));'>` +
            `<div id="activity-area"><p id="activityHeader">${header}</p>` +
            `<p id="titleInActivity">${data}</p>` +
            `<p id="author">${author}</p>` +
            `<p id="activityRating">${rating}</p>` +
            `<p id="activityDesc">${desc}</p>` +
            `</div>` +
            `<img class='activityImage' src='${imageSrc}' onclick='displayBookCardFromActivity("${result.title}","${descFull}","${result.imageSrc}","${result.author}","${result.pages}","${result.category}", "${result.rating}");'` +
            `' alt='cover'><a onclick='displayBookCardFromActivity2("${result.title}","${result.author}");' target='_blank'>` +

            `</div>`
        } else if (activity.type === 'bookReview') {

        } else if (activity.type === 'status') {
            var data = activity.data;

            activitiesList.innerHTML = activitiesList.innerHTML + `<div id="activityOuter"><div id="activityOuterHeadFirst">${activity.name}</div>` +
            `<div id="activityOuterHeadSecond"><span>has shared their thougts with you</span></div></div>`
            activitiesList.innerHTML = activitiesList.innerHTML + `<div class='activityBlockPara'
            style='background: linear-gradient(` +
        getRandomColor()  +
            `, rgba(0,0,0,0));'>` +
                `<p>${data}</p>` +
                `</div>`
        }

        

    })

})



/***********************************************
 * This is for functions
 ***********************************************/

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
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

const extractImage = async (title) => {
    var imageSrc = '';
    var author = '';
    var category = '';
    var rating = '';
    var desc = '';
    var pages = '';
    var result;
    const bookList = await getBooks(title);
    var isProcessed = false;
    bookList.items.forEach(item => {
        if (item.volumeInfo.title === title && !isProcessed) {
            isProcessed = true;
            imageSrc = item.volumeInfo.imageLinks.thumbnail;
            author = item.volumeInfo.authors[0];
            if(item.volumeInfo.categories != undefined){
            category = item.volumeInfo.categories[0];
            } else {
                category = undefined;
            }
            rating = item.volumeInfo.averageRating;
            desc = item.volumeInfo.description;
            pages = item.volumeInfo.pageCount
            result = {title,imageSrc, author, category, rating, desc, pages }
        }
    })
    return result;
}

const drawListBook = async () => {
    bookSuggestionList.innerHTML = ""
    bookSuggestionRefresh.innerHTML = ""
    document.getElementById('bookProfile').style.display = 'none';
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

function addOnlineUser(userName) {
    socket.emit('addUserToOnline', userName);
}

const debounce = (fn, time, to = 0) => {
    to ? clearTimeout(to) : (to = setTimeout(drawListBook, time));
};

async function getBookSuggestionForThisUser() {
    bookSuggestionList.innerHTML = `<p id="suggestionWaitMessage">Please wait while we fecth suggestions based on your interests</p>`
    var bookSuggestion1 = await getBooks(`${this.favAuthorOfThisUser}`);
    var bookSuggestion2 = await getBooks(`${this.favGenreOfThisUSer}`);
    var interMediateData1 = await getBooks(`${this.lastReadBookByThisUser}&maxResults=2`);
    var lastReadAuthor = '';
    if (interMediateData1.items[0].volumeInfo.authors != undefined &&
        interMediateData1.items[0].volumeInfo.authors != null &&
        interMediateData1.items[0].volumeInfo.authors.length > 0) {
        lastReadAuthor = interMediateData1.items[0].volumeInfo.authors[0];
    } else {
        lastReadAuthor = this.favAuthorOfThisUser
    }
    var lastReadcategory = '';
    if (interMediateData1.items[0].volumeInfo.categories != undefined &&
        interMediateData1.items[0].volumeInfo.categories != null &&
        interMediateData1.items[0].volumeInfo.categories.length > 0) {
        lastReadcategory = interMediateData1.items[0].volumeInfo.categories[0];
    } else {
        lastReadcategory = this.favGenreOfThisUSer
    }

    interMediateData1.items.forEach(data => {
        if (data.volumeInfo.title === lastReadBookByThisUser) {
            lastReadAuthor = data.volumeInfo.authors[0]
            lastReadcategory = data.volumeInfo.categories[0]
        }
    })
    var bookSuggestion3 = await getBooks(`${lastReadAuthor}`);
    var bookSuggestion4 = await getBooks(`${lastReadcategory}`);

    var len1 = bookSuggestion1.items.length;
    var len2 = bookSuggestion2.items.length;
    var len3 = bookSuggestion3.items.length;
    var len4 = bookSuggestion4.items.length;

    var randomX = Math.floor(Math.random() * len1);
    var randomX2 = Math.floor(Math.random() * len1);
    var randomY1 = Math.floor(Math.random() * len2);
    var randomY2 = Math.floor(Math.random() * len2);
    while (randomY2 === randomY1) {
        randomY2 = Math.floor(Math.random() * len2);
    }
    var randomY3 = Math.floor(Math.random() * len2);
    while (randomY3 === randomY1 || randomY3 === randomY2) {
        randomY3 = Math.floor(Math.random() * len2)
    }
    var randomZ = Math.floor(Math.random() * len3);
    var randomM = Math.floor(Math.random() * len4);
    var finalBookSuggestionList = [];
    finalBookSuggestionList.push(bookSuggestion1.items[randomX]);
    finalBookSuggestionList.push(bookSuggestion1.items[randomX2]);
    finalBookSuggestionList.push(bookSuggestion2.items[randomY1]);
    finalBookSuggestionList.push(bookSuggestion2.items[randomY2]);
    finalBookSuggestionList.push(bookSuggestion2.items[randomY3]);
    finalBookSuggestionList.push(bookSuggestion3.items[randomZ]);

    for (let i = 0; i < finalBookSuggestionList.length; i++) {
        this.bookListLocal.push(finalBookSuggestionList[i])
    }

    bookSuggestionList.style.display = "flex";
    document.getElementById('bookListSuggestion').style.display = "none"
    bookSuggestionList.innerHTML = `<div class='prompt'><div class="loader"></div></div>`;
    bookSuggestionRefresh.innerHTML = `<img id="refreshIcon" src="/images/refresh.png" width="30" height="30">`;
    bookSuggestionList.innerHTML = finalBookSuggestionList
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

async function getNotificationsAndMessages(userName) {
    socket.emit('getNotificationsAndMessages', userName);
}

function getActivities(userName) {
    socket.emit('fetchActivites', userName);
}

function postStatus(){
    if(statusAreaToggle || statusAreaToggle === 'true'){
        postStatusTextArea.style.display="none"
        statusAreaToggle=false;
    }else {
        postStatusTextArea.style.display="block"
        statusAreaToggle = true;
    }
    
    w3review.innerHTML='';
}


function saveStatusUpdate(){
    const postContent = w3review.value;
    if(postContent != undefined && postContent.length>0){
    socket.emit('savePostUpdate',{
        userName:this.userNameLocal,
        postContent:postContent
    })}
    
    postStatusTextArea.style.display = 'none'
    
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
    if (this.isAddedAsConnection || this.isAddedAsConnection === true) {
        document.getElementById('contactIndicatorText').innerHTML = "Already in connection " + this.profileNameLocal
    } else {
        document.getElementById('contactIndicatorText').innerHTML = "connect with " + this.profileNameLocal
    }
})

connectionIndicator.addEventListener('mouseleave', e => {
    document.getElementById('contactIndicatorText').style.display = "none"
})

connectionIndicator.addEventListener('click', e => {
    if (this.isAddedAsConnection || this.isAddedAsConnection === true) {
        alert('Already a connection!')
    } else {
        socket.emit('addConnection', this.userNameLocal, profileNameLocal)

    }
})



editIcon.addEventListener('click', e => {
    document.getElementById('search-box').style.background = "yellow"
    setTimeout(function () {
        document.getElementById('search-box').style.background = "white"
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

goButtonBookShelf2.addEventListener('click', e => {
    var selected = document.getElementById('bookShelf2').value;
    var bookName = document.getElementById('bookName2').innerHTML
    if (selected === 'Not Read') {
        alert('please select a book shelf other that (not read)')
    } else {
        socket.emit('updateBookShelf', selected, this.userNameLocal, bookName)
        alert('Book shelf updated!')
    }
})

notificationIcon.addEventListener('click', e => {
    if (toggleNotification || toggleNotification === true) {
        var recentNotifcsList = [];
        
        for (let i = notificationListLocal.length - 1; i >= 0; i--) {
            recentNotifcsList.push(notificationListLocal[i])
        }
        var html='';
        if(recentNotifcsList.length>5){
             recentNotifcsList = recentNotifcsList.slice(0,6)
            html = Mustache.render(notifcslistBartemplate, {
                recentNotifcsList
            })
        }else {
            html = Mustache.render(notifcslistBartemplate, {
                recentNotifcsList
            })
        }
        
        notificsListBarElement.innerHTML = html
        toggleNotification = false;
        notificationNumber.innerHTML = 0
        notificationNumber.style.display = "none"
    } else {
        notificsListBarElement.innerHTML = ''
        toggleNotification = true;
    }


})

bookSuggestionRefresh.addEventListener('click', e => {
    getBookSuggestionForThisUser();
})



/***************************************************************
 */


let bookContainer = document.querySelector(".search");
let searchBooks = document.getElementById("search-box");


searchBooks.addEventListener("input", () => debounce(drawListBook, 1000));

function displayBookCard(title) {
    if (this.bookListLocal.length > 0) {

        document.getElementById('bookListSuggestion').style.display = 'none'
        bookSuggestionList.style.display = 'none'
        activitiesList.style.display = 'none'
        var isProcessed = false;

        for (let i = 0; i < bookListLocal.length; i++) {
            if (bookListLocal[i].volumeInfo.title === title && !isProcessed) {
                isProcessed = true;
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

function displayBookCardFromActivity(title,descFull,src,author,pages,category,rating) {
    document.getElementById('bookProfile2').style.display = 'flex';
    document.getElementById('bookImage2').src = src
    document.getElementById('bookName2').innerHTML = title
    document.getElementById('bookAuthor2').innerHTML = author
    document.getElementById('genreIconValue2').innerHTML = category
    document.getElementById('ratingIconValue2').innerHTML = rating + '/5';
    document.getElementById('totalPagesIconValue2').innerHTML = pages + ' pages'
    document.getElementById('bookDescription2').innerHTML = descFull;

}

