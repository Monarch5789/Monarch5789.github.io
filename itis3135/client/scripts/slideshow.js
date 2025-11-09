// scripts/slideshow.js
document.addEventListener('DOMContentLoaded', function () {
  var slideIndex = 1;

  function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName('mySlides');
    var dots = document.getElementsByClassName('dot');

    if (!slides.length) return; // nothing to do if there are no slides

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
      // remove " active" (leading space to match how it's added below)
      dots[i].className = dots[i].className.replace(' active', '');
    }

    slides[slideIndex - 1].style.display = 'block';
    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].className += ' active';
    }
  }

  // Next/previous controls
  window.plusSlides = function (n) {
    showSlides(slideIndex += n);
  };

  // Thumbnail image controls
  window.currentSlide = function (n) {
    showSlides(slideIndex = n);
  };

  // initialize
  showSlides(slideIndex);
});
