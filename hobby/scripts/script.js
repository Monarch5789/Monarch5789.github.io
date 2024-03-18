document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
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

    // Show the "What" section by default
    document.getElementById('home').style.display = 'block';
});
