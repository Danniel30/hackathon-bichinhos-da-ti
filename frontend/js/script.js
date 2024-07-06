document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelector('.slides');
    const slide = document.querySelectorAll('.slide');
    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');
    let currentIndex = 0;

    function showSlide(index) {
        if (index >= slide.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slide.length - 1;
        } else {
            currentIndex = index;
        }
        const offset = -currentIndex * 100;
        slides.style.transform = `translateX(${offset}%)`;
    }

    next.addEventListener('click', function () {
        showSlide(currentIndex + 1);
    });

    prev.addEventListener('click', function () {
        showSlide(currentIndex - 1);
    });

});