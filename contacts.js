const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname, '/db/contacts.json');

const uniqid = require('uniqid');

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function listContacts() {
  try {
    const contacts = await getContacts();
    console.log('All your contacts!');
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContacts();
    const contact = contacts.find(({ id }) => id === contactId);
    if (!contact) {
      return console.log(`We coudnt find contact with  ID ${contactId} !`);
    }
    console.log('Here is your contact!');
    console.table(contact);
    return contact;
  } catch (error) {
    console.error(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContacts();
    const newContacts = contacts.filter(({ id }) => id !== contactId);
    if (contacts.length === newContacts.length) {
      return console.log(`Contact with this ID ${contactId}  is not found!`);
    }
    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      'utf8',
    );
    console.log('You removed this contact!');
    console.table(newContacts);
    return newContacts;
  } catch (error) {
    console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContacts();
    const newContact = { id: uniqid(), name, email, phone };
    const newContacts = [...contacts, newContact];
    if (
      contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase)
    ) {
      return console.warn(`This name already exists`);
    } else if (contacts.find(contact => contact.phone === phone)) {
      return console.warn(`This number already exists!`);
    } else if (contacts.find(contact => contact.email === email)) {
      return console.warn(`This email already exists!`);
    } else {
      await fs.writeFile(
        contactsPath,
        JSON.stringify(newContacts, null, 2),
        'utf8',
      );
      console.log('You added a new contact!');
      console.table(newContacts);
    }
  } catch (error) {
    console.error(error.message);
  }
}
module.exports = { listContacts, getContactById, removeContact, addContact };
