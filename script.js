// Smooth scroll
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    this.reset();
});

const cards = document.querySelectorAll('.service-card');

let flippedCard = null;

cards.forEach(card => {
  card.addEventListener('click', () => {
    if (flippedCard && flippedCard !== card) {
      // Unflip the previously flipped card
      flippedCard.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
    }

    const cardInner = card.querySelector('.card-inner');

    if (flippedCard === card) {
      // If clicking the same card, unflip it
      cardInner.style.transform = 'rotateY(0deg)';
      flippedCard = null;
    } else {
      // Flip the clicked card
      cardInner.style.transform = 'rotateY(180deg)';
      flippedCard = card;
    }
  });
});