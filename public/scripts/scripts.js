console.log('Hej jag funkar');

const postContainer = document.getElementById('postContainer');
const url = 'https://localhost:8080/posts';

window.addEventListener('load', fetchData);

function fetchData(){
    fetch(url)
    .then((result) => result.json())
    .then((posts) =>{
        if (posts.length > 0){
            console.log(posts);
            console.log(posts);
            posts.forEach((post) =>{


     
                const shortenString = post.content.slice(0, 200) + '...'; //Förkorta denna sträng till färre tecken.
                
             
    
                const html = `
                <div class="col">
                    <div class="card">
                        <img src="${post.image_src}" class="card-img-top" alt="blog header image">
                        <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${shortenString}</p>
                        <a href="/posts/${post.id}" class="btn btn-primary">Read more</a>
                        <a href="/deletepost/${post.id}" class="btn btn-primary">Delete &#128465</a>
                        </div>
                    </div>
                </div>
            `
            postContainer.innerHTML += html;
            });
        }
    });
}
