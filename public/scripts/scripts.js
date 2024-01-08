const postContainer = document.getElementById('postContainer');
const url = 'https://localhost:8080/posts';

window.addEventListener('load', fetchData);

//----- this shows and hides create post form
function showCreatePostForm(){
	const item = document.getElementById("CreatePostFormSection");
	item.classList.remove("d-none");
}
function hideCreatePostForm(){
	document.getElementById("CreatePostFormSection").classList.add("d-none");
}

//----- functions to call api
function createPost(){
  const form = document.getElementById('CreatePostForm');
  const Name = document.getElementById("blogAuthor").value;
  const Heading = document.getElementById("blogHeading").value;
  const Content = document.getElementById("blogContent").value;
  console.log("jag körs" + Name + Heading + Content);
  fetch("/createpost", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      blogAuthor: Name,
      blogHeading: Heading,
      blogContent: Content,
    })
  })
  .then(response => response.json())
    .then(data =>{
      if(data.error){
        displayAlert(data.error, 'danger');
      }else{
        displayAlert('Post created successfully', 'success');
        fetchData();
        form.reset();
        hideCreatePostForm();
      }
    })
  .catch(error =>{
    displayAlert(error, 'danger');
  })

}
function updatePost(id){
  console.log(id);
  event.preventDefault();
  const updateForm = document.getElementById(`EditPost${id}Form`);
  const Name = updateForm.elements['blogAuthor'].value;
  const Heading = updateForm.elements['blogHeading'].value;
  const Content = updateForm.elements['blogContent'].value;

  console.log(Name + Heading + Content);

  fetch(`/updatepost/${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json', // Also, corrected the typo in 'application/json'
    },
    body: JSON.stringify({
        blogAuthor: Name,
        blogHeading: Heading,
        blogContent: Content,
    })
})
  .then(response => response.json())
  .then(data => {
      if(data.error){
          console.error(data.error);
          displayAlert(data.error, 'danger');
      } else {
          console.log(data.message);
          displayAlert('Post edited successfully', 'success');
          fetchData();
      }
  })
  .catch(error => {
      console.error('Error', error);
      displayAlert(error, 'danger');
  });
  

}
function deletePost(id){
  console.log("deleting post: " + id);

  fetch(`/deletepost/${id}`,{
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data =>{
    if(data.error){
      console.error(data.error);
      displayAlert(data.error, 'danger');
    }else{
      console.log(data.message);
      displayAlert('Post removed successfully', 'success');
      fetchData();
    }
  })
  .catch(error =>{
    console.error('Error', error);
    displayAlert(error, 'danger');
  });


}

document.getElementById('CreatePostForm').addEventListener('submit', function(event){
  event.preventDefault();
  createPost();
});

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


//-----	this shows and hides post edit form
function showEditPostForm(id){
	const Post = document.getElementById(id);
	const PostContent = document.getElementById(id).getElementsByClassName("card-text")[0].textContent;
	const PostHeading = document.getElementById(id).getElementsByClassName("card-title")[0].textContent;
  console.log(`id för post du redigerar:${id}`);
  const html = `
	<section class="container">
        <form id="EditPost${id}Form">
          <div class="mt-4 mb-3">
            <label for="blogHeading${id}" class="form-label">Blog title</label>
            <input type="text" class="form-control" name="blogHeading" id="blogHeading${id}" placeholder="Header title" value="${PostHeading}"></input
          </div>
          <div class="mb-3">
            <label for="blogAuthor${id}" class="form-label">Author</label>
            <input type="text" class="form-control" id="blogAuthor${id}" name="blogAuthor" placeholder="Author name">
          </div>
          <!-- <div class="mb-3">
            <label for="blogImage${id}" class="form-label">Blog heading image</label>
            <input class="form-control" type="file" id="blogImage${id}">
          </div> -->
          <div class="mb-3">
            <label for="blogContent${id}" class="form-label">Blog content</label>
            <textarea class="form-control" id="blogContent${id}" name="blogContent" rows="3">${PostContent}</textarea>
          </div> 
          <div class="col-auto">
            <button onclick="updatePost(${id})" type="submit" class="btn btn-primary mb-3">Submit</button>
            <button onclick="hideEditPostForm(${id})" class="btn btn-outline-primary mb-3">Cancel</button>
          </div>
        </form>
	</section>
	`;

	Post.innerHTML = html;
	console.log(id);
	console.log(Post);
}
function hideEditPostForm(id)
{
  //dölj editpostformuläret här //vg fixa
}

function fetchData(){
    postContainer.innerHTML = "";
    fetch(url)
    .then((result) => result.json())
    .then((posts) =>{
        if (posts.length > 0){
            posts.forEach((post) =>{
                //const shortenString = post.content.slice(0, 200); //Förkorta denna sträng till färre tecken.
                const html = `
                    <div class="card mb-4" id="${post.id}">
                        <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-desc">Written by: <span>${post.author}</span> on ${post.creation_date}</p>
                        <p class="card-text">${post.content}</p>
                        <button onclick="deletePost(${post.id})" class="btn btn-danger">Delete &#128465</button>
                        <button onclick="showEditPostForm(${post.id})" class="btn btn-warning">Edit</button>
                        </div>
                    </div>
            `
            postContainer.innerHTML += html;
            });
        }
    });
}
