const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io')
const userDependency = require('./user')
const roomDependency = require('./room')
const contactDependency = require('./contact')
const booksDependency = require('./books')
const connectionDependency = require('./connect')
const notificationDependency = require('./notification')
const activityDependency = require('./activites')
const statusPostDependency = require('./statusPost')
const { profileEnd } = require('console')



const app = express()
const httpserver = http.createServer(app)
const io = socket(httpserver)

const dynamicPath = path.join(__dirname, '../public')
app.use(express.static(dynamicPath))


io.on('connect', (socket) => {

    let username = ''
    let userroom = ''

    socket.emit('message', 'Welcome to the Chat App')

    socket.on('joined', async ({ name, password, genre, author, book, lastReadBook, currentRead }, callback) => {
        socket.join(name)
        const _id = socket.id
        const istaken =  await userDependency.isUsernameAlreadyTaken(name);  
                if (istaken || istaken === 'true') {
                    socket.emit('warning', 'This username already taken. Take another one')
                } else {
                    
                    await userDependency.addUser(_id, name, password, genre, author, book, lastReadBook, currentRead)
                    socket.emit('joincompleted', name)
                }
        

    })

    socket.on('validateCreds', async ({name,password}, callback) => {
        const isValidUser = await userDependency.validateUserCreds(name,password);
        if (isValidUser || isValidUser === 'true') {
            
        } else {
            socket.emit('warning', 'Invalid credentials. Please try again')
        }
    })

    socket.on('fetchContact',async(userName) => {

        var contacts = await contactDependency.getContactsList();
        const userData = contacts.filter((item) =>{
            return item.userName === userName;
        })

        
        socket.emit('contactList',userData)
    })


    socket.on('addContact',async ({userName,contact}) => {
        await contactDependency.addContact(userName,contact);
        socket.emit('contactAdded', contact)

    })

    socket.on('getUserDetails', async ({profileName, userName}) =>{
        if( profileName === userName){
            socket.join(userName)
        } 
        
        this.username = userName;
        const userData = await userDependency.fetchUser(profileName);
        if( profileName === userName){
            socket.emit('SelfProfileDetails', userData);
        } else {
            
        const isAddedToContact = await contactDependency.isAddedToContact(userName,profileName)
        const isAddedConnection = await connectionDependency.isAddedToconnection(userName,profileName)
        socket.emit('profileDetails',{
            userData:userData,
            isAddedToContact:isAddedToContact,
            isAddedConnection:isAddedConnection
        })
    }

    })

    socket.on('addUserToOnline',async (userName) =>{
        var key="bibinSekcretKey::";
        var _id = socket.id;
        var finalID = _id+key+userName;
        await userDependency.addToOnlineList(finalID);
    })

    socket.on('fetchCompleteUserList', async () => {
        const userList = await userDependency.getUserDataList();
        socket.emit('completeUserList', userList)
    })

    socket.on('searchBookWithString', currentTypedString => {

        booksDependency.getBooksForSearchedString(currentTypedString, (callbackError, callbackdata) => {
            
            socket.emit('bookListPerSearch', callbackdata)
            
        })

    })

    socket.on('updateBookShelf',async (selected,userName, bookName) => {
        if(selected === 'Current Read'){
            await userDependency.updateCurrentBook(userName,bookName)
            await activityDependency.addactivity(userName,'currentRead',bookName)
        } else if(selected === 'Finsished Reading'){
            console.log('check1');
            await userDependency.updateLastBook(userName,bookName)
            await activityDependency.addactivity(userName,'lastRead',bookName)
        }
    })

    socket.on('addConnection', async(userName,profileName) => {
        await connectionDependency.addConnection(userName,profileName)
        socket.emit('connectionAdded',profileName)
        let isUserOnline = await userDependency.ifUserIsOnline(profileName);
        if(isUserOnline || isUserOnline === true){
        
        socket.join(profileName)
        socket.broadcast.to(profileName).emit('notifyTheUser',userName,profileName)
        socket.leave(profileName)
        await notificationDependency.addNotification(userName, profileName, 'connection','shown');
        }else {
            await notificationDependency.addNotification(userName, profileName,'connection', 'new');
        }
            
    })

    socket.on('getNotificationsAndMessages', async (userName) => {
        
        var notifcsForCurrentUser = await notificationDependency.getNotificationEntryForAProfile(userName);
        
        if( notifcsForCurrentUser != undefined && notifcsForCurrentUser.length>0){
            
        socket.emit('getNotifcsResponse', notifcsForCurrentUser);
        await notificationDependency.changeNotificsState(userName)
        }

    })


    socket.on('fetchActivites', async (userName) => {
        var activitesTotal = [];
        const connections = await connectionDependency.getConnectionListForAUser(userName);
        if(connections != undefined && connections.length>0){

            await connections.forEach(async connection => {

                var activityListForThisConnection = await activityDependency.getactivityEntryForAProfile(connection);
                if(activityListForThisConnection != undefined){
                activityListForThisConnection.forEach(activity => {
                    activitesTotal.push(activity);
                })
            }

            })


            if(activitesTotal.length>0){
            socket.emit('activites',activitesTotal)
            } else {
                socket.emit('noConnection',userName);
            }
        } else {
            socket.emit('noConnection',userName);
        }
    })


    socket.on('savePostUpdate',async ({userName,postContent}) => {
        await statusPostDependency.addStatusUpdate(userName,postContent)
        await activityDependency.addactivity(userName,'status',postContent)
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

    socket.on('disconnect', async () => {
        var _id = socket.id;
        await userDependency.deleteFromOnlineList(_id)
        
        /* const _id = socket.id
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
        }) */
    })

    
})

const port = process.env.PORT || 3000
httpserver.listen(port, () => {
    console.log('port started')
})