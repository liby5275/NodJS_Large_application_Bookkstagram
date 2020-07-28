const fs = require('fs')

const addNotification = (userName, profileName,type, state) => {

    const notifcs = getNotificationsList()


    const notifcsForCurrentUser = notifcs.filter((notification) => {
        return notification.toId === profileName
    })

    if(notifcsForCurrentUser.length === 0) {

        var notifcList = [];
        const notificationItem = {
            'fromId':userName,
            'type':type,
            'state':state
        }
        notifcList.push(notificationItem)

        const notificEntry = {
            'toId':profileName,
            'notificList':notifcList
        }

        notifcs.push(notificEntry);
        fs.writeFileSync('files/notifications.json', JSON.stringify(notifcs))
    } else {
        removeNotifics(profileName);
        notificsNewList =  getNotificationsList();
        const notificationItem = {
            'fromId':userName,
            'type':type,
            'state':state
        }
        var notificList = notifcsForCurrentUser[0].notificList;
        
        notificList.push(notificationItem);

        const notificEntry = {
            'toId':profileName,
            'notificList':notificList
        }

        notificsNewList.push(notificEntry);
        fs.writeFileSync('files/notifications.json', JSON.stringify(notificsNewList))
    }


}

const getNotificationsList = () =>{
    try{
        const itemsBuffer = fs.readFileSync('files/notifications.json')
        const notifcsJson = itemsBuffer.toString()
        const notifcs = JSON.parse(notifcsJson)
        return notifcs;
    } catch(e) {
        return []
    }
}

const removeNotifics = (profileName) => {
    const notifications = getNotificationsList()
    const notificsAfterRemoval = notifications.filter((item) =>{
        return item.toId != profileName;
    })
    
    if(notificsAfterRemoval.length < notifications.length){
        fs.writeFileSync('files/notifications.json', JSON.stringify(notificsAfterRemoval))
    } else {
        console.log('User not found')
    }

    
}

const getNotificationEntryForAProfile = (profileName) => {
    
    const notificsList = getNotificationsList();

    const notifcsForCurrentUser = notificsList.filter((notification) => {
        return notification.toId === profileName
    })

    return notifcsForCurrentUser;
}

const changeNotificsState = (profileName) => {

    const notifcsForCurrentUser = getNotificationEntryForAProfile(profileName);
    removeNotifics(profileName);
    const notifics = getNotificationsList();

    notifcsForCurrentUser[0].notificList.forEach(notification => {
        notification.state="shown"
    })
    notifics.push(notifcsForCurrentUser[0]);
    fs.writeFileSync('files/notifications.json', JSON.stringify(notifics))
}

module.exports = {
    addNotification:addNotification,
    getNotificationEntryForAProfile:getNotificationEntryForAProfile,
    changeNotificsState:changeNotificsState
}