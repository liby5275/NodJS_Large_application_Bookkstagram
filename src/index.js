const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io')
const userDependency = require('./user')
const roomDependency = require('./room')
const contactDependency = require('./contact')



const app = express()
const httpserver = http.createServer(app)
const io = socket(httpserver)

const dynamicPath = path.join(__dirname, '../public')
app.use(express.static(dynamicPath))


io.on('connect', (socket) => {

    let username = ''
    let userroom = ''

    socket.emit('message', 'Welcome to the Chat App')

    socket.on('joined', async ({ name, genre, author, book }, callback) => {
        const _id = socket.id
        const istaken =  await userDependency.isUsernameAlreadyTaken(name);  
                if (istaken) {
                    socket.emit('warning', 'This username already taken. Take another one')
                } else {
                    await userDependency.addUser(_id, name, genre, author, book)
                    socket.emit('joincompleted', name)
                }
        

    })

    socket.on('fetchContact',userName => {

    })


    socket.on('addContact',async ({userName,contact}) => {

        await contactDependency.addContact(userName,contact);

    })

    socket.on('location', (coords, callback) => {
        socket.join(userroom)
        io.to(userroom).emit('coords', coords.latitude, coords.longitude, username)
        callback()
    })


    socket.on('messageFromUser', messageText => {
        const time = new Date().getTime()
        socket.join(userroom)
        io.to(userroom).emit('messageFromUser', messageText, time, username)
    })

    socket.on('lock', () => {
        roomDependency.lockRoom(userroom)
        socket.join(userroom)
        io.to(userroom).emit('lockedthegroup')
    })

    socket.on('unlock', () => {
        console.log('unlocking')
        roomDependency.unlockRoom(userroom)
        socket.join(userroom)
        io.to(userroom).emit('unlockedthegroup')
    })  

    socket.on('disconnect', () => {
        const _id = socket.id
        //console.log('disconnecting id is ' + username)
        userDependency.removeUser(_id)
        const countOfusersInthisroom = userDependency.findCountOfUsersInaRoom(userroom)
       
        if (countOfusersInthisroom < 1) {
            //remove room
            //console.log('about to remove the room ' + userroom)
            roomDependency.removeRoom(userroom)
        }
        roomDependency.getRoomList()
        socket.join(userroom)
        io.to(userroom).emit('disconnect', username)
        io.to(userroom).emit('userlist', {
            room: userroom,
            userList: userDependency.getUsersInaRoom(userroom)
        })
    })

    
})

const port = process.env.PORT || 3000
httpserver.listen(port, () => {
    console.log('port started')
})