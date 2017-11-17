let favoriteCategories = new Array();
favoriteCategories.push(3);
favoriteCategories.push(6);
favoriteCategories.push(7);
let categories;
let nCategories;
let catIDs = new Array();



//FOR CATEGORY OF MENU
let catNav = document.querySelector(".catNav nav");
let favNav = document.querySelector(".favNav nav");
let navLinkTemplate = document.querySelector("#navLinkTemplate").content;
//FOR EVENT LIST OF PAGE CONTENT
let eventList;
let eventItemTemplate;
//FOR SINGLE EVENT DETAILS
let eventDetails;
let eventDetailsTemplate;
//FOR SINGLE PAGE DETAILS
let pageDetails;
let pageDetailsTemplate;
//PAGE INDEXING
let currentPageIndex;
let previousHref = "";


function loadThisPage(){
    if(window.location.href.indexOf("/about.html") != -1){
        //REMOVE ALL PAGE CONTENT
        if(pageDetails!=null) pageDetails.innerHTML = "";

        //YOU ARE IN ABOUT PAGE, SO LOAD ABOUT PAGE
        pageDetails = document.querySelector(".pageDetails");
        pageDetailsTemplate = document.querySelector("#pageDetailsTemplate").content;


        getAboutUsPage();
    }else if(window.location.href.indexOf("/logout.html") != -1){
        alert("Log out page required Server Side Scripting....");
    }else{
        //YOU ARE IN INDEX PAGE, SO LOAD DEFAULT EVENTS
        eventList = document.querySelector(".eventList");
        eventItemTemplate = document.querySelector("#eventItemTemplate").content;

        eventDetails = document.querySelector(".eventDetails");
        eventDetailsTemplate = document.querySelector("#eventDetailsTemplate").content;


        setTimeout(function(){

            if(window.location.href != previousHref){
                //CLEAR ALL
                if(eventList!=null) eventList.innerHTML = "";
                if(eventDetails!=null) eventDetails.innerHTML = "";

                //SET CURRENT PAGE INDEX
                currentPageIndex = 1;

                //SET LOAD MORE OPTION TO INITIAL
                document.querySelector(".loadMoreOption button").setAttribute("onclick","loadThisPage()");
                document.querySelector(".loadMoreOption button").textContent="Load More";
                document.querySelector(".loadMoreOption button").classList.add("primary");


                //SET PREVIOUS HREF
                previousHref = window.location.href;
            }

            let uri = window.location.href.split("#");
            if(uri.length>1){
                if(catIDs.indexOf(parseInt(uri[1])) != -1){
                    getEventsByCategory(uri[1]);
                }else if(uri[1] == "all"){
                    getEventsAll();
                }else getEventsByDefault();
            }else getEventsByDefault();
        },300);
    }
}


function getCategories(){
    let catUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/categories/?per_page=100&_embed";
    fetch(catUrl).then(res=>res.json()).then(showCategoires);
}
function getEventsAll(){
    eventList.parentNode.style.display = "block";
    eventDetails.parentNode.style.display = "none";

    let eventsUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events?per_page=5&page="+currentPageIndex+"&_embed";
    currentPageIndex = currentPageIndex + 1;
    fetch(eventsUrl).then(res=>res.json()).then(showEvents).catch(function() {
        document.querySelector(".loadMoreOption button").setAttribute("onclick","");
        document.querySelector(".loadMoreOption button").textContent="--End--";
        document.querySelector(".loadMoreOption button").classList.remove("primary");
    });
}
function getEventsByDefault(){
    getEventsByCategory(favoriteCategories.join(","));
}
function getEventsByCategory(catID){
    eventList.parentNode.style.display = "block";
    eventDetails.parentNode.style.display = "none";

    let catEventUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events?per_page=5&page="+currentPageIndex+"&categories="+catID+"&_embed";
    currentPageIndex = currentPageIndex + 1;
    fetch(catEventUrl).then(res=>res.json()).then(showEvents).catch(function() {
        document.querySelector(".loadMoreOption button").setAttribute("onclick","");
        document.querySelector(".loadMoreOption button").textContent="--End--";
        document.querySelector(".loadMoreOption button").classList.remove("primary");
    });
}
function getEventsById(id){
    eventList.parentNode.style.display = "none";
    eventDetails.parentNode.style.display = "block";

    let eventUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/events/" + id + "?_embed";
    fetch(eventUrl).then(res=>res.json()).then(showEventDetails);
}
function getAboutUsPage(){
    let pageID = 96;
    let eventUrl = "https://studkea.jprkopat.com/semester_2/theme0701/exercise/huset-kbh/wp-json/wp/v2/pages/"+pageID+"?_embed";
    fetch(eventUrl).then(res=>res.json()).then(showPageDetails);
}



