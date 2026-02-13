const express = require('express');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const ReadingProgress = require('../models/ReadingProgress');
const BorrowHistory = require('../models/BorrowHistory');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// Mock book data for demo purposes
const mockBooks = [
  // Epic Literature
  {
    bookId: 'EL001',
    title: 'Mahabharata',
    author: 'Vyasa',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: -400,
    isbn: '978-8121500417',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 1200,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.8,
    totalReviews: 245,
    availableCopies: 5,
    totalCopies: 8,
    price: 25.99,
    description: 'The great Indian epic that tells the story of the Kaurava and Pandava princes.',
    keywords: ['epic', 'mythology', 'war', 'dharma'],
    coverImage: '/covers/mahabharata.jpg',
    addedDate: new Date('2024-01-01'),
    totalViews: 1250,
    totalDownloads: 89
  },
  {
    bookId: 'EL002',
    title: 'Ramayana',
    author: 'Valmiki',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: -500,
    isbn: '978-0140447441',
    publisher: 'Penguin Classics',
    edition: '2nd',
    pages: 800,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.7,
    totalReviews: 198,
    availableCopies: 3,
    totalCopies: 6,
    price: 19.99,
    description: 'The ancient Indian epic poem that follows Prince Rama\'s quest.',
    keywords: ['epic', 'mythology', 'adventure', 'virtue'],
    coverImage: '/covers/ramayana.jpg',
    addedDate: new Date('2024-01-02'),
    totalViews: 1100,
    totalDownloads: 76
  },
  {
    bookId: 'EL003',
    title: 'Iliad',
    author: 'Homer',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Ancient',
    language: 'Greek',
    publicationYear: -750,
    isbn: '978-0140275360',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 688,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.6,
    totalReviews: 312,
    availableCopies: 4,
    totalCopies: 7,
    price: 16.99,
    description: 'The ancient Greek epic poem about the Trojan War.',
    keywords: ['epic', 'war', 'heroes', 'mythology'],
    coverImage: '/covers/iliad.jpg',
    addedDate: new Date('2024-01-03'),
    totalViews: 950,
    totalDownloads: 65
  },
  {
    bookId: 'EL004',
    title: 'Odyssey',
    author: 'Homer',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Ancient',
    language: 'Greek',
    publicationYear: -700,
    isbn: '978-0140268867',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 541,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.5,
    totalReviews: 287,
    availableCopies: 2,
    totalCopies: 5,
    price: 15.99,
    description: 'The epic tale of Odysseus\' journey home after the Trojan War.',
    keywords: ['epic', 'adventure', 'journey', 'mythology'],
    coverImage: '/covers/odyssey.jpg',
    addedDate: new Date('2024-01-04'),
    totalViews: 880,
    totalDownloads: 58
  },
  {
    bookId: 'EL005',
    title: 'Divine Comedy',
    author: 'Dante Alighieri',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Medieval',
    language: 'Italian',
    publicationYear: 1320,
    isbn: '978-0140448950',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 798,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.4,
    totalReviews: 156,
    availableCopies: 3,
    totalCopies: 6,
    price: 18.99,
    description: 'Dante\'s journey through Hell, Purgatory, and Paradise.',
    keywords: ['epic', 'religion', 'journey', 'poetry'],
    coverImage: '/covers/divine-comedy.jpg',
    addedDate: new Date('2024-01-05'),
    totalViews: 720,
    totalDownloads: 42
  },
  {
    bookId: 'EL006',
    title: 'Paradise Lost',
    author: 'John Milton',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Modern',
    language: 'English',
    publicationYear: 1667,
    isbn: '978-0140424398',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 512,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.3,
    totalReviews: 134,
    availableCopies: 1,
    totalCopies: 4,
    price: 14.99,
    description: 'Milton\'s epic poem about the fall of Satan and Adam and Eve.',
    keywords: ['epic', 'religion', 'fall', 'poetry'],
    coverImage: '/covers/paradise-lost.jpg',
    addedDate: new Date('2024-01-06'),
    totalViews: 650,
    totalDownloads: 38
  },
  {
    bookId: 'EL007',
    title: 'Beowulf',
    author: 'Anonymous',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Medieval',
    language: 'Old English',
    publicationYear: 700,
    isbn: '978-0393960101',
    publisher: 'W.W. Norton & Company',
    edition: '1st',
    pages: 256,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.2,
    totalReviews: 98,
    availableCopies: 2,
    totalCopies: 5,
    price: 12.99,
    description: 'The Old English epic poem about the hero Beowulf.',
    keywords: ['epic', 'hero', 'monsters', 'anglo-saxon'],
    coverImage: '/covers/beowulf.jpg',
    addedDate: new Date('2024-01-07'),
    totalViews: 580,
    totalDownloads: 35
  },
  {
    bookId: 'EL008',
    title: 'Shahnameh',
    author: 'Ferdowsi',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1010,
    isbn: '978-0140449987',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 960,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.6,
    totalReviews: 87,
    availableCopies: 1,
    totalCopies: 3,
    price: 22.99,
    description: 'The Persian Book of Kings, an epic poem about Persian history.',
    keywords: ['epic', 'kings', 'persian', 'history'],
    coverImage: '/covers/shahnameh.jpg',
    addedDate: new Date('2024-01-08'),
    totalViews: 520,
    totalDownloads: 31
  },
  {
    bookId: 'EL009',
    title: 'Epic of Gilgamesh',
    author: 'Anonymous',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Ancient',
    language: 'Akkadian',
    publicationYear: -2100,
    isbn: '978-0140449192',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 128,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.1,
    totalReviews: 76,
    availableCopies: 3,
    totalCopies: 6,
    price: 11.99,
    description: 'The ancient Mesopotamian epic about Gilgamesh and his quest for immortality.',
    keywords: ['epic', 'mesopotamia', 'immortality', 'flood'],
    coverImage: '/covers/gilgamesh.jpg',
    addedDate: new Date('2024-01-09'),
    totalViews: 480,
    totalDownloads: 28
  },
  {
    bookId: 'EL010',
    title: 'Aeneid',
    author: 'Virgil',
    category: 'Epic Literature',
    department: 'Literature',
    era: 'Ancient',
    language: 'Latin',
    publicationYear: -19,
    isbn: '978-0140449321',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 442,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.0,
    totalReviews: 92,
    availableCopies: 2,
    totalCopies: 4,
    price: 13.99,
    description: 'Virgil\'s epic poem about Aeneas\' journey from Troy to Italy.',
    keywords: ['epic', 'rome', 'founding', 'journey'],
    coverImage: '/covers/aeneid.jpg',
    addedDate: new Date('2024-01-10'),
    totalViews: 450,
    totalDownloads: 25
  },

  // Ancient India
  {
    bookId: 'AI001',
    title: 'Arthashastra',
    author: 'Kautilya',
    category: 'Ancient India',
    department: 'History',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: -300,
    isbn: '978-0140446030',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 720,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.5,
    totalReviews: 167,
    availableCopies: 4,
    totalCopies: 7,
    price: 21.99,
    description: 'Ancient Indian treatise on statecraft, economic policy, and military strategy.',
    keywords: ['politics', 'economics', 'strategy', 'ancient india'],
    coverImage: '/covers/arthashastra.jpg',
    addedDate: new Date('2024-01-11'),
    totalViews: 890,
    totalDownloads: 52
  },
  {
    bookId: 'AI002',
    title: 'Indica',
    author: 'Megasthenes',
    category: 'Ancient India',
    department: 'History',
    era: 'Ancient',
    language: 'Greek',
    publicationYear: -300,
    isbn: '978-8121500418',
    publisher: 'Motilal Banarsidass',
    edition: '1st',
    pages: 180,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.2,
    totalReviews: 89,
    availableCopies: 2,
    totalCopies: 5,
    price: 15.99,
    description: 'Ancient Greek account of India by the ambassador Megasthenes.',
    keywords: ['ancient india', 'greek', 'history', 'geography'],
    coverImage: '/covers/indica.jpg',
    addedDate: new Date('2024-01-12'),
    totalViews: 720,
    totalDownloads: 38
  },
  {
    bookId: 'AI003',
    title: 'Rigveda',
    author: 'Various Rishis',
    category: 'Ancient India',
    department: 'Religion',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: -1500,
    isbn: '978-0140449895',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 352,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.4,
    totalReviews: 134,
    availableCopies: 3,
    totalCopies: 6,
    price: 18.99,
    description: 'The oldest Hindu scripture containing hymns, prayers, and rituals.',
    keywords: ['veda', 'hinduism', 'hymns', 'ancient india'],
    coverImage: '/covers/rigveda.jpg',
    addedDate: new Date('2024-01-13'),
    totalViews: 950,
    totalDownloads: 67
  },
  {
    bookId: 'AI004',
    title: 'Upanishads',
    author: 'Various',
    category: 'Ancient India',
    department: 'Philosophy',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: -800,
    isbn: '978-0140441639',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 448,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.6,
    totalReviews: 198,
    availableCopies: 5,
    totalCopies: 8,
    price: 19.99,
    description: 'Ancient Indian philosophical texts exploring the nature of reality.',
    keywords: ['philosophy', 'spirituality', 'brahman', 'ancient india'],
    coverImage: '/covers/upanishads.jpg',
    addedDate: new Date('2024-01-14'),
    totalViews: 1100,
    totalDownloads: 89
  },
  {
    bookId: 'AI005',
    title: 'Buddhacharita',
    author: 'Ashvaghosha',
    category: 'Ancient India',
    department: 'Religion',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: 100,
    isbn: '978-8121500419',
    publisher: 'Motilal Banarsidass',
    edition: '1st',
    pages: 320,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.3,
    totalReviews: 76,
    availableCopies: 2,
    totalCopies: 4,
    price: 16.99,
    description: 'Epic poem about the life of Buddha written in Sanskrit.',
    keywords: ['buddhism', 'epic', 'buddha', 'ancient india'],
    coverImage: '/covers/buddhacharita.jpg',
    addedDate: new Date('2024-01-15'),
    totalViews: 680,
    totalDownloads: 34
  },
  {
    bookId: 'AI006',
    title: 'Manusmriti',
    author: 'Manu',
    category: 'Ancient India',
    department: 'Law',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: -200,
    isbn: '978-8121500420',
    publisher: 'Motilal Banarsidass',
    edition: '1st',
    pages: 576,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.1,
    totalReviews: 92,
    availableCopies: 1,
    totalCopies: 3,
    price: 20.99,
    description: 'Ancient Hindu law book containing social and religious duties.',
    keywords: ['law', 'hinduism', 'dharma', 'ancient india'],
    coverImage: '/covers/manusmriti.jpg',
    addedDate: new Date('2024-01-16'),
    totalViews: 590,
    totalDownloads: 28
  },
  {
    bookId: 'AI007',
    title: 'Sangam Literature',
    author: 'Various Poets',
    category: 'Ancient India',
    department: 'Literature',
    era: 'Ancient',
    language: 'Tamil',
    publicationYear: -300,
    isbn: '978-8121500421',
    publisher: 'Sahitya Akademi',
    edition: '1st',
    pages: 480,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.2,
    totalReviews: 65,
    availableCopies: 3,
    totalCopies: 6,
    price: 17.99,
    description: 'Ancient Tamil poetry from the Sangam period of South India.',
    keywords: ['tamil', 'poetry', 'south india', 'ancient india'],
    coverImage: '/covers/sangam.jpg',
    addedDate: new Date('2024-01-17'),
    totalViews: 720,
    totalDownloads: 41
  },
  {
    bookId: 'AI008',
    title: 'Mahavamsa',
    author: 'Mahavamsa',
    category: 'Ancient India',
    department: 'History',
    era: 'Ancient',
    language: 'Pali',
    publicationYear: 500,
    isbn: '978-9555701654',
    publisher: 'Department of Cultural Affairs',
    edition: '1st',
    pages: 352,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.0,
    totalReviews: 54,
    availableCopies: 2,
    totalCopies: 5,
    price: 14.99,
    description: 'Ancient chronicle of Sri Lankan history written in Pali.',
    keywords: ['sri lanka', 'chronicle', 'pali', 'ancient india'],
    coverImage: '/covers/mahavamsa.jpg',
    addedDate: new Date('2024-01-18'),
    totalViews: 480,
    totalDownloads: 22
  },
  {
    bookId: 'AI009',
    title: 'Harshacharita',
    author: 'Banabhatta',
    category: 'Ancient India',
    department: 'Literature',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: 625,
    isbn: '978-8121500422',
    publisher: 'Motilal Banarsidass',
    edition: '1st',
    pages: 288,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.1,
    totalReviews: 43,
    availableCopies: 1,
    totalCopies: 4,
    price: 15.99,
    description: 'Biography of King Harsha written in Sanskrit by Banabhatta.',
    keywords: ['biography', 'king harsha', 'sanskrit', 'ancient india'],
    coverImage: '/covers/harshacharita.jpg',
    addedDate: new Date('2024-01-19'),
    totalViews: 420,
    totalDownloads: 19
  },
  {
    bookId: 'AI010',
    title: 'Mudrarakshasa',
    author: 'Vishakhadatta',
    category: 'Ancient India',
    department: 'Literature',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: 400,
    isbn: '978-8121500423',
    publisher: 'Motilal Banarsidass',
    edition: '1st',
    pages: 192,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.3,
    totalReviews: 67,
    availableCopies: 3,
    totalCopies: 6,
    price: 13.99,
    description: 'Ancient Sanskrit play about political intrigue and espionage.',
    keywords: ['drama', 'politics', 'espionage', 'ancient india'],
    coverImage: '/covers/mudrarakshasa.jpg',
    addedDate: new Date('2024-01-20'),
    totalViews: 650,
    totalDownloads: 35
  },

  // Medieval India
  {
    bookId: 'MI001',
    title: 'Akbarnama',
    author: 'Abu\'l-Fazl ibn Mubarak',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1590,
    isbn: '978-8121500424',
    publisher: 'Sahitya Akademi',
    edition: '1st',
    pages: 1152,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.4,
    totalReviews: 123,
    availableCopies: 2,
    totalCopies: 5,
    price: 28.99,
    description: 'Official biography of Mughal Emperor Akbar written by his court historian.',
    keywords: ['mughal', 'akbar', 'biography', 'medieval india'],
    coverImage: '/covers/akbarnama.jpg',
    addedDate: new Date('2024-01-21'),
    totalViews: 780,
    totalDownloads: 45
  },
  {
    bookId: 'MI002',
    title: 'Baburnama',
    author: 'Babur',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1530,
    isbn: '978-8121500425',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 416,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.5,
    totalReviews: 156,
    availableCopies: 4,
    totalCopies: 7,
    price: 19.99,
    description: 'Autobiography of Mughal Emperor Babur, founder of the Mughal dynasty.',
    keywords: ['mughal', 'babur', 'autobiography', 'medieval india'],
    coverImage: '/covers/baburnama.jpg',
    addedDate: new Date('2024-01-22'),
    totalViews: 920,
    totalDownloads: 62
  },
  {
    bookId: 'MI003',
    title: 'Ain-i-Akbari',
    author: 'Abu\'l-Fazl ibn Mubarak',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1590,
    isbn: '978-8121500426',
    publisher: 'National Book Trust',
    edition: '1st',
    pages: 864,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.3,
    totalReviews: 98,
    availableCopies: 1,
    totalCopies: 4,
    price: 24.99,
    description: 'Detailed administrative manual of Akbar\'s empire and its governance.',
    keywords: ['mughal', 'administration', 'akbar', 'medieval india'],
    coverImage: '/covers/ain-i-akbari.jpg',
    addedDate: new Date('2024-01-23'),
    totalViews: 650,
    totalDownloads: 38
  },
  {
    bookId: 'MI004',
    title: 'Rajatarangini',
    author: 'Kalhana',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Sanskrit',
    publicationYear: 1148,
    isbn: '978-8121500427',
    publisher: 'Sahitya Akademi',
    edition: '1st',
    pages: 576,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.2,
    totalReviews: 87,
    availableCopies: 3,
    totalCopies: 6,
    price: 18.99,
    description: 'Historical chronicle of Kashmir written in Sanskrit by Kalhana.',
    keywords: ['kashmir', 'chronicle', 'sanskrit', 'medieval india'],
    coverImage: '/covers/rajatarangini.jpg',
    addedDate: new Date('2024-01-24'),
    totalViews: 580,
    totalDownloads: 32
  },
  {
    bookId: 'MI005',
    title: 'Tughlaq Nama',
    author: 'Amir Khusrau',
    category: 'Medieval India',
    department: 'Literature',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1310,
    isbn: '978-8121500428',
    publisher: 'Sahitya Akademi',
    edition: '1st',
    pages: 224,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.1,
    totalReviews: 65,
    availableCopies: 2,
    totalCopies: 5,
    price: 15.99,
    description: 'Poetic work about the Delhi Sultanate ruler Muhammad Tughlaq.',
    keywords: ['delhi sultanate', 'poetry', 'persian', 'medieval india'],
    coverImage: '/covers/tughlaq-nama.jpg',
    addedDate: new Date('2024-01-25'),
    totalViews: 490,
    totalDownloads: 26
  },
  {
    bookId: 'MI006',
    title: 'Tarikh-i-Firoz Shahi',
    author: 'Ziauddin Barani',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1357,
    isbn: '978-8121500429',
    publisher: 'Sahitya Akademi',
    edition: '1st',
    pages: 352,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.0,
    totalReviews: 54,
    availableCopies: 1,
    totalCopies: 3,
    price: 17.99,
    description: 'Historical account of the Delhi Sultanate during Firoz Shah\'s reign.',
    keywords: ['delhi sultanate', 'firoz shah', 'persian', 'medieval india'],
    coverImage: '/covers/tarikh-firoz-shahi.jpg',
    addedDate: new Date('2024-01-26'),
    totalViews: 420,
    totalDownloads: 21
  },
  {
    bookId: 'MI007',
    title: 'Padmavat',
    author: 'Malik Muhammad Jayasi',
    category: 'Medieval India',
    department: 'Literature',
    era: 'Medieval',
    language: 'Awadhi',
    publicationYear: 1540,
    isbn: '978-8121500430',
    publisher: 'Sahitya Akademi',
    edition: '1st',
    pages: 288,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.3,
    totalReviews: 89,
    availableCopies: 3,
    totalCopies: 6,
    price: 14.99,
    description: 'Epic poem about the legendary queen Padmini of Chittor.',
    keywords: ['epic', 'padmini', 'chittor', 'medieval india'],
    coverImage: '/covers/padmavat.jpg',
    addedDate: new Date('2024-01-27'),
    totalViews: 720,
    totalDownloads: 43
  },
  {
    bookId: 'MI008',
    title: 'Humayun Nama',
    author: 'Gulbadan Begum',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1587,
    isbn: '978-8121500431',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 256,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.2,
    totalReviews: 76,
    availableCopies: 2,
    totalCopies: 5,
    price: 16.99,
    description: 'Memoirs of Mughal Emperor Humayun written by his sister Gulbadan Begum.',
    keywords: ['mughal', 'humayun', 'memoirs', 'medieval india'],
    coverImage: '/covers/humayun-nama.jpg',
    addedDate: new Date('2024-01-28'),
    totalViews: 580,
    totalDownloads: 31
  },
  {
    bookId: 'MI009',
    title: 'Chach Nama',
    author: 'Anonymous',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1216,
    isbn: '978-8121500432',
    publisher: 'National Book Trust',
    edition: '1st',
    pages: 192,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.1,
    totalReviews: 43,
    availableCopies: 1,
    totalCopies: 4,
    price: 13.99,
    description: 'Historical account of the Arab conquest of Sindh in 8th century.',
    keywords: ['arab conquest', 'sindh', 'persian', 'medieval india'],
    coverImage: '/covers/chach-nama.jpg',
    addedDate: new Date('2024-01-29'),
    totalViews: 380,
    totalDownloads: 18
  },
  {
    bookId: 'MI010',
    title: 'Futuhat-i-Alamgiri',
    author: 'Ishwardas Nagar',
    category: 'Medieval India',
    department: 'History',
    era: 'Medieval',
    language: 'Persian',
    publicationYear: 1710,
    isbn: '978-8121500433',
    publisher: 'Sahitya Akademi',
    edition: '1st',
    pages: 480,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.0,
    totalReviews: 52,
    availableCopies: 2,
    totalCopies: 5,
    price: 19.99,
    description: 'Historical account of Mughal Emperor Aurangzeb\'s conquests.',
    keywords: ['mughal', 'aurangzeb', 'conquests', 'medieval india'],
    coverImage: '/covers/futuhat-alamgiri.jpg',
    addedDate: new Date('2024-01-30'),
    totalViews: 520,
    totalDownloads: 27
  },

  // Freedom Struggle
  {
    bookId: 'FS001',
    title: 'Discovery of India',
    author: 'Jawaharlal Nehru',
    category: 'Freedom Struggle',
    department: 'History',
    era: 'Modern',
    language: 'English',
    publicationYear: 1946,
    isbn: '978-0143031031',
    publisher: 'Oxford University Press',
    edition: '1st',
    pages: 656,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.7,
    totalReviews: 312,
    availableCopies: 8,
    totalCopies: 12,
    price: 22.99,
    description: 'Nehru\'s reflections on India\'s history and culture written during imprisonment.',
    keywords: ['freedom struggle', 'nehru', 'india', 'history'],
    coverImage: '/covers/discovery-india.jpg',
    addedDate: new Date('2024-01-31'),
    totalViews: 1450,
    totalDownloads: 98
  },
  {
    bookId: 'FS002',
    title: 'My Experiments with Truth',
    author: 'Mahatma Gandhi',
    category: 'Freedom Struggle',
    department: 'Biography',
    era: 'Modern',
    language: 'English',
    publicationYear: 1927,
    isbn: '978-0143039662',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 480,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.8,
    totalReviews: 456,
    availableCopies: 10,
    totalCopies: 15,
    price: 18.99,
    description: 'Gandhi\'s autobiography detailing his life and philosophy of non-violence.',
    keywords: ['gandhi', 'autobiography', 'non-violence', 'freedom struggle'],
    coverImage: '/covers/my-experiments-truth.jpg',
    addedDate: new Date('2024-02-01'),
    totalViews: 1680,
    totalDownloads: 124
  },
  {
    bookId: 'FS003',
    title: 'India Wins Freedom',
    author: 'Maulana Abul Kalam Azad',
    category: 'Freedom Struggle',
    department: 'History',
    era: 'Modern',
    language: 'English',
    publicationYear: 1959,
    isbn: '978-8122200878',
    publisher: 'Orient Longman',
    edition: '1st',
    pages: 288,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.5,
    totalReviews: 198,
    availableCopies: 6,
    totalCopies: 10,
    price: 16.99,
    description: 'Azad\'s account of India\'s struggle for independence from 1935-1947.',
    keywords: ['azad', 'partition', 'freedom struggle', 'history'],
    coverImage: '/covers/india-wins-freedom.jpg',
    addedDate: new Date('2024-02-02'),
    totalViews: 1120,
    totalDownloads: 76
  },
  {
    bookId: 'FS004',
    title: 'Anandamath',
    author: 'Bankim Chandra Chattopadhyay',
    category: 'Freedom Struggle',
    department: 'Literature',
    era: 'Modern',
    language: 'Bengali',
    publicationYear: 1882,
    isbn: '978-0144000641',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 336,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.3,
    totalReviews: 134,
    availableCopies: 4,
    totalCopies: 8,
    price: 14.99,
    description: 'Bengali novel that inspired the concept of Vande Mataram.',
    keywords: ['bengali', 'novel', 'vande mataram', 'freedom struggle'],
    coverImage: '/covers/anandamath.jpg',
    addedDate: new Date('2024-02-03'),
    totalViews: 890,
    totalDownloads: 54
  },
  {
    bookId: 'FS005',
    title: 'Gita Rahasya',
    author: 'Bal Gangadhar Tilak',
    category: 'Freedom Struggle',
    department: 'Philosophy',
    era: 'Modern',
    language: 'Marathi',
    publicationYear: 1915,
    isbn: '978-8121500434',
    publisher: 'Kesari Prakashan',
    edition: '1st',
    pages: 512,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.4,
    totalReviews: 87,
    availableCopies: 3,
    totalCopies: 6,
    price: 20.99,
    description: 'Tilak\'s interpretation of the Bhagavad Gita for national awakening.',
    keywords: ['gita', 'tilak', 'philosophy', 'freedom struggle'],
    coverImage: '/covers/gita-rahasya.jpg',
    addedDate: new Date('2024-02-04'),
    totalViews: 780,
    totalDownloads: 45
  },
  {
    bookId: 'IP001',
    title: 'Bhagavad Gita',
    author: 'Krishna',
    category: 'Indian Philosophy',
    department: 'Philosophy',
    era: 'Ancient',
    language: 'Sanskrit',
    publicationYear: -500,
    isbn: '978-0140447903',
    publisher: 'Penguin Classics',
    edition: '1st',
    pages: 352,
    format: 'Physical',
    difficultyLevel: 'Advanced',
    rating: 4.9,
    totalReviews: 567,
    availableCopies: 12,
    totalCopies: 18,
    price: 16.99,
    description: 'The sacred Hindu scripture containing the teachings of Krishna to Arjuna.',
    keywords: ['bhagavad gita', 'krishna', 'dharma', 'indian philosophy'],
    coverImage: '/covers/bhagavad-gita.jpg',
    addedDate: new Date('2024-02-05'),
    totalViews: 2100,
    totalDownloads: 156
  },
  {
    bookId: 'WH001',
    title: 'A History of the World',
    author: 'Andrew Marr',
    category: 'World History',
    department: 'History',
    era: 'Modern',
    language: 'English',
    publicationYear: 2012,
    isbn: '978-0330510956',
    publisher: 'Pan Macmillan',
    edition: '1st',
    pages: 640,
    format: 'Physical',
    difficultyLevel: 'Intermediate',
    rating: 4.2,
    totalReviews: 234,
    availableCopies: 7,
    totalCopies: 12,
    price: 24.99,
    description: 'A comprehensive history of the world from ancient times to the present.',
    keywords: ['world history', 'civilization', 'global', 'timeline'],
    coverImage: '/covers/world-history.jpg',
    addedDate: new Date('2024-02-06'),
    totalViews: 1450,
    totalDownloads: 98
  }
];

