const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Resolve querySrv ECONNREFUSED issues by setting public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);
const User = require('../models/User');
const Badge = require('../models/Badge');
const Article = require('../models/Article');
const Activity = require('../models/Activity');
const Goal = require('../models/Goal');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecotrack';
    await mongoose.connect(mongoURI);
    console.log('Database connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedBadges = [
  {
    name: 'Green Beginner',
    description: 'Earned by taking your very first step in environmental tracking!',
    criteria: 'Register an account and log your first daily activity assessment.',
    icon: 'bi-leaf',
  },
  {
    name: 'Carbon Saver',
    description: 'Awarded for maintaining an exceptionally low carbon footprint.',
    criteria: 'Submit any daily assessment with a score below 5.0 kg CO2e.',
    icon: 'bi-cloud-sun',
  },
  {
    name: 'Eco Warrior',
    description: 'Earned through persistence and consistency in habit tracking.',
    criteria: 'Log daily carbon footprint assessments for 5 or more days.',
    icon: 'bi-shield-check',
  },
  {
    name: 'Sustainability Champion',
    description: 'The highest honor for true ecological pioneers.',
    criteria: 'Log at least 10 assessments with an average carbon score under 8.0 kg CO2e.',
    icon: 'bi-trophy',
  },
];

const seedArticles = [
  {
    title: 'Understanding Climate Change: The Basics',
    category: 'Climate Change',
    content: `Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil, and gas.

Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. Examples of greenhouse gas emissions that are causing climate change include carbon dioxide and methane. These come from using gasoline for driving a car or coal for heating a building, for example. Clearing land and forests can also release carbon dioxide. Landfills for garbage are a major source of methane emissions. Energy, industry, transport, buildings, agriculture and land use are among the main emitters.

Every decimal point of warming matters. By tracking and reducing your carbon footprint, you actively help reduce the heat-trapping blanket surrounding our planet.`,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800',
    readingTime: 3,
    author: 'EcoTrack Editorial',
  },
  {
    title: 'Transitioning to Renewable Energy at Home',
    category: 'Renewable Energy',
    content: `Fossil fuels—coal, oil, and gas—are by far the largest contributor to global climate change, accounting for over 75 percent of global greenhouse gas emissions and nearly 90 percent of all carbon dioxide emissions. To avoid the worst impacts of climate change, emissions need to be halved by 2030 and reach net-zero by 2050.

Renewable energy sources, such as wind, solar, geothermal, hydroelectric, and biomass, are clean, inexhaustible resources that generate little to no greenhouse gases. Making the transition to renewable energy at home can start small:
1. Install rooftop solar panels.
2. Sign up for green energy options through your local power utility.
3. Replace incandescent light bulbs with energy-efficient LEDs.
4. Upgrade to smart thermostats that reduce electricity consumption.

Taking these steps not only reduces carbon footprint, but also drives down monthly electricity costs.`,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    readingTime: 4,
    author: 'Green Living Tech',
  },
  {
    title: 'The Blueprint to Zero-Waste Living',
    category: 'Waste Reduction',
    content: `Every year, humans generate billions of tons of waste, much of which winds up in landfills, incinerators, and oceans, producing methane gas and harming delicate ecosystems. Transitioning to a zero-waste lifestyle focuses on the 5 Rs: Refuse, Reduce, Reuse, Recycle, and Rot.

- **Refuse**: Say no to single-use plastics, plastic bags, and disposable cutlery. Carry reusable bags, bottles, and straws.
- **Reduce**: Simplify your purchases. Buy only what you need to avoid food spoilage and unnecessary items.
- **Reuse**: Swap disposable items for reusable counterparts (e.g., cloth towels instead of paper towels). Upcycle glass jars for storage.
- **Recycle**: Recycle correctly by cleaning containers and separating cardboard, metals, and plastics.
- **Rot**: Compost food scraps. Organic matter represents a massive portion of municipal waste, and composting transforms it into nutrient-rich soil rather than landfill methane.`,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
    readingTime: 5,
    author: 'EcoTrack Team',
  },
  {
    title: 'Sustainable Diets: Eat for the Planet',
    category: 'Sustainable Living',
    content: `Food production accounts for around one-quarter of global greenhouse gas emissions. What we eat matters far more than where it comes from, as transportation makes up only a tiny fraction of food's total carbon footprint.

Animal-based foods, particularly red meat (beef and lamb), have a high environmental footprint. Cow digestions produce methane, a powerful greenhouse gas, and pastures require massive amounts of land, often resulting in deforestation.
- **Vegan Diet**: Emits roughly 1.5 kg CO2e per day. By eliminating animal products, you reduce food emissions by up to 70%.
- **Vegetarian Diet**: Emits roughly 2.5 kg CO2e per day. Eggs and dairy still contribute, but represent a massive reduction compared to meat.
- **Mixed Diet**: Emits roughly 4.0 kg CO2e per day. Includes moderate poultry, fish, and red meat.
- **Meat-heavy Diet**: Emits 7.0+ kg CO2e per day. Frequent consumption of beef, pork, and lamb.

Incorporating even 1 or 2 plant-based days a week can significantly lower your personal footprint.`,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    readingTime: 4,
    author: 'Nutritional Green',
  },
];

const runSeeder = async () => {
  try {
    await connectDB();

    // 1. Clear existing documents to avoid duplicate keys in seeding
    console.log('Clearing database collection logs...');
    await Activity.deleteMany({});
    await Goal.deleteMany({});
    await User.deleteMany({});
    await Badge.deleteMany({});
    await Article.deleteMany({});

    console.log('Database cleared.');

    // 2. Seed Badges
    console.log('Seeding Badges...');
    const insertedBadges = await Badge.insertMany(seedBadges);
    console.log(`${insertedBadges.length} badges inserted.`);

    // 3. Seed Articles
    console.log('Seeding Articles...');
    const insertedArticles = await Article.insertMany(seedArticles);
    console.log(`${insertedArticles.length} articles inserted.`);

    // 4. Seed Users
    console.log('Seeding Default Users...');
    
    // Find the beginner badge to award to default user
    const beginnerBadge = insertedBadges.find(b => b.name === 'Green Beginner');

    // Default regular user
    const defaultUser = new User({
      name: 'Eco Explorer',
      email: 'user@ecotrack.com',
      password: 'User@123', // Will be hashed via pre-save hook
      role: 'user',
      badges: beginnerBadge ? [{ badge: beginnerBadge._id }] : [],
    });

    // Default admin
    const defaultAdmin = new User({
      name: 'System Admin',
      email: 'admin@ecotrack.com',
      password: 'Admin@123', // Will be hashed via pre-save hook
      role: 'admin',
    });

    await defaultUser.save();
    await defaultAdmin.save();

    console.log('Default user (user@ecotrack.com / User@123) created.');
    console.log('Default admin (admin@ecotrack.com / Admin@123) created.');

    console.log('Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

runSeeder();
