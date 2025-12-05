// Logo mapping utility - maps option names to their logo file paths
const logoMap = {
  // Food options
  'Momo': 'assets/momo.svg',
  'Paneer': 'assets/paneer.svg',
  'Pasta': 'assets/pasta.svg',
  'Biryani': 'assets/biryani.svg',

  // Travel options
  'Mountain': 'assets/mountain.svg',
  'Beach': 'assets/beach.svg',
  'Safari': 'assets/safari.svg',
  'Other': 'assets/other.svg',

  // Hobby options
  'Reading': 'assets/reading.svg',
  'Gaming': 'assets/gaming.svg',
  'Scrolling': 'assets/scrolling.svg',
  'YouTube': 'assets/youtube.svg',

  // Reading options
  'Fiction': 'assets/fiction.svg',
  'Mystery': 'assets/mystery.svg',
  'Comics': 'assets/comics.svg',
  'Science Books': 'assets/science-books.svg',

  // Watch options
  'Movies': 'assets/movies.svg',
  'Anime': 'assets/anime.svg',
  'Web Series': 'assets/web-series.svg',
  'Cartoons': 'assets/cartoons.svg',

  // Play options
  'Cricket': 'assets/cricket.svg',
  'Football': 'assets/football.svg',
  'Badminton': 'assets/badminton.svg',
  'Video Games': 'assets/video-games.svg',

  // Pet options
  'Dog': 'assets/dog.svg',
  'Cat': 'assets/cat.svg',
  'Rabbit': 'assets/rabbit.svg',
  'Birds': 'assets/birds.svg',

  // Wear options
  'Casuals': 'assets/casuals.svg',
  'Formals': 'assets/formals.svg',
  'Sportswear': 'assets/sportswear.svg',
  'Traditional': 'assets/traditional.svg',

  // Drink options
  'Coffee': 'assets/coffee.svg',
  'Tea': 'assets/tea.svg',
  'Juice': 'assets/juice.svg',
  'Soft Drinks': 'assets/soft-drinks.svg',

  // Drive options
  'Car': 'assets/car.svg',
  'Bike': 'assets/bike.svg',
  'Bicycle': 'assets/bicycle.svg',
  'Scooter': 'assets/scooter.svg'
};

// Function to get logo path for an option
function getLogoPath(optionName) {
  return logoMap[optionName] || 'assets/other.svg'; // Default to 'other' if not found
}

