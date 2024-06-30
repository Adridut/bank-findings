import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";


// Usernames: John, Alice, Bob
// Passwords: 123


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

export async function getUsers() {
  let users = await localforage.getItem("users");
  if (!users) users = [];
  return users;
}

export async function createGroup() {
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

export async function createUser(username, password) {
  // localforage.dropInstance().then(function() {
  //   console.log('Dropped the store of the current instance');
  // });
  let user = { username: username, password: password, createdAt: Date.now(), logedIn: false, notifications: []};
  let users = await getUsers();
  users.unshift(user);
  await set("users", users);
  return user;
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

export async function getUser(username) {
  let user = users.find(user => user.username === username);
  return user ?? null;
}

export async function getCurrentUser() {
  let users = await localforage.getItem("users");
  let user = users.find(user => user.logedIn === true);
  return user ?? null;
}

export async function getLoggedOutUsers() {
  let users = await localforage.getItem("users");
  let loggedOutUsers = users.filter(user => user.logedIn === false);
  return loggedOutUsers ?? null;
}

export async function login(username, password) {
  let users = await localforage.getItem("users");
  let user = users.find(user => user.username === username);
  if (!user) return false;
  if (user.password === password) {
    Object.assign(user, { logedIn: true });
    await set("users", users);
    return true;
  }
  return false;
}

export async function logout() {
  let users = await localforage.getItem("users");
  let currentUser = users.find(user => user.logedIn === true);
  Object.assign(currentUser, { logedIn: false, notifications: []});
  await set("users", users);
  return true;
}

export async function updateGroup(id, updates) {
  let groups = await localforage.getItem("groups");
  let group = groups.find(group => group.id === id);
  if (!group) throw new Error("No group found for", id);
  Object.assign(group, updates);
  await set("groups", groups);
  // notify logged out users
  let currentUser = await getCurrentUser();
  let users = await localforage.getItem("users");
  let loggedOutUsers = users.filter(user => user.logedIn === false);
  let notification = "Entity " + group.name + " has been updated" + " by " + currentUser.username
  for (let i = 0; i < loggedOutUsers.length; i++) {
    console.log(loggedOutUsers[i]);
    // loggedOutUsers[i].notifications = [notification];
    loggedOutUsers[i].notifications.push(notification)
    await set("users", users);
  }
  return group;
}

export async function updateContact(id, updates) {
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set("contacts", contacts);
  // notify logged out users
  let currentUser = await getCurrentUser();
  let users = await localforage.getItem("users");
  let loggedOutUsers = users.filter(user => user.logedIn === false);
  let notification = "Finding " + contact.title + " has been updated" + " by " + currentUser.username
  for (let i = 0; i < loggedOutUsers.length; i++) {
    console.log(loggedOutUsers[i]);
    // loggedOutUsers[i].notifications = [notification];
    loggedOutUsers[i].notifications.push(notification)
    await set("users", users);
  }
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

