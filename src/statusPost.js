const fs = require('fs')

const addStatusUpdate = (userName, postContent) => {
     var statusList = getStatusList();

     var statusEntry = {
         'userName':userName,
         'status':postContent,
         'timestamp':Date.now()
     }

     statusList.push(statusEntry);

     fs.writeFileSync('files/statusPosts.json', JSON.stringify(statusList))
}

const getStatusList = () =>{
    try{
        const itemsBuffer = fs.readFileSync('files/statusPosts.json')
        const statusJson = itemsBuffer.toString()
        const statuses = JSON.parse(statusJson)
        return statuses;
    } catch(e) {
        return []
    }
}

module.exports = {
    addStatusUpdate:addStatusUpdate
}