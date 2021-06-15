'use strict';

const welcomeSection = document.querySelector('.custom-container');
const navbar = document.querySelector('.navbar');

// Makes navbar sticky when user scrolls down to features section using Observer API
const stickyNavbar = function(entries){
    const [entry] = entries;
    if(!entry.isIntersecting){
        navbar.classList.add('sticky-top');
        navbar.style.backgroundColor = "rgba(255,255,255, 0.7)";
    }else{
        navbar.classList.remove('sticky-top');
        navbar.style.backgroundColor = "inherit";
    }

};

const navbarHeight = navbar.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNavbar, {root: null, threshold: 0, rootMargin: `-${navbarHeight}px`});
headerObserver.observe(welcomeSection);

// Generates fade in animation when user scrolls to section using Observer API
const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer){
    const [entry] = entries;
    if(!entry.isIntersecting) return;

    entry.target.classList.remove('section-hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {root: null, threshold: 0.15});

allSections.forEach(function(section){
    sectionObserver.observe(section);
    section.classList.add('section-hidden');
})


// Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer){
    const [entry] = entries;
    if(!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    // On slow loading imamge would lose blur before lazy image would be replaced,
    // thats why event listener is attached 
    entry.target.addEventListener('load', function(){
        entry.target.classList.remove('featured-image');
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {root: null, threshold: 0});
imgTarget.forEach(img => imgObserver.observe(img));

const tabs = document.querySelectorAll('.tab');
const tabsContainer = document.querySelector('.operation-buttons');
const tabsContent = document.querySelectorAll('.operation-description-container');

// Shows selected operation tab in operations section
tabsContainer.addEventListener("click", function(e){
    const clickedButton = e.target.closest('.tab');
    // Guard clause
    if(!clickedButton){
        return;
    }
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    clickedButton.classList.add('active-tab');
    tabsContent.forEach(content => content.classList.add('operations-container'));
    document.querySelector(`.operations-${clickedButton.dataset.tab}`).classList.remove('operations-container');
});

const headerFade = function(e){
    if(e.target.classList.contains('nav-link')){
        const hooveredLink = e.target;
        const linkSiblings = hooveredLink.closest('.navbar').querySelectorAll('.nav-link, .btn');
        const logo = hooveredLink.closest('.navbar').querySelector('img');
        linkSiblings.forEach(element => {
            if(element !== hooveredLink){
                element.style.opacity = this;
            }
        });
        logo.style.opacity = this;
    } 
}

// Sets lower opacity for elements in header that are not hovered 
navbar.addEventListener('mouseover', headerFade.bind(0.5));
// Brings back opacity for elements in header
navbar.addEventListener('mouseout', headerFade.bind(1));

// Slider implementation
const slider = function(){
    const slides = document.querySelectorAll('.slide');
    const buttonLeft = document.querySelector('.arrow-left');
    const buttonRight = document.querySelector('.arrow-right');
    let currentSlide = 0;
    const maxSlide = slides.length; 

    const goToSlide = function(currentSlide){
        slides.forEach((slide, index) => slide.style.transform = `translateX(${(index - currentSlide)*100}%)`);
    }

    const activateDot = function(slide){
        document.querySelectorAll('.dot').forEach((dot => dot.classList.remove('active-dot')));
        document.querySelector(`.dot[data-slide="${slide}"]`).classList.add('active-dot');
    }

    // Dots color change when slide is being changed
    const dotContainer = document.querySelector('.dots');
    const createDots = function(){
        slides.forEach((_, index) => {
            dotContainer.insertAdjacentHTML('beforeend', 
            `<button class="dot" data-slide="${index}"></button>`);
        });
    };

    const nextSlide = function(){
        if(currentSlide === maxSlide - 1){
            currentSlide = 0;
        }else{
            currentSlide++;
        }
        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    const prevSlide = function(){
        if(currentSlide === 0){
            currentSlide = maxSlide - 1;
        }else{
            currentSlide--;
        }
        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    const installSlider = function(){
        goToSlide(0);
        createDots();
        activateDot(0);
    }

    installSlider();

    buttonRight.addEventListener('click', nextSlide);
    buttonLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', function(e){
        e.key === 'ArrowLeft' && prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function(e){
        if(e.target.classList.contains('dot')){
            const {slide} = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
}

slider();