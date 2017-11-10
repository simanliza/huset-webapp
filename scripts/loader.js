let favoriteCategories = new Array();
favoriteCategories.push(3);
let categories;
let nCategories;



//FOR CATEGORY OF MENU
let catNav = document.querySelector(".catNav nav");
let favNav = document.querySelector(".favNav nav");
let navLinkTemplate = document.querySelector("#navLinkTemplate").content;
//FOR EVENT LIST OF PAGE CONTENT
let eventList = document.querySelector(".eventList");
let eventItemTemplate = document.querySelector("#eventItemTemplate").content;
//FOR SINGLE EVENT DETAILS
let eventDetails = document.querySelector(".eventDetails");
let eventDetailsTemplate = document.querySelector("#eventDetailsTemplate").content;



function getCategories(){
    let catUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/categories/?per_page=100&embed";
    fetch(catUrl).then(res=>res.json()).then(showCategoires);
}
function getCategoriesByPost(postID){
    let catUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/categories?post="+postID+"&embed";
    fetch(catUrl).then(res=>res.json()).then(savePostCategoires);
}
function getEventsAll(){
    eventList.parentNode.style.display = "block";
    eventDetails.parentNode.style.display = "none";

    let eventsUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events?per_page=100&";
    fetch(eventsUrl).then(res=>res.json()).then(showEvents);
}
function getEventsByDefault(){
    getEventsByCategory(favoriteCategories.join(","));
}
function getEventsByCategory(catID){
    eventList.parentNode.style.display = "block";
    eventDetails.parentNode.style.display = "none";

    let catEventUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events?per_page=100&categories="+catID+"&";
    fetch(catEventUrl).then(res=>res.json()).then(showEvents);
}
function getEventsById(id){
    eventList.parentNode.style.display = "none";
    eventDetails.parentNode.style.display = "block";

    let eventUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events/" + id;
    fetch(eventUrl).then(res=>res.json()).then(showEventDetails);
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
    clone.querySelector(".dDetails").setAttribute("onclick","getEventsById("+event.id+")");
    eventList.appendChild(clone);
}
function showEventDetails(event){
    let clone = eventDetailsTemplate.cloneNode(true);

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
    eventDetails.innerHTML = "";
    eventDetails.appendChild(clone);
}


getCategories();
