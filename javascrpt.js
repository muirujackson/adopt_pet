async function getAccessToken() {
      const apiUrl = 'https://api.petfinder.com/v2/oauth2/token';
      const postData = 
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData,
      });

      if (!response.ok) {
        throw new Error('Failed to obtain access token.');
      }

      const data = await response.json();
      return data.access_token;
    }


    let accessToken
    async function fetchAccessToken() {
      try {
        const accessToken = await getAccessToken();
        fetchAnimals(accessToken);
        // You can now use the access token to make further requests to the Petfinder API
      } catch (error) {
        console.error('Error obtaining access token:', error);
      }
    }

    async function fetchAnimals(accessToken) {
      console.log(accessToken)
      const apiUrl = 'https://api.petfinder.com/v2/animals?limit=50';
      // Display loading message
      animalContainer.innerHTML = '<p class="message">Loading...</p>';

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch animals data.');
        }

        const data = await response.json();
        if (data.animals.length > 0) {
          console.log(data)
          displayAnimals(data.animals);
        } else {
          displayMessage('No animals found.');
        }
      } catch (error) {
        console.error('Error fetching animals:', error);
        displayMessage('Error fetching animals. Please try again later.');
      }
    }

    function displayAnimals(animals) {
      const animalContainer = document.getElementById('animalContainer');
      animalContainer.innerHTML = ''; // Clear previous content
      animals.filter(getFirstPhotoUrl)
      .forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.classList.add('animal-card');
        animalDiv.innerHTML = `
          <img src="${animal.photos[0].full}" alt="${animal.name}">
          <h2>${animal.name}</h2>
          <p>${animal.species} - ${animal.age}</p>
          <p>${animal.type} - ${animal.breeds.primary}</p>
          <p>${animal.description}</p>
          <button class="like-button">Like</button>
          <button class="dislike-button">Dislike</button>
          <div class="comment-section">
            <textarea class="comment-input" placeholder="Add a comment"></textarea>
            <button class="comment-button">Post Comment</button>
            <ul class="comments-list"></ul>
          </div>
        `;
        animalContainer.appendChild(animalDiv);
      });
    }

    function displayMessage(message) {
      const animalContainer = document.getElementById('animalContainer');
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      messageDiv.textContent = message;
      animalContainer.appendChild(messageDiv);
    }

    function getFirstPhotoUrl(animal) {
      if(!animal.photos.length || !animal.description)
        return false;
      else
      console.log(animal) 
      return true;
    }

    fetchAccessToken();
    document.addEventListener('DOMContentLoaded', () => {
  const animalContainer = document.getElementById('animalContainer');

  animalContainer.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('like-button') || target.classList.contains('dislike-button')) {
      handleLikeDislikeClick(target);
    } else if (target.classList.contains('comment-button')) {
      handleCommentClick(target);
    }
  });
});

function handleLikeDislikeClick(button) {
  const otherButton = button.classList.contains('like-button') ? button.nextElementSibling : button.previousElementSibling;
  button.classList.toggle('active');
  otherButton.classList.remove('active');
}

function handleCommentClick(button) {
  const commentSection = button.closest('.comment-section');
  const commentInput = commentSection.querySelector('.comment-input');
  const commentsList = commentSection.querySelector('.comments-list');
  const commentText = commentInput.value.trim();

  if (commentText !== '') {
    const li = document.createElement('li');
    li.textContent = commentText;
    commentsList.appendChild(li);
    commentInput.value = ''; // Clear the input
  }
}