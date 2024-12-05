/* let searchnav = document.querySelector("#searchnav");
let navbartoggler = document.querySelector(".navbar-toggler");
let newsearch = document.querySelector(".newsearch");

let idvalue;

navbartoggler.addEventListener("click", ()=>{
    if(searchnav && searchnav.id === "searchnav"){
        idvalue = searchnav.id;
        searchnav.style.display="none";
        searchnav.removeAttribute("id");
        
        searchnav.classList.add("newsearch");

    }
    else if(searchnav.classList.contains("newsearch")){
        searchnav.classList.remove("newsearch");
        searchnav.setAttribute("id", idvalue);
    }
})





 */
let searchnav = document.querySelector("#searchnav");
let newsearch = document.querySelector(".newsearch");

// Function to move #searchnav to .newsearch
function moveSearchNav() {
    const bodywidth = window.innerWidth;                
    
   

    if (bodywidth >= 300 && bodywidth <= 767) {
        if (searchnav && !newsearch.contains(searchnav)) {
            newsearch.appendChild(searchnav); // Move #searchnav to .newsearch
            searchnav.removeAttribute("id");
            searchnav.classList.add("newsearch"); // Add newsearch class for styling
        }
    } else {
        const containerFluid = document.querySelector(".container-fluid");
        if (newsearch.contains(searchnav)) {
            containerFluid.appendChild(searchnav); // Move #searchnav back to .container-fluid
            searchnav.classList.remove("newsearch");
            searchnav.setAttribute("id", "searchnav"); // Restore the id
        }
    }



    
}

// Run on window resize
window.addEventListener("resize", moveSearchNav);

// Run on page load
moveSearchNav();




