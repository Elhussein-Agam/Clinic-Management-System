require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { connectDB } = require('./config/db');

const seedData = async () => {
  await connectDB();

  await User.deleteMany();

  const users = [
    { username: 'drsmith', password: '123456', role: 'doctor', specialization: 'Cardiology' },
    { username: 'drjones', password: '123456', role: 'doctor', specialization: 'Neurology' },
    { username: 'john_doe', password: '123456', role: 'patient' },
    { username: 'jane_doe', password: '123456', role: 'patient' },
  ];

  for (const user of users) {
    const newUser = new User(user);
    await newUser.save();
  }

  console.log('✅ Seed Data Inserted');
  process.exit();
};

seedData();