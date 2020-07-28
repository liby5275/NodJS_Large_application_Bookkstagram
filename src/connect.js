const fs = require('fs')

const addConnection = (userName, connection) => {

    const connections = getConnectionList()

    
    const duplicateTitle = connections.filter((user) => {
        return user.userName === userName
    })
    
    if(duplicateTitle.length === 0){
    
        var connectionList = [];
        connectionList.push(connection)
        const connectionObj = {
            'userName':userName,
            'connectionList':connectionList
        }
        connections.push(connectionObj)
        fs.writeFileSync('files/connections.json', JSON.stringify(connections))

    } else {

        
        removeUser(userName);
        connectionsNew = getConnectionList();
        duplicateTitle[0].connectionList.push(connection)
        const connectionObj = {
            'userName':userName,
            'connectionList':duplicateTitle[0].connectionList
        }
        
        connectionsNew.push(connectionObj)
        fs.writeFileSync('files/connections.json', JSON.stringify(connectionsNew))

    }

}


const getConnectionList = () =>{
    try{
        const connectionsBuffer = fs.readFileSync('files/connections.json')
        const connectionsJson = connectionsBuffer.toString()
        const connections = JSON.parse(connectionsJson)
        return connections;
    } catch(e) {
        return []
    }
}

const removeUser = (userName) => {
    const connections = getConnectionList()
    const connectionsAfterRemoval = connections.filter((item) =>{
        return item.userName != userName;
    })
    
    if(connectionsAfterRemoval.length < connections.length){
        fs.writeFileSync('files/connections.json', JSON.stringify(connectionsAfterRemoval))
    } else {
        console.log('User not found')
    }

    
}

const isAddedToconnection = (userName, profileName) => {
    var res = false;
    const connectionList = getConnectionList();

    const tempList = connectionList.filter((user) => {
        return user.userName === userName
    })

    if (tempList.length === 0){
        return res;
    } else {
        
        const connectionsAlreadyAdded = tempList[0].connectionList;
        connectionsAlreadyAdded.forEach(connection => {
            if (connection === profileName){
                res= true;
            }
        })

        return res;
    }
}

const getConnectionListForAUser = (userName)=>{
    const connectionList = getConnectionList();

    const tempList = connectionList.filter((user) => {
        return user.userName === userName
    })

    return tempList[0].connectionList;
}

module.exports = {
    addConnection: addConnection,
    getConnectionList : getConnectionList,
    isAddedToconnection : isAddedToconnection,
    getConnectionListForAUser:getConnectionListForAUser
}