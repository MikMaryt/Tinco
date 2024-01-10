const menu = document.querySelector('.menu');
const menubar = document.querySelector('.menubar');
const contentside = document.getElementById("main-content");
const footer = document.querySelector('footer');

let menutoggle = false;

menu.addEventListener('click',() => {
    console.log(menubar);
    console.log(document.querySelector('.menubar'));
    if (menutoggle) {
        contentside.style.marginLeft = "0";
        footer.style.marginLeft = "0";
        menubar.style.display = 'none';
    } else {
        contentside.style.marginLeft = "clamp(100px,12%,100%)";
        footer.style.marginLeft = "clamp(100px,12%,100%)";
        menubar.style.display = 'block';
    }
    menutoggle = !menutoggle;
})