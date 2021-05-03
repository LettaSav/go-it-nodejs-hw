const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname, '/db/contacts.json');

const uniqid = require('uniqid');

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  console.log('All your contacts!');
  console.table(contacts);
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  console.log('Here is your contact!');
  console.table(contact);
  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const newContacts = contacts.filter(({ id }) => id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  console.log('You removed this contact!');
  console.table(newContacts);
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: uniqid(), name, email, phone };
  const newContacts = [...contacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  console.log('You added a new contact!');
  console.table(newContacts);
}
module.exports = { listContacts, getContactById, removeContact, addContact };
