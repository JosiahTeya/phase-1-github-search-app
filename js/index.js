const GITHUB_API_URL = 'https://api.github.com';

const searchForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

// search GitHub for users matching the input value
function searchUsers(event) {
  event.preventDefault(); // prevent default form submission behavior

  // clear previous search results
  userList.innerHTML = '';
  reposList.innerHTML = '';

  const searchQuery = searchInput.value.trim(); // remove leading/trailing whitespace

  // make request to User Search Endpoint
  fetch(`${GITHUB_API_URL}/search/users?q=${searchQuery}`, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  })
  .then(response => response.json())
  .then(data => {
    const users = data.items;
    users.forEach(user => {
      // create list item for each user with avatar, username, and profile link
      const userElem = document.createElement('li');
      userElem.innerHTML = `
        <img src='${user.avatar_url}' alt='${user.login}' width='50' height='50'>
        <span>${user.login}</span>
        <a href='${user.html_url}' target='_blank'>Profile</a>
      `;
      userElem.addEventListener('click', () => {
        showUserRepos(user.login); // show repositories for the clicked user
      });
      userList.appendChild(userElem);
    });
  })
  .catch(error => {
    console.error('Error searching for users:', error);
  });
}

// show repositories for the selected user
function showUserRepos(username) {
  // make request to User Repos Endpoint
  fetch(`${GITHUB_API_URL}/users/${username}/repos`, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  })
  .then(response => response.json())
  .then(data => {
    const repos = data;
    repos.forEach(repo => {
      // create list item for each repository with name and link to repo
      const repoElem = document.createElement('li');
      repoElem.innerHTML = `
        <a href='${repo.html_url}' target='_blank'>${repo.name}</a>
      `;
      reposList.appendChild(repoElem);
    });
  })
  .catch(error => {
    console.error(`Error getting repositories for ${username}:`, error);
  });
}

// add event listener to search form
searchForm.addEventListener('submit', searchUsers);
