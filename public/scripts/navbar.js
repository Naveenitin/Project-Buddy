var nav = document.querySelector('#mynav'); // Identify target
window.addEventListener('scroll', function(event) { // To listen for event
    event.preventDefault();
    if (window.scrollY <= 150) { // Just an example
        nav.classList.add("navbar-dark");
        nav.classList.add("bg-dark");
        nav.classList.remove("bg-light");
        nav.classList.remove("navbar-light");
    } else {
        nav.classList.add("navbar-light");
        nav.classList.add("bg-light");
        nav.classList.remove("bg-dark"); 
        nav.classList.remove("navbar-dark"); 
    }
});