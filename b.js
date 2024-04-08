// Retrieve the value stored under the 'currentUser' key in localStorage
const currentUserString = localStorage.getItem('currentUser');

// Parse the retrieved string back into an object
const currentUser = JSON.parse(currentUserString);

// Log the values of the currentUser object
console.log(currentUser);
