//button
  document.addEventListener('DOMContentLoaded', function () {
    const groups = document.querySelectorAll('.gallery-group');
    let currentGroup = 1;

    // Hide all groups except the first
    groups.forEach((group, index) => {
      if (index !== 0) {
        group.classList.add('d-none');
      }
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');

    loadMoreBtn.addEventListener('click', function () {
      if (currentGroup < groups.length) {
        const nextGroup = groups[currentGroup];
        nextGroup.classList.remove('d-none');

        // Animate each gallery card
        nextGroup.querySelectorAll('.gallery-card').forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('fade-in');
          }, i * 100);
        });

        // Scroll to the gallery section smoothly
        document.querySelector('.card-title').scrollIntoView({ behavior: 'smooth' });

        currentGroup++;

        if (currentGroup >= groups.length) {
          loadMoreBtn.style.display = 'none';
        }
      }
    });
  });

