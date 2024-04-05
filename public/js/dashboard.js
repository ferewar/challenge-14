// Function to handle post deletion
window.deletePost = function(id) {
  if (confirm('Are you sure you want to delete this post?')) {
    fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        console.log('Post deleted successfully');
        location.reload(); // Reload the page to update the list of posts
      } else {
        alert('Failed to delete post');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
};

// Function to switch to edit mode
window.editPost = function(id) {
  const postElement = document.getElementById('post-' + id);
  const viewModeDiv = postElement.querySelector('.view-mode');
  const editModeDiv = postElement.querySelector('.edit-mode');

  // Toggle visibility
  viewModeDiv.style.display = 'none';
  editModeDiv.style.display = 'block';
};

// Function to cancel edit mode
window.cancelEdit = function(id) {
  const postElement = document.getElementById('post-' + id);
  const viewModeDiv = postElement.querySelector('.view-mode');
  const editModeDiv = postElement.querySelector('.edit-mode');

  // Toggle visibility
  viewModeDiv.style.display = 'block';
  editModeDiv.style.display = 'none';
};

// Function to save the edited post
window.savePost = function(id) {
  const postElement = document.getElementById('post-' + id);
  const title = postElement.querySelector('.edit-title').value;
  const content = postElement.querySelector('.edit-content').value;

  fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      content
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    location.reload(); 
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

// Event listener for the new post form submission
document.addEventListener('DOMContentLoaded', () => {
  const newPostForm = document.getElementById('new-post-form');
  if (newPostForm) {
    newPostForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;

      // Perform fetch call to add a new post
      fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        location.reload(); // Reload the page to show the new post
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }
});
