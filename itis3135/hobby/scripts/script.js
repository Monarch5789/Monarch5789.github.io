document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    // Hide all sections initially
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the "home" section by default
    document.getElementById('home').style.display = 'block';

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor jump
            const targetSectionId = link.getAttribute('href').substring(1);

            sections.forEach(section => {
                if (section.id === targetSectionId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});
