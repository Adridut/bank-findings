import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";



export async function getGroups(query){
  let groups = await localforage.getItem("groups");
  if (!groups) groups = [];
  if (query) {
    groups = matchSorter(groups, query, { keys: ["name"] });
  }
  return groups.sort(sortBy("name", "createdAt"));
}

export async function getContacts(query) {
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["title", "groupId"] });
  }
  return contacts.sort(sortBy("title", "createdAt"));
}

export async function createGroup() {
  // localforage.dropInstance().then(function() {
  // console.log('Dropped the store of the current instance');
  // });
  let id = Math.random().toString(36).substring(2, 9);
  let group = { id, createdAt: Date.now() };
  let groups = await getGroups();
  groups.unshift(group);
  await set("groups", groups);
  return group;
}

export async function createContact(groupId) {
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now(), groupId: groupId };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set("contacts", contacts);
  return contact;
}

export async function getGroup(id) {
  let groups = await localforage.getItem("groups");
  let group = groups.find(group => group.id === id);
  return group ?? null;
}

export async function getContact(id) {
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

export async function updateGroup(id, updates) {
  let groups = await localforage.getItem("groups");
  let group = groups.find(group => group.id === id);
  if (!group) throw new Error("No group found for", id);
  Object.assign(group, updates);
  await set("groups", groups);
  return group;
}

export async function updateContact(id, updates) {
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set("contacts", contacts);
  return contact;
}

export async function deleteGroup(id) {
  let groups = await localforage.getItem("groups");
  let index = groups.findIndex(group => group.id === id);
  if (index > -1) {
    groups.splice(index, 1);
    await set("groups", groups);
    return true;
  }
  return false;
}

export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set("contacts", contacts);
    return true;
  }
  return false;
}

function set(key, value) {
  return localforage.setItem(key, value);
  // return localforage.setItem("contacts", contacts);
}

