const socket = io()

const locbutton = document.querySelector("#locbutton")
const lockbutton = document.querySelector('#lockbutton')
const unlockbutton = document.querySelector('#unlockbutton')
const userJoinForm = document.querySelector('#userjoinform')
const messsageForm = document.querySelector('#messageform')
const userJoinFormButton = userJoinForm.querySelector('button')
const messageElement = document.querySelector('#messages')
const sidebarElement =document.querySelector('#sidebar')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


const autoScroll = () => {
    //new message 
    const $newMessage = messageElement.lastElementChild

    // Height of the new message 
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height 
    const visibleHeight = messageElement.offsetHeight

    // Height of messages container 
    const containerHeight = messageElement.scrollHeight

    // How far have I scrolled? 
    const scrollOffset = messageElement.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messageElement.scrollTop = messageElement.scrollHeight
    }


}

//User Join Form
userJoinForm.addEventListener('submit', (e) => {
    e.preventDefault()

    userJoinFormButton.setAttribute('disabled', 'disabled')

    const name = userJoinForm.querySelector('#name').value
    const genre = userJoinForm.querySelector('#genre').value
    const author = userJoinForm.querySelector('#author').value
    const book = userJoinForm.querySelector('#book').value
    socket.emit('joined', {
        name: name,
        genre: genre,
        author:author,
        book:book
    }, (callback) => {
        userJoinFormButton.removeAttribute('disabled')
        console.log(callback)
    })
})


//Message Form
messsageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const messageText = messsageForm.querySelector('input').value
    messsageForm.reset()
    socket.emit('messageFromUser', messageText)
})

//Share location
locbutton.addEventListener('click', () => {
    locbutton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('not supported browser')
    }


    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (callback) => {
            locbutton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})


//lock room
lockbutton.addEventListener('click', () => {
    socket.emit('lock')
    lockbutton.style.display="none"
    unlockbutton.style.display="block"
})

//unlock Room
unlockbutton.addEventListener('click', () => {
    socket.emit('unlock')
    unlockbutton.style.display="none"
    lockbutton.style.display="block"
})



//Welcome message
socket.on('message', (message) => {
    const welMsg = document.querySelector('#welcome')
    welMsg.textContent = ' ' + message
})

//User has joined
socket.on('joinmessage', (name) => {
    const html = Mustache.render(messageTemplate, {
        message: name + ' has joined the chat now'
    })
    messageElement.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


//Message from the user
socket.on('messageFromUser', (messageText, time, username) => {
    const html = Mustache.render(messageTemplate, {
        name: username,
        time: '@' + moment(time).format('h:mm a'),
        message: messageText
    })
    messageElement.insertAdjacentHTML('beforeend', html)
    autoScroll()

})

//event handler for hiding the joining div once joining is completed
socket.on('joincompleted', (name) => {
    locbutton.style.display = "block"
    userJoinForm.style.display = "none"
    messsageForm.style.display = "flex"
    document.getElementById('chat1').style.display = "flex"
    document.getElementById('centered-form').style.display = "none"
    //document.querySelector('#chat__sidebar').style.display="block"
    const welMsg = document.querySelector('#welcome')
    welMsg.textContent = 'Welcome to the Chat App, ' + name
})


//location
socket.on('coords', (lat, lon, name) => {
    const url = 'https://google.com/maps?q=' + lat + ',' + lon
    const html = Mustache.render(locationTemplate, {
        location: url,
        name: name + '  '
    })
    messageElement.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


//warniing for username already taken
socket.on('warning', (message) => {
    alert(message)
    location.href = '/'
})

//locked message back to the chat window
socket.on('lockedthegroup', () => {
    const html = Mustache.render(messageTemplate, {
        message: 'This room is locked now. no one else can join now'
    })
    messageElement.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

//unlocked message back to the chat window
socket.on('unlockedthegroup', () => {
    const html = Mustache.render(messageTemplate, {
        message: 'Room unlocked!!. You may add new users to the room'
    })
    messageElement.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('userlist', ({room, userList})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        userList
    })
    sidebarElement.innerHTML = html
})

//diconnect
socket.on('disconnect', (name) => {
    const html = Mustache.render(messageTemplate, {
        message: name + ' left the chat'
    })
    messageElement.insertAdjacentHTML('beforeend', html)
    autoScroll()
})