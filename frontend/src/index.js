// JS file was required at bottom of HTML file so no need for DOMContentLoaded
const BASE_URL = "http://localhost:3000"
const GIFTS_URL = `${BASE_URL}/gifts`
const USERS_URL = `${BASE_URL}/users`
const FAVORITES_URL = `${BASE_URL}/favorites`
const giftCollection = document.querySelector('#gift-collection')
const favCollection = document.querySelector('#fav-collection')
const likeButton = document.querySelector('.like-btn')
const signupForm = document.querySelector('#signup-form')
const signupInputs = document.querySelectorAll(".signup-input")
const header = document.querySelector('.header-banner')
let currentUser


function putGiftsOnDom(giftArray){
    giftCollection.innerHTML = "<h2>All Gift Ideas</h2>"
    giftArray.forEach(gift => {
        giftCollection.innerHTML += `<div class="card">
          <h2>${gift.title} ($${gift.price})</h2>
          <h4 class="gift-cat">${gift.category}</h4>
          <a href=${gift.link} target="_blank"><img src=${gift.image} class="gift-image" /></a>
          <p>${gift.description}<p>
          <button data-gift-id=${gift.id} class="like-btn">♡</button>
        </div>`
    })
}

function putFavoritesOnDom(favArray){
    favCollection.innerHTML = "<h2>My Favorites</h2>"
    favArray.forEach(favorite => {
        favCollection.innerHTML += `<div class="card">
          <h2>${favorite.gift.title} ($${favorite.gift.price})</h2>
          <h4 class="gift-cat">${favorite.gift.category}</h4>
          <a href=${favorite.gift.link} target="_blank"><img src=${favorite.gift.image} class="gift-image" /></a>
          <p>${favorite.gift.description}<p>
          <button data-gift-id=${favorite.gift.id} class="like-btn">♡</button>
        </div>`
    })
}

function fetchGifts(){
    fetch(GIFTS_URL)
    .then(res => res.json())
    .then(gifts => putGiftsOnDom(gifts))
}

function fetchFavorites(){
    fetch(BASE_URL + '/users/' + currentUser.id + '/favorites')
    .then(res => res.json())
    .then(favorites => putFavoritesOnDom(favorites))
}

signupForm.addEventListener('submit', function(e){
    e.preventDefault()
    fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            user: {
                name: signupInputs[0].value,
                email: signupInputs[1].value,
                password: signupInputs[2].value
            }
        })
    })
    .then(res => res.json())
    .then(function(object){
        if (object.message) {
            alert(object.message)
        }
        else {
        loggedInUser(object)
        }
    }
    )
})

header.addEventListener('click', function(e) {
    if (event.target.className == "favorites-link") {
        giftCollection.style.display = 'none';
        event.target.style.display = 'none';
        fetchFavorites();
    }
})

function loggedInUser(object){
    currentUser = object
    signupForm.style.display = 'none'
    welcome.innerHTML = `<h4>Welcome back, ${currentUser.name}!</h4>`
    header.innerHTML = `<h4 class="favorites-link">View only my Favorites</h4>`
    fetchGifts()
}

giftCollection.addEventListener('click', function(e){
    // console.log(event.target.className, event.target.style.color)
    e.preventDefault()
    if ((event.target.className == "like-btn") && (event.target.style.color !== 'red')) {
        let target = event.target
            fetch(FAVORITES_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                        user_id: `${currentUser.id}`,
                        gift_id: `${event.target.dataset.giftId}`
                })
        })
        .then( res => res.json())
        .then( res => target.dataset.favId = res.id);
        event.target.style.color = 'red';}
    else if ((event.target.className == "like-btn") && (event.target.style.color == 'red')) {
        event.target.style.color = 'black';
        fetch(FAVORITES_URL + '/' + event.target.dataset.favId, {
            method: "DELETE"
        })
    }
})


// how do I have login option? is this necessary?
// fetchGifts()
