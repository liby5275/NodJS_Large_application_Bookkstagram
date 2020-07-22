const fs = require('fs')

const addContact = (userName, contact) => {

    const contacts = getContactsList()

    
    const duplicateTitle = contacts.filter((user) => {
        return user.userName === userName
    })
    
    if(duplicateTitle.length === 0){
    console.log('emty cpntact')
        var contactList = [];
        contactList.push(contact)
        const contactObj = {
            'userName':userName,
            'contactList':contactList
        }
        contacts.push(contactObj)
        fs.writeFileSync('files/contacts.json', JSON.stringify(contacts))

    } else {

        
        removeUser(userName);
        contactsNew = getContactsList();
        console.log('bla'+contactsNew);
        duplicateTitle[0].contactList.push(contact)
        const contactObj = {
            'userName':userName,
            'contactList':duplicateTitle[0].contactList
        }
        
        contactsNew.push(contactObj)
        fs.writeFileSync('files/contacts.json', JSON.stringify(contactsNew))

    }

}


const getContactsList = () =>{
    try{
        const contactsBuffer = fs.readFileSync('files/contacts.json')
        const contactsJson = contactsBuffer.toString()
        const contacts = JSON.parse(contactsJson)
        return contacts;
    } catch(e) {
        return []
    }
}

const removeUser = (userName) => {
    const contacts = getContactsList()
    const contactsAfterRemoval = contacts.filter((item) =>{
        return item.userName != userName;
    })
    
    if(contactsAfterRemoval.length < contacts.length){
        fs.writeFileSync('files/contacts.json', JSON.stringify(contactsAfterRemoval))
    } else {
        console.log('User not found')
    }

    
}

const isAddedToContact = (userName, profileName) => {
    var res = false;
    const contactList = getContactsList();

    const tempList = contactList.filter((user) => {
        return user.userName === userName
    })

    if (tempList.length === 0){
        return res;
    } else {
        
        const contactsAlreadyAdded = tempList[0].contactList;
        contactsAlreadyAdded.forEach(contact => {
            if (contact === profileName){
                res= true;
            }
        })

        return res;
    }
}

module.exports = {
    addContact: addContact,
    getContactsList : getContactsList,
    isAddedToContact:isAddedToContact
}