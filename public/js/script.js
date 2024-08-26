document.addEventListener('DOMContentLoaded', function() {
    const feedbackButton = document.getElementById('feedback');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeButton = document.querySelector('#feedback-modal .close');

    // Open the modal
    feedbackButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        feedbackModal.style.display = 'block';
    });

    // Close the modal
    closeButton.addEventListener('click', function() {
        feedbackModal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === feedbackModal) {
            feedbackModal.style.display = 'none';
        }
    });
});

/* Auto-Scrolling Slider */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const slideCount = document.querySelectorAll('.slide').length;
    const slideWidth = document.querySelector('.slide').offsetWidth;
    let currentSlide = 0;
    const slideInterval = 3000; // Time in milliseconds between slides

    function goToSlide(index) {
        slides.style.transform = `translateX(-${index * slideWidth}px)`;
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }

    // Auto-scroll
    setInterval(nextSlide, slideInterval);

    // Optional: Add event listeners to arrows for manual navigation
    document.querySelector('.slider-arrow--right').addEventListener('click', nextSlide);
    document.querySelector('.slider-arrow--left').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    });
});

function updateSlider() {
    // Update slide position
    const offset = -currentIndex * 100;
    slides.style.transform = `translateX(${offset}%)`;
}

