const socket = io()

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

socket.on('warning', (message) => {
    alert(message)
    location.href = '/'
})