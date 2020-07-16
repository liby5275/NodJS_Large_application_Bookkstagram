var roomList = []
var userListInThisRoom = []

const addRoom = (room) => {
    if (roomList.length > 0) {
        const tempRoomList = roomList.filter((r) => {
            return room === r.roomName
        })

        if (tempRoomList.length > 0) {
            console.log('already added the room')
        } else {
            pushRoomToList(room)
        }

    } else {
        pushRoomToList(room)
    }

}

const removeRoom = function(roomToRemove) {
    if(roomToRemove){
        const tempRoomList = roomList.filter((roomObj) => {
            return roomToRemove !== roomObj.roomName
        })
        roomList = tempRoomList
    }
    
}

const pushRoomToList = (room) => {
    const isRoomLocked = false
    const roomName = room
    const roomObj = { roomName, isRoomLocked }
    roomList.push(roomObj)
    console.log(roomList)
}

const lockRoom = (roomTobeLocked) => {
    roomList.forEach(room => {
        if (room.roomName === roomTobeLocked) {
            room.isRoomLocked = true
        }
    })
}

const unlockRoom = (roomTobeLocked) => {
    roomList.forEach(room => {
        if (room.roomName === roomTobeLocked) {
            room.isRoomLocked = false
        }
    })
}

const isRoomLocked = function (roomName) {
    let flag = false
    if (roomList.length > 0) {
        roomList.forEach(room => {
            if (room.roomName === roomName) {
                flag=room.isRoomLocked
            } 
        })
    } 

    return flag

}

const getRoomList = () => {
    roomList.forEach(room => {
        console.log(room.roomName + ' ' + room.isRoomLocked)
    })
}


module.exports = {
    addRoom: addRoom,
    removeRoom:removeRoom,
    lockRoom: lockRoom,
    unlockRoom:unlockRoom,
    isRoomLocked: isRoomLocked,
    getRoomList: getRoomList
}