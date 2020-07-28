const fs = require('fs')

const addactivity = (userName, type, data) => {

    const activities = getactivitiesList()


    const activitysForCurrentUser = activities.filter((activity) => {
        return activity.userName === userName
    })

    if(activitysForCurrentUser.length === 0) {

        var activityList = [];
        const activityItem = {
            'name':userName,
            'type':type,
            'data':data,
            'timestamp':Date.now()
        }
        activityList.push(activityItem)

        const activityEntry = {
            'userName':userName,
            'activityList':activityList
        }

        activities.push(activityEntry);
        fs.writeFileSync('files/activities.json', JSON.stringify(activities))
    } else {
        removeactivities(userName);
        activityNewList =  getactivitiesList();
        const activityItem = {
            'name':userName,
            'type':type,
            'data':data,
            'timestamp':Date.now()
        }
        var activityList = activitysForCurrentUser[0].activityList;
        
        activityList.push(activityItem);

        const activityEntry = {
            'userName':userName,
            'activityList':activityList
        }

        activityNewList.push(activityEntry);
        fs.writeFileSync('files/activities.json', JSON.stringify(activityNewList))
    }


}

const getactivitiesList = () =>{
    try{
        const itemsBuffer = fs.readFileSync('files/activities.json')
        const activitysJson = itemsBuffer.toString()
        const activities = JSON.parse(activitysJson)
        return activities;
    } catch(e) {
        return []
    }
}

const removeactivities = (profileName) => {
    const activities = getactivitiesList()
    const activitysAfterRemoval = activities.filter((item) =>{
        return item.userName != profileName;
    })
    
    if(activitysAfterRemoval.length < activities.length){
        fs.writeFileSync('files/activities.json', JSON.stringify(activitysAfterRemoval))
    } else {
        console.log('User not found')
    }

    
}

const getactivityEntryForAProfile = (profileName) => {
    
    const activitysList = getactivitiesList();

    const activitysForCurrentUser = activitysList.filter((activity) => {
        return activity.userName === profileName
    })
if(activitysForCurrentUser != undefined && activitysForCurrentUser.length>0){
    return activitysForCurrentUser[0].activityList;
} else {
    return undefined
}
}



module.exports = {
    addactivity:addactivity,
    getactivityEntryForAProfile:getactivityEntryForAProfile,
}