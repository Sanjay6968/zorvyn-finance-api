require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const FinancialRecord = require('../models/FinancialRecord');
const connectDB = require('../config/db');
const logger = require('./logger.util');

const CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Rent', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping'];

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDatabase = async () => {
  await connectDB();

  logger.info('🌱 Starting database seed...');

  await User.deleteMany({});
  await FinancialRecord.deleteMany({});
  logger.info('✅ Cleared existing data');

  const users = await User.create([
    { name: 'Admin User',    email: 'admin@finance.com',   password: 'admin123',   role: 'admin' },
    { name: 'Ana Analyst',  email: 'analyst@finance.com', password: 'analyst123', role: 'analyst' },
    { name: 'Victor Viewer', email: 'viewer@finance.com',  password: 'viewer123',  role: 'viewer' },
  ]);
  logger.info(`✅ Created ${users.length} users`);

  const adminUser = users[0];
  const records = [];

  for (let i = 0; i < 60; i++) {
    const type = Math.random() > 0.4 ? 'expense' : 'income';
    const category = randomItem(CATEGORIES);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    records.push({
      amount: parseFloat(randomBetween(type === 'income' ? 1000 : 50, type === 'income' ? 10000 : 2000).toFixed(2)),
      type,
      category: type === 'income' ? ['Salary', 'Freelance', 'Investment'][Math.floor(Math.random() * 3)] : category,
      date,
      notes: `Seeded ${type} record for ${category}`,
      createdBy: adminUser._id,
    });
  }

  await FinancialRecord.insertMany(records);
  logger.info(`✅ Created ${records.length} financial records`);

  logger.info('\n🎉 Seed complete! Login credentials:');
  logger.info('   Admin:   admin@finance.com   / admin123');
  logger.info('   Analyst: analyst@finance.com / analyst123');
  logger.info('   Viewer:  viewer@finance.com  / viewer123');

  await mongoose.disconnect();
  process.exit(0);
};

seedDatabase().catch((err) => {
  logger.error('Seed failed:', err);
  process.exit(1);
});