// Get books with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search,
      department,
      category,
      era,
      language,
      rating,
      availability,
      format,
      difficultyLevel,
      sortBy = 'title',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Other filters
    if (department) query.department = department;
    if (category) query.category = category;
    if (era) query.era = era;
    if (language) query.language = language;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (availability === 'available') query.availableCopies = { $gt: 0 };
    if (format) query.format = format;
    if (difficultyLevel) query.difficultyLevel = difficultyLevel;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const books = await Book.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book by ID
router.get('/:bookId', async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.bookId });
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Get related books (same category)
    const relatedBooks = await Book.find({
      category: book.category,
      bookId: { $ne: book.bookId }
    }).limit(5);

    // Increment view count
    await Book.findByIdAndUpdate(book._id, { $inc: { totalViews: 1 } });

    res.json({ book, relatedBooks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new book (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book (Admin only)
router.put('/:bookId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { bookId: req.params.bookId },
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book (Admin only)
router.delete('/:bookId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ bookId: req.params.bookId });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reading progress for user
router.get('/:bookId/progress', verifyToken, async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({
      userId: req.user.id,
      bookId: req.params.bookId
    });
    res.json(progress || { progressPercentage: 0, lastReadPage: 0, totalReadingTime: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reading progress
router.post('/:bookId/progress', verifyToken, async (req, res) => {
  try {
    const { progressPercentage, lastReadPage, totalReadingTime } = req.body;
    const progress = await ReadingProgress.findOneAndUpdate(
      { userId: req.user.id, bookId: req.params.bookId },
      {
        progressPercentage,
        lastReadPage,
        totalReadingTime,
        lastReadDate: new Date(),
        completed: progressPercentage >= 100
      },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Borrow book
router.post('/:bookId/borrow', verifyToken, async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.bookId });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ error: 'Book not available' });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

    const borrowRecord = new BorrowHistory({
      userId: req.user.id,
      bookId: req.params.bookId,
      issueDate: new Date(),
      dueDate
    });

    await borrowRecord.save();
    await Book.findByIdAndUpdate(book._id, { $inc: { availableCopies: -1 } });

    res.json({ message: 'Book borrowed successfully', dueDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Return book
router.post('/:bookId/return', verifyToken, async (req, res) => {
  try {
    const borrowRecord = await BorrowHistory.findOneAndUpdate(
      { userId: req.user.id, bookId: req.params.bookId, status: 'Active' },
      { returnDate: new Date(), status: 'Returned' },
      { new: true }
    );

    if (!borrowRecord) return res.status(404).json({ error: 'Active borrow record not found' });

    await Book.findOneAndUpdate({ bookId: req.params.bookId }, { $inc: { availableCopies: 1 } });

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get borrow history for user
router.get('/borrow/history', verifyToken, async (req, res) => {
  try {
    const history = await BorrowHistory.find({ userId: req.user.id })
      .populate('bookId')
      .sort({ issueDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoints
router.get('/analytics/most-downloaded', async (req, res) => {
  try {
    const books = await Book.find().sort({ totalDownloads: -1 }).limit(10);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics/most-viewed', async (req, res) => {
  try {
    const books = await Book.find().sort({ totalViews: -1 }).limit(10);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics/trending', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const books = await Book.find({
      addedDate: { $gte: thirtyDaysAgo }
    }).sort({ totalViews: -1 }).limit(10);

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
