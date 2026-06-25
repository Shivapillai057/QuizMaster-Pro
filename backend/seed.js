/**
 * SEED FILE — Run this once to add sample quizzes + an admin user
 * Usage: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Quiz = require('./models/Quiz');

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-platform';

const sampleQuizzes = [
  {
    title: 'General Knowledge Basics',
    description: 'Fun facts everyone should know!',
    category: 'General Knowledge',
    difficulty: 'Easy',
    timeLimit: 30,
    questions: [
      {
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris has been the capital of France since the 10th century.',
        points: 10,
      },
      {
        question: 'How many continents are there on Earth?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
        explanation: 'Earth has 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.',
        points: 10,
      },
      {
        question: 'What color is the sky on a clear day?',
        options: ['Green', 'Blue', 'Red', 'Yellow'],
        correctAnswer: 1,
        explanation: 'The sky appears blue because of Rayleigh scattering of sunlight.',
        points: 10,
      },
      {
        question: 'Which planet is closest to the Sun?',
        options: ['Venus', 'Earth', 'Mars', 'Mercury'],
        correctAnswer: 3,
        explanation: 'Mercury is the closest planet to the Sun.',
        points: 10,
      },
      {
        question: 'What is 7 x 8?',
        options: ['54', '56', '58', '64'],
        correctAnswer: 1,
        explanation: '7 multiplied by 8 equals 56.',
        points: 10,
      },
    ],
  },
  {
    title: 'Basic Science Quiz',
    description: 'Test your science knowledge!',
    category: 'Science',
    difficulty: 'Easy',
    timeLimit: 30,
    questions: [
      {
        question: 'What gas do plants absorb from the air?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correctAnswer: 2,
        explanation: 'Plants absorb carbon dioxide (CO₂) during photosynthesis.',
        points: 10,
      },
      {
        question: 'What is the chemical symbol for water?',
        options: ['WA', 'H2O', 'HO2', 'W2O'],
        correctAnswer: 1,
        explanation: 'Water is made of 2 hydrogen atoms and 1 oxygen atom: H₂O.',
        points: 10,
      },
      {
        question: 'How many bones are in the adult human body?',
        options: ['196', '206', '216', '226'],
        correctAnswer: 1,
        explanation: 'The adult human body has 206 bones.',
        points: 10,
      },
      {
        question: 'What is the speed of light (approx)?',
        options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s'],
        correctAnswer: 0,
        explanation: 'Light travels at approximately 300,000 kilometres per second.',
        points: 10,
      },
      {
        question: 'Which organ pumps blood around the body?',
        options: ['Lungs', 'Liver', 'Brain', 'Heart'],
        correctAnswer: 3,
        explanation: 'The heart pumps blood through the circulatory system.',
        points: 10,
      },
    ],
  },
  {
    title: 'Tech & Computers',
    description: 'How much do you know about technology?',
    category: 'Technology',
    difficulty: 'Medium',
    timeLimit: 25,
    questions: [
      {
        question: 'What does "HTML" stand for?',
        options: [
          'HyperText Markup Language',
          'HighText Machine Language',
          'HyperText and links Markup Language',
          'None of these',
        ],
        correctAnswer: 0,
        explanation: 'HTML stands for HyperText Markup Language — the standard language for web pages.',
        points: 10,
      },
      {
        question: 'Which company created JavaScript?',
        options: ['Microsoft', 'Google', 'Netscape', 'Apple'],
        correctAnswer: 2,
        explanation: 'JavaScript was created by Brendan Eich at Netscape in 1995.',
        points: 10,
      },
      {
        question: 'What does "CPU" stand for?',
        options: [
          'Central Process Unit',
          'Central Processing Unit',
          'Computer Personal Unit',
          'Core Processing Unit',
        ],
        correctAnswer: 1,
        explanation: 'CPU stands for Central Processing Unit — the brain of the computer.',
        points: 10,
      },
      {
        question: 'Which one is NOT a programming language?',
        options: ['Python', 'Java', 'HTML', 'C++'],
        correctAnswer: 2,
        explanation: 'HTML is a markup language, not a programming language. It describes structure, not logic.',
        points: 10,
      },
      {
        question: 'What does "URL" stand for?',
        options: [
          'Universal Resource Locator',
          'Uniform Resource Locator',
          'Unified Resource Link',
          'User Resource Link',
        ],
        correctAnswer: 1,
        explanation: 'URL stands for Uniform Resource Locator — the address of a webpage.',
        points: 10,
      },
    ],
  },
  {
    title: 'Sports Trivia',
    description: 'For the sports enthusiast!',
    category: 'Sports',
    difficulty: 'Medium',
    timeLimit: 25,
    questions: [
      {
        question: 'How many players are on a football (soccer) team on the field?',
        options: ['9', '10', '11', '12'],
        correctAnswer: 2,
        explanation: 'Each football team has 11 players on the field at a time.',
        points: 10,
      },
      {
        question: 'How often are the Olympic Games held?',
        options: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'],
        correctAnswer: 2,
        explanation: 'The Summer and Winter Olympics are each held every 4 years.',
        points: 10,
      },
      {
        question: 'In which sport would you perform a "slam dunk"?',
        options: ['Tennis', 'Baseball', 'Basketball', 'Volleyball'],
        correctAnswer: 2,
        explanation: 'A slam dunk is a basketball move where a player jumps and throws the ball down through the hoop.',
        points: 10,
      },
      {
        question: 'What is the maximum score in a single bowling frame?',
        options: ['10', '20', '30', '40'],
        correctAnswer: 2,
        explanation: 'A strike (knocking all 10 pins) followed by two more strikes scores 30 in one frame.',
        points: 10,
      },
      {
        question: 'How many points is a touchdown worth in American football?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 3,
        explanation: 'A touchdown is worth 6 points in American football.',
        points: 10,
      },
    ],
  },
  {
    title: 'History Challenge',
    description: 'Journey through world history!',
    category: 'History',
    difficulty: 'Hard',
    timeLimit: 20,
    questions: [
      {
        question: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
        explanation: 'World War II ended in 1945 — in Europe in May and in the Pacific in September.',
        points: 10,
      },
      {
        question: 'Who was the first President of the United States?',
        options: ['Abraham Lincoln', 'Thomas Jefferson', 'John Adams', 'George Washington'],
        correctAnswer: 3,
        explanation: 'George Washington became the first US President in 1789.',
        points: 10,
      },
      {
        question: 'Which ancient wonder was located in Alexandria?',
        options: ['Colossus of Rhodes', 'Lighthouse of Alexandria', 'Hanging Gardens', 'Statue of Zeus'],
        correctAnswer: 1,
        explanation: 'The Lighthouse of Alexandria (Pharos) was one of the Seven Wonders of the Ancient World.',
        points: 10,
      },
      {
        question: 'In what year did man first land on the Moon?',
        options: ['1965', '1967', '1969', '1971'],
        correctAnswer: 2,
        explanation: 'Apollo 11 landed on the Moon on July 20, 1969. Neil Armstrong was first.',
        points: 10,
      },
      {
        question: 'Which empire was ruled by Genghis Khan?',
        options: ['Roman Empire', 'Ottoman Empire', 'Mongol Empire', 'Persian Empire'],
        correctAnswer: 2,
        explanation: 'Genghis Khan founded and ruled the Mongol Empire, the largest contiguous land empire in history.',
        points: 10,
      },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Quiz.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@quiz.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin created — email: admin@quiz.com | password: admin123');

    // Create quizzes
    const quizzes = await Quiz.insertMany(
      sampleQuizzes.map((q) => ({ ...q, createdBy: admin._id }))
    );
    console.log(`📝 Created ${quizzes.length} sample quizzes`);

    console.log('\n✅ Seed complete! You can now start the server.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
