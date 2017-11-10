let favoriteCategories = new Array();
favoriteCategories.push(3);
favoriteCategories.push(5);
let categories;
let nCategories;





//FOR CATEGORY OF MENU
let catNav = document.querySelector(".catNav nav");
let favNav = document.querySelector(".favNav nav");
let navLinkTemplate = document.querySelector("#navLinkTemplate").content;
//FOR EVENT LIST OF PAGE CONTENT
let eventList = document.querySelector(".eventList");
let eventItemTemplate = document.querySelector("#eventItemTemplate").content;





function getCategories(){
    let catUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/categories/?per_page=100&embed";
    fetch(catUrl).then(res=>res.json()).then(showCategoires);
}
function getCategoriesByPost(postID){
    let catUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/categories?post="+postID+"&embed";
    fetch(catUrl).then(res=>res.json()).then(savePostCategoires);
}
function getEventsAll(){
    let eventsUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events?per_page=100&";
    fetch(eventsUrl).then(res=>res.json()).then(showEvents);
}
function getEventsByDefault(){
    getEventsByCategory(favoriteCategories.join(","));
}
function getEventsByCategory(catID){
    let catEventUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events?per_page=100&categories="+catID+"&";
    fetch(catEventUrl).then(res=>res.json()).then(showEvents);
}
function getEventsById(id){

}



function showCategoires(cats){
    categoires = cats;

    let nCats = {};
    nCats["root"] = [0];
    cats.forEach(function(cat){
        if(cat.parent == 0){
            nCats.root.push(cat);
        }
    });
    nCats.root.forEach(function(rootCat){
        if(!isNumeric(rootCat)){
            nCats[rootCat.slug] = [rootCat.id];
            cats.forEach(function(cat){
                if(cat.parent == rootCat.id){
                    nCats[rootCat.slug].push(cat);
                }
            });
        }
    });

    nCategories = nCats;
    //THE EVENTS CATEGORY HOLDS ALL GENRE CATEGORY OF EVENTS, SO
    nCats.events.forEach(showEachCategory);



    //NOW LOAD DEFAULT EVENTS
    getEventsByDefault();
}
function showEachCategory(cat){
    if(!isNumeric(cat)){
        let clone = navLinkTemplate.cloneNode(true);
        clone.querySelector("a").setAttribute("data-cat",cat.id);
        clone.querySelector("a").setAttribute("onclick","getEventsByCategory('"+cat.id+"')");
        clone.querySelector("a").textContent = cat.name;
        catNav.appendChild(clone);
    }
}
function showEvents(events){
    eventList.innerHTML = "";
    events.forEach(showEachEvent);
}
function showEachEvent(event){
    console.log(event);

    let clone = eventItemTemplate.cloneNode(true);

    clone.querySelector(".dTitle").textContent = event.title.rendered.toLowerCase();
    clone.querySelector(".dDescription").innerHTML = event.content.rendered;
    let postCategories = new Array();
    categoires.forEach(function(cat){
        console.log(event.categories.indexOf(cat.id));
        if(cat.parent != nCategories.venues[0] && event.categories.indexOf(cat.id) !== -1){
            postCategories.push(cat.name);
        }
    });
    clone.querySelector(".dCategories").textContent = "Categories: " + postCategories.join(" / ");
    clone.querySelector(".dPrice").textContent = event.acf.ticket_price;
    if(event.acf.presale){
        clone.querySelector(".dBookNow").style.display = "inline-block";
        clone.querySelector(".dBookNow").setAttribute("href",event.acf.booking_link);
        clone.querySelector(".dPresale").style.display = "none";
    }else{
        clone.querySelector(".dBookNow").style.display = "none";
        clone.querySelector(".dPresale").style.display = "inline-block";
        clone.querySelector(".dPresale").textContent = "Presale Unavailable";
    }
    if(event.acf.facebook_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.facebook_link+'" target="_blank">&nbsp;<i class="fa fa-facebook socialIcon"></i></a>';
    }
    if(event.acf.twitter_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.twitter_link+'" target="_blank"><i class="fa fa-twitter socialIcon"></i></a>';
    }
    if(event.acf.instagram_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.instagram_link+'" target="_blank"><i class="fa fa-instagram socialIcon"></i></a>';
    }
    if(event.acf.flickr_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.flickr_link+'" target="_blank"><i class="fa fa-flickr socialIcon"></i></a>';
    }
    if(event.acf.website_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.website_link+'" target="_blank"><i class="fa fa-globe socialIcon"></i></a>';
    }
    eventList.appendChild(clone);
}


getCategories();







/*
function getAllooks(){
  fetch("https://t7.kea-alt-del.dk/wp-json/wp/v2/books?_embed")
  .then(res=>res.json())
  .then(showBooks);
}
function getSingleBookById(myID){
    console.log(myID);
  fetch("https://t7.kea-alt-del.dk/wp-json/wp/v2/books/"+myID+"?_embed")
  .then(res=>res.json())
  .then(showSingleBook);
}

function showSingleBook(theBook){
    console.log(theBook);
    let list = document.querySelector("#list");
    let template = document.querySelector("#bookTemplate").content;

    let clone = template.cloneNode(true);
    let title = clone.querySelector("h1");
    let excerpt = clone.querySelector(".excerpt");
    let price = clone.querySelector(".price span");
    let img = clone.querySelector("img");


    title.textContent = theBook.title.rendered;
    excerpt.innerHTML = theBook.excerpt.rendered;
    price.textContent = theBook.acf.price;
    //console.log(theBook._embedded["wp:featuredmedia"][0].media_details.sizes)
    img.setAttribute("src", theBook._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url);
    list.appendChild(clone);
}

function showBooks(data){
  //console.log(data)
  let list = document.querySelector("#list");
  let template = document.querySelector("#bookTemplate").content;

  data.forEach(function(theBook){
    console.log(theBook)
    let clone = template.cloneNode(true);
    let title = clone.querySelector("h1");
    let excerpt = clone.querySelector(".excerpt");
    let price = clone.querySelector(".price span");
    let img = clone.querySelector("img");
    let link = clone.querySelector("a.bookLink");


    title.textContent = theBook.title.rendered;
    excerpt.innerHTML = theBook.excerpt.rendered;
    price.textContent = theBook.acf.price;
    //console.log(theBook._embedded["wp:featuredmedia"][0].media_details.sizes)
    img.setAttribute("src", theBook._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url);
    link.setAttribute("href","book.html?bookid="+theBook.id+"&");
    list.appendChild(clone);
  });
}

let urlParams = new URLSearchParams(window.location.search);
let query = urlParams.get("bookid");

if(query){
    getSingleBookById(query);
}else{
    getAllooks();
}
*/
