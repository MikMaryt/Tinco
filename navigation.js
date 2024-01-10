const scrollshops = document.getElementsByClassName('categoryshop');

const TOTALTIME = 500;

let totaldistance,containerwidth,maxwid,animframe;

const scrollprogress = new Map();
const intervalsmap = new Map();

function quadratic_ease_out(t,d,s,tt) {
    const startoffset = 1
    const k = (d**2)/tt
    const offset2 = Math.sqrt(k*startoffset)
    const k2 = ((d+offset2)**2)/(tt+startoffset)
    return Math.sqrt(k2*(t+startoffset)) - offset2 + s;
}

function cubic_ease_out(t,d,s,tt) {
    const k = (d*d*d)/tt;
    return Math.pow(t*k,1/3) + s;
}

function cubic_ease_in_out(t,d,s,tt) {
    d/=2
    tt/=2
    const k = (d**3)/tt;
    let a = (t-tt)*k;

    if (a>0) return Math.pow(a,1/3) + d+s;
    return -Math.pow(-a,1/3) + d+s;
}

function circular_ease_out(t,d,s,tt) {
    const k = d/tt
    t-= tt
    return k * Math.sqrt((tt*tt)-(t*t)) + s;
}

const ease = quadratic_ease_out


function slide_animation(shop,right) {
    cancelAnimationFrame(animframe);
    const startingd = scrollprogress.get(shop);
    let shopprog = startingd;
    const startTime = performance.now();
    let directionk = 1;
    if (right) {
        if (shopprog >= maxwid) return;

    } else {
        if (shopprog <= 0) return;
        directionk = -1;
    }
    const container = shop.querySelector('.itemselection-container');
    const contents = container.querySelector('.itemselection-items');

    animframe = requestAnimationFrame(function anim(t) {
        let deltaTime = t - startTime;
        console.log(deltaTime);
        if (deltaTime < 0) deltaTime = 0;

        shopprog = directionk * ease(deltaTime,totaldistance,directionk * startingd,TOTALTIME);
        scrollprogress.set(shop,shopprog);
        container.scrollLeft = shopprog;

        if (deltaTime < TOTALTIME && ((right && shopprog < maxwid) || (!right && shopprog>0))) {
            animframe = requestAnimationFrame(anim);
        } else if (shopprog < 0) {
            scrollprogress.set(shop,0);
            shopprog = 0;
        } else scrollprogress.set(shop,shopprog);
    });
    scrollprogress.set(shop,shopprog);
}


for (const shop of scrollshops) {
    scrollprogress.set(shop,0);
    intervalsmap.set(shop,new Array());
    
    shop.querySelector('.scrollleft').addEventListener('click', () => {slide_animation(shop,false);});

    shop.querySelector('.scrollright').addEventListener('click', () => {slide_animation(shop,true);});
}

const scrollwheel = function(e) {
    let shop = e.target;
    const delta = e.deltaY;

    while (shop.className !== 'categoryshop') shop = shop.parentElement;
    e.preventDefault();
    
    if (delta > 50) slide_animation(shop,true);
    else if (delta < -50) slide_animation(shop,false)
}

const resizeevent = function() {
    containerwidth = document.querySelector('.itemselection-container').clientWidth;;
    maxwid = document.querySelector('.itemselection-items').clientWidth - containerwidth;
    totaldistance = parseInt(containerwidth * 0.6);

    const w = window.innerWidth;
    if (w < 800) {
        for (const shop of scrollshops) {
            shop.addEventListener('wheel', scrollwheel);
        }
    } else {
        for (const shop of scrollshops) {
            shop.removeEventListener('wheel', scrollwheel);
        }
    }
}

resizeevent();
window.addEventListener('resize', resizeevent);