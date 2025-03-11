import bcrypt from 'bcrypt';
import db from '../models';

const { sequelize, User } = db;

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); // Recreate tables
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    // Create test users
    await User.bulkCreate([
      {
        username: 'testuser1',
        email: 'user1@example.com',
        passwordHash,
        riotId: 'user1#NA1',
        usernameId: '550e8400-e29b-41d4-a716-446655440000'
      },
      {
        username: 'testuser2',
        email: 'user2@example.com',
        passwordHash,
        riotId: 'user2#NA1',
        usernameId: '550e8400-e29b-41d4-a716-446655440001' 
      }
    ]);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();