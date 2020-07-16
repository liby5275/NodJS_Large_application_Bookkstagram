var userList = []

const addUser = (id, name, genre, author, book) => {
    const user = { id, name, genre, author, book }
    userList.push(user)
}


const removeUser = (id) => {

    const tempUserList = userList.filter((user) => {
        return id != user.id
    })
    userList = tempUserList
}

const fetchUser = function(id) {
    let roomname  =''
    userList.forEach(user => {
        if(user.id === id){
            console.log(user)  
            roomname = user.room
        } 
    })
    return roomname
}

const fetchUSerList = () => {
    userList.forEach(user => {
        console.log(user.id + ' ' + user.name + ' ' + user.room)
    })
}

const isUsernameAlreadyTaken = async (name) => {

    let res= false;
    userList.forEach(user=>{
        if(user.name === name ){
            console.log('taken');
            res = true;
        }
    })

    return res;
      
}

const findCountOfUsersInaRoom = (room)=>{
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
}



module.exports = {
    isUsernameAlreadyTaken: isUsernameAlreadyTaken,
    addUser: addUser,
    removeUser: removeUser,
    fetchUser: fetchUser,
    fetchUSerList: fetchUSerList,
    findCountOfUsersInaRoom:findCountOfUsersInaRoom,
    getUsersInaRoom:getUsersInaRoom
}