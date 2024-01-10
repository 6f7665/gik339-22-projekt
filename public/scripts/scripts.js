const postContainer = document.getElementById('postContainer');
const createPostBtn = document.getElementById('createPostBtn');
const fadeContainer = document.getElementById('fadeContainer');
const form = document.getElementById('createPostForm');
const formHeading = document.getElementById('formHeading');

// function that converts rgb to hexadecimal
function rgbToHex(rgb) {
  let [r, g, b] = rgb.match(/\d+/g); // Extract the numerical parts of the rgb string
  return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
}

//btn listener on all posts
postContainer.addEventListener('click', (event) => {
  if(event.target.classList.contains('btn-danger')){
      const postId = event.target.closest('.card').id.replace("post_", "");
      deletePost(postId);
  } else if(event.target.classList.contains('btn-warning')){
      const postId = event.target.closest('.card').id;
      setFormData(postId);
      revealForm(true, postId);
  }
});

window.addEventListener('load', fetchData);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const isEditing = form.getAttribute('data-isEditing') === 'true';
  const postId = form.getAttribute('data-postId');

  if (isEditing) {
      updatePost(postId);
  } else {
      createPost();
  }
  closeForm();
});

//close form modal popup
function closeForm(){
  //removes blackscreen fade
  fadeContainer.style.opacity = 0;
  fadeContainer.style.visibility = 'hidden';
  //removes animation
  form.classList.remove('slide-in-animation');
  //resets form
  form.reset();
}
// form modal slidein
function revealForm(isEditing = false, postId = ""){
  if (isEditing) {
    form.setAttribute('data-isEditing', 'true');
    form.setAttribute('data-postId', postId.replace("post_", ""));
    formHeading.textContent = `Updating post with an id of: ${postId.replace("post_", "")} 👏🤩`;
    form.querySelector('.btn-primary').textContent = "Update post";
} else {
    form.setAttribute('data-isEditing', 'false');
    form.setAttribute('data-postId', '');
    formHeading.textContent = `Create a new post 🫶🏼🌼🖍️`;
    form.querySelector('.btn-primary').textContent = "Create post";
}
  //blackscreen fade
  fadeContainer.style.opacity = 1;
  fadeContainer.style.visibility = 'visible';

  // css animation that slides in form from the right
  form.classList.add('slide-in-animation');

  const formBtns = form.querySelectorAll('.btn');
  
  // close form triggers
  fadeContainer.addEventListener('click', (event) =>{
    if (event.target === fadeContainer){
      closeForm();
    }
  });
  document.addEventListener('keydown', (event) =>{
    if (event.key === 'Escape'){
      closeForm();
    }
  });
  formBtns.forEach((button) =>{
    button.addEventListener('click', (event) =>{
      if(event.target.id === 'closeBtn'){
        closeForm();
      
      }else if(event.target.id === 'resetBtn'){
        //reset form trigger
        form.reset();
      }
    });
  });
}

//btn eventlistener to reveal form when clicking on it.
createPostBtn.addEventListener('click', () => {
  revealForm();
});

//function to call api

function fetchRequest(method, url, body){
  return fetch(url, {
    method: method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .catch(error =>{
    console.error('Error', error);
    displayAlert(error, 'danger');
  });
}

// function to create post
function createPost(){
  const formData = getFormData(form);
  fetchRequest('POST', '/posts', formData)
    .then(data => handleResponse(data));
}

// set form data when updating *REMEMBER
function setFormData(id){
  console.log('id är:' + id);
  const post = document.getElementById(id);
  const title = post.querySelector('.card-title');
  const author = post.querySelector('.post-author');
  const postText = post.querySelector('.card-text');
  const color = rgbToHex(title.style.color);
  console.log(color)
  form.elements['blogHeading'].value = title.textContent;
  form.elements['blogAuthor'].value = author.textContent;
  form.elements['blogContent'].value = postText.textContent;
  form.elements['blogColor'].value = color;

}

//Update post
function updatePost(id){
  const formData = getFormData(form);
  fetchRequest('PUT', `posts/${id}`, formData)
    .then(data => handleResponse(data));
  
}
// delete post
function deletePost(id){
  fetchRequest('DELETE', `posts/${id}`, body = {})
    .then(data => handleResponse(data));

  form.reset();
}

// function to get data from form returns an object with the values of each input field.
function getFormData(form){
  return{
    blogAuthor: form.elements['blogAuthor'].value,
    blogHeading: form.elements['blogHeading'].value,
    blogContent: form.elements['blogContent'].value,
    blogColor: form.elements['blogColor'].value
  }
}

// handle the respone data from the server
function handleResponse(data){
  if(data.error){
    displayAlert(data.error, data.type);
  }else{
    displayAlert(data.message, data.type);
    fetchData();
  }
}

// function to create alert messages and notify the frontend users of what happened.
function displayAlert(message, type){
  const alertContainer = document.getElementById('alertContainer');
  const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';

  const alertHtml = `
   <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <strong>Holymoly, </strong>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
  `;


  alertContainer.innerHTML = alertHtml;

}

// fetch and update data from db, gets called whenever a chance occurs to update the frontend.
function fetchData(){
    postContainer.innerHTML = "";
    const url = 'https://localhost:8080/posts';
    fetch(url)
    .then((result) => result.json())
    .then((posts) =>{
        if (posts.length > 0){
          let html = '';
            posts.forEach((post) =>{
                //const shortenString = post.content.slice(0, 200); //Förkorta denna sträng till färre tecken.
                html += `
                    <div class="card mb-4" id="post_${post.id}">
                        <div class="card-body">
                        <h5 class="card-title" style="color:${post.headingColor}">${post.title}</h5>
                        <p class="card-desc">Written by: <span class="post-author">${post.author}</span> on ${post.creation_date}</p>
                        <p class="card-text">${post.content}</p>
                        <button type="button" class="btn btn-danger" aria-label="Delete post ${post.id}">Delete &#128465</button>
                        <button type="button" class="btn btn-warning" aria-label="Edit post ${post.id}">Edit🖍️</button>
                        </div>
                    </div>
            `
            
            });
            postContainer.innerHTML += html;

       
        }

    });
  

}
 

