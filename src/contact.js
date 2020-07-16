const fs = require('fs')

const addContact = (userName, contact) => {

    const contacts = getContactsList()

    
    const duplicateTitle = contacts.filter((user) => {
        return user.userName === userName
    })
    
    if(duplicateTitle.length === 0){

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
        console.log('getContactList : no such file present in the system')
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

module.exports = {
    addContact: addContact,
    getContactsList : getContactsList
}