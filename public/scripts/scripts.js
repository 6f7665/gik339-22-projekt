console.log('Hej jag funkar');

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

//-----	this shows and hides post edit form
function editPost(id){
	const Post = document.getElementById(id);
	const PostContent = document.getElementById(id).getElementsByClassName("card-text")[0].textContent;
	const PostHeading = document.getElementById(id).getElementsByClassName("card-title")[0].textContent;
	const html = `
	<section class="container">
        <form method="POST" action="/updatepost/${id}" id="EditPost${id}Form">
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
            <button type="submit" class="btn btn-primary mb-3">Submit</button>
            <a href="/" class="btn btn-outline-primary mb-3">Cancel</a>
          </div>
        </form>
	</section>
	`;
	Post.innerHTML = html;
	console.log(id);
	console.log(post);
}

function fetchData(){
    fetch(url)
    .then((result) => result.json())
    .then((posts) =>{
        if (posts.length > 0){
            console.log(posts);
            console.log(posts);
            posts.forEach((post) =>{
                const shortenString = post.content.slice(0, 200); //Förkorta denna sträng till färre tecken.
                const html = `
                <div class="col">
                    <div class="card" id="${post.id}">
                        <img src="${post.image_src}" class="card-img-top" alt="blog header image">
                        <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${shortenString}<span>...</span></p>
                        <!--<a href="/posts/${post.id}" class="btn btn-primary">Read more</a>-->
                        <a href="/deletepost/${post.id}" class="btn btn-primary">Delete &#128465</a>
                        <a href="#" onclick="editPost(${post.id})" class="btn btn-primary">Edit</a>
                        </div>
                    </div>
                </div>
            `
            postContainer.innerHTML += html;
            });
        }
    });
}