function showCategoires(cats){
    categoires = cats;

    let nCats = {};
    nCats["root"] = [0];
    cats.forEach(function(cat){
        catIDs.push(cat.id);
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


    //NOW SET closeOnSelectNavItem FUNCTION
    closeOnSelectNavItem();

    //NOW LOAD PAGE & CONTENT
    loadThisPage();
}
function showEachCategory(cat){
    if(!isNumeric(cat)){
        let clone = navLinkTemplate.cloneNode(true);
        clone.querySelector("a").setAttribute("data-cat",cat.id);
        clone.querySelector("a").setAttribute("href","index.html#"+cat.id);
        clone.querySelector("a").textContent = cat.name;
        catNav.appendChild(clone);
        if(favoriteCategories.indexOf(cat.id) != -1){
            let clone2 = navLinkTemplate.cloneNode(true);
            clone2.querySelector("a").setAttribute("data-cat",cat.id);
            clone2.querySelector("a").setAttribute("href","index.html#"+cat.id);
            clone2.querySelector("a").textContent = cat.name;
            favNav.appendChild(clone2);
        }
    }
}
function showEvents(events){
    events.forEach(showEachEvent);
}
function showEachEvent(event){
    console.log(event);

    let clone = eventItemTemplate.cloneNode(true);

    clone.querySelector(".dTitle").textContent = event.title.rendered.toLowerCase();
    clone.querySelector(".dDate").textContent = event.acf.event_date;
    clone.querySelector(".dTime").textContent = event.acf.open_time;
    clone.querySelector(".dVenue").textContent = event.acf.event_venue;
    clone.querySelector(".dImage").setAttribute("src", event._embedded["wp:featuredmedia"][0].media_details.sizes.medium_large.source_url);
    clone.querySelector(".dDescription").innerHTML = event.content.rendered;
    let postCategories = new Array();
    categoires.forEach(function(cat){
        //console.log(event.categories.indexOf(cat.id));
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
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.facebook_link+'" target="_blank" rel="noopener">&nbsp;<i class="fa fa-facebook socialIcon"></i></a>';
    }
    if(event.acf.twitter_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.twitter_link+'" target="_blank" rel="noopener"><i class="fa fa-twitter socialIcon"></i></a>';
    }
    if(event.acf.instagram_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.instagram_link+'" target="_blank" rel="noopener"><i class="fa fa-instagram socialIcon"></i></a>';
    }
    if(event.acf.flickr_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.flickr_link+'" target="_blank" rel="noopener"><i class="fa fa-flickr socialIcon"></i></a>';
    }
    if(event.acf.website_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.website_link+'" target="_blank" rel="noopener"><i class="fa fa-globe socialIcon"></i></a>';
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
        //console.log(event.categories.indexOf(cat.id));
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
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.facebook_link+'" target="_blank" rel="noopener">&nbsp;<i class="fa fa-facebook socialIcon"></i></a>';
    }
    if(event.acf.twitter_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.twitter_link+'" target="_blank" rel="noopener"><i class="fa fa-twitter socialIcon"></i></a>';
    }
    if(event.acf.instagram_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.instagram_link+'" target="_blank" rel="noopener"><i class="fa fa-instagram socialIcon"></i></a>';
    }
    if(event.acf.flickr_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.flickr_link+'" target="_blank" rel="noopener"><i class="fa fa-flickr socialIcon"></i></a>';
    }
    if(event.acf.website_link.length > 0){
        clone.querySelector(".dSocialLink").innerHTML = clone.querySelector(".dSocialLink").innerHTML + '<a href="'+event.acf.website_link+'" target="_blank" rel="noopener"><i class="fa fa-globe socialIcon"></i></a>';
    }
    eventDetails.appendChild(clone);
}
function showPageDetails(page){
    let clone = pageDetailsTemplate.cloneNode(true);

    clone.querySelector(".dTitle").textContent = page.title.rendered.toLowerCase();
    clone.querySelector(".dContent").innerHTML = page.content.rendered;

    pageDetails.appendChild(clone);
}

getCategories();
