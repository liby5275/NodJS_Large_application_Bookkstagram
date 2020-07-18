const fs = require('fs')

const addUser = (id, name, password, genre, author, book, lastReadBook) => {

    const userList = getUserDataList();
    const user = { id, name, password, genre, author, book, lastReadBook }
    userList.push(user);
    fs.writeFileSync('files/userData.json', JSON.stringify(userList))

}


const getUserDataList = () =>{
    try{
        const itemsBuffer = fs.readFileSync('files/userData.json')
        const itemsJson = itemsBuffer.toString()
        const users = JSON.parse(itemsJson)
        return users;
    } catch(e) {
        console.log('getContactList : no such file present in the system')
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
            console.log('taken');
            res = true;
        }
    })

    return res; 
}

const removeUser = (id) => {

    const tempUserList = userList.filter((user) => {
        return id != user.id
    })
    userList = tempUserList
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
    validateUserCreds:validateUserCreds,
    removeUser:removeUser,
    fetchUser:fetchUser,
    getUserDataList:getUserDataList
}