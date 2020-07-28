const fs = require('fs')

const addUser = (id, name, password, genre, author, book, lastReadBook, currentRead) => {

    const userList = getUserDataList();
    const user = { id, name, password, genre, author, book, lastReadBook, currentRead }
    userList.push(user);
    fs.writeFileSync('files/userData.json', JSON.stringify(userList))

}

const updateCurrentBook = (userName, bookName) => {
    var user = fetchUser(userName);
    removeUser(userName);
    var id = user.id; var password= user.password; var genre= user.genre;var author=user.author;
    var name = user.name; var book = user.book; var lastReadBook= user.lastReadBook
    var currentRead=bookName;

    const updatedUser = { id, name, password, genre, author, book, lastReadBook, currentRead }
    const userList = getUserDataList();
    userList.push(updatedUser);
    fs.writeFileSync('files/userData.json', JSON.stringify(userList))
}


const getUserDataList = () =>{
    try{
        const itemsBuffer = fs.readFileSync('files/userData.json')
        const itemsJson = itemsBuffer.toString()
        const users = JSON.parse(itemsJson)
        return users;
    } catch(e) {
        
        return []
    }
}

const validateUserCreds = async (userName, password) =>{
    let validUser = false;
    const userList = getUserDataList();
    userList.forEach(user=>{
        if(user.name === userName && user.password === password){
            validUser = true;
        }
    }) 

    return validUser;
}

const isUsernameAlreadyTaken = async (name) => {

    let res= false;
    const userList = getUserDataList();
    userList.forEach(user=>{
        if(user.name === name ){
            
            res = true;
        }
    })

    return res; 
}

const removeUser = (name) => {
    var userList = getUserDataList();
    const tempUserList = userList.filter((user) => {
        return name != user.name
    })
    userList = tempUserList
    fs.writeFileSync('files/userData.json', JSON.stringify(userList))
}

const fetchUser = function(name) {
    const usersList = getUserDataList();
    var resultUser = undefined;
    usersList.forEach(user=>{
        if(user.name === name){
            resultUser = user;
        }
    }) 

    return resultUser
}

const addToOnlineList = async (name) => {
    let isAlreadyOnline = await ifUserIsOnline(name);
    if(isAlreadyOnline || isAlreadyOnline === true){

    }else {
    var onlineUsers = getOnlineUsers();
    onlineUsers.push(name)  
    fs.writeFileSync('files/onlineUsers.json', JSON.stringify(onlineUsers))
    }
}

const deleteFromOnlineList = (id) => {
    var onlineUsers = getOnlineUsers();
    
    const tempUserList = onlineUsers.filter((user) => {
        var splittedValue = user.split('bibinSekcretKey::')
        return id != splittedValue[0]
    }) 
    onlineUsers=tempUserList
    fs.writeFileSync('files/onlineUsers.json', JSON.stringify(onlineUsers))
}

const getOnlineUsers = () => {
    try{
        const itemsBuffer = fs.readFileSync('files/onlineUsers.json')
        const itemsJson = itemsBuffer.toString()
        const users = JSON.parse(itemsJson)
        return users;
    } catch(e) {
        
        return []
    }
}

const ifUserIsOnline = (name) => {
   
    let res = false;
    var onlineUsers = getOnlineUsers();
    onlineUsers.forEach(user => {
        
        var splitValue = user.split('bibinSekcretKey::')
        if(name === splitValue[1]){
            
            res = true;
        }
    })
    return res;
}







/* const findCountOfUsersInaRoom = (room)=>{
    let count =0;
    userList.forEach(user=>{
        if(user.room === room){
            count = count + 1
        }
    })
    return count;
}

const getUsersInaRoom = function (room){
    const userListTemp = []
    userList.forEach(userObj=>{
        if(userObj.room === room){
            userListTemp.push(userObj)
        }
    })
    return userListTemp
} */





module.exports = {
    isUsernameAlreadyTaken: isUsernameAlreadyTaken,
    addUser: addUser,
    updateCurrentBook:updateCurrentBook,
    validateUserCreds:validateUserCreds,
    removeUser:removeUser,
    fetchUser:fetchUser,
    getUserDataList:getUserDataList,
    addToOnlineList:addToOnlineList,
    deleteFromOnlineList:deleteFromOnlineList,
    ifUserIsOnline:ifUserIsOnline
}