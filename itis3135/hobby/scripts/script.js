document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    // Hide all sections initially
    sections.forEach((section) => {
        section.style.display = 'none';
    });

    // Show the "what" section by default
    document.getElementById('what').style.display = 'block';

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor jump
            const targetSectionId = link.getAttribute('href').substring(1);

            sections.forEach((section) => {
                section.style.display = section.id === targetSectionId ? 'block' : 'none';
            });
        });
    });
});
