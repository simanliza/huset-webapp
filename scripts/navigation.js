/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.querySelector(".pageNavigation").style.width = "350px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.querySelector(".pageNavigation").style.width = "0px";
}
/* on click on nav item > close the nav */
function closeOnSelectNavItem(){
    document.querySelectorAll("nav a").forEach(function(item){
        item.addEventListener("click",closeNav);
    });
}
