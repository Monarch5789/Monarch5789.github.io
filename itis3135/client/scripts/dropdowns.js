document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach((dropdown) => {
    const header = dropdown.querySelector('.dropdown-header');
    const content = dropdown.querySelector('.dropdown-content');
    const arrow = dropdown.querySelector('.arrow');

    header.addEventListener('click', () => {
      // Close all other dropdowns
      dropdowns.forEach((other) => {
        if (other !== dropdown) {
          other.querySelector('.dropdown-content').classList.remove('dropdown-content-open');
          other.querySelector('.arrow').classList.remove('arrow-rotated');
        }
      });

      // Toggle this one
      content.classList.toggle('dropdown-content-open');
      arrow.classList.toggle('arrow-rotated');
    });
  });
});
