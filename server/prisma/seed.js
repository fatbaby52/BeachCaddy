const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌊 Seeding ShoreReady database...')

  // Create Beach Locations
  const seacliff = await prisma.beachLocation.create({
    data: {
      name: 'Seacliff State Beach',
      description: 'Famous for the concrete ship SS Palo Alto. Great for families with calm waters and excellent facilities.',
      address: '201 State Park Dr, Aptos, CA 95003',
      latitude: 36.9705,
      longitude: -121.9155,
      zones: {
        create: [
          { name: 'Near Water', description: 'Front row to the waves', icon: 'waves' },
          { name: 'Private Area', description: 'Tucked away for a quieter vibe', icon: 'palm-tree' },
          { name: 'Family Zone', description: 'Close to restrooms and calmer water', icon: 'users' },
          { name: 'Near Parking', description: 'Easy access, less carrying', icon: 'car' },
          { name: 'Sunset-Facing', description: 'Golden hour views', icon: 'sun' },
        ],
      },
    },
  })

  const sunset = await prisma.beachLocation.create({
    data: {
      name: 'Sunset State Beach',
      description: 'Beautiful sunsets and wide sandy beach. Perfect for groups and special occasions.',
      address: '201 Sunset Beach Rd, Watsonville, CA 95076',
      latitude: 36.8672,
      longitude: -121.8328,
      zones: {
        create: [
          { name: 'Near Water', description: 'Front row to the waves', icon: 'waves' },
          { name: 'Private Area', description: 'Tucked away for a quieter vibe', icon: 'palm-tree' },
          { name: 'Family Zone', description: 'Close to restrooms and calmer water', icon: 'users' },
          { name: 'Near Parking', description: 'Easy access, less carrying', icon: 'car' },
          { name: 'Sunset-Facing', description: 'Golden hour views', icon: 'sun' },
        ],
      },
    },
  })

  const manresa = await prisma.beachLocation.create({
    data: {
      name: 'Manresa State Beach',
      description: 'Quieter beach with great surfing. Ideal for relaxation and couples.',
      address: '205 Manresa Beach Rd, La Selva Beach, CA 95076',
      latitude: 36.9358,
      longitude: -121.8536,
      zones: {
        create: [
          { name: 'Near Water', description: 'Front row to the waves', icon: 'waves' },
          { name: 'Private Area', description: 'Tucked away for a quieter vibe', icon: 'palm-tree' },
          { name: 'Family Zone', description: 'Close to restrooms and calmer water', icon: 'users' },
          { name: 'Near Parking', description: 'Easy access, less carrying', icon: 'car' },
          { name: 'Sunset-Facing', description: 'Golden hour views', icon: 'sun' },
        ],
      },
    },
  })

  console.log('✅ Beach locations created')

  // Create Menu Items
  const menuItems = await Promise.all([
    // Shade
    prisma.menuItem.create({ data: { name: 'Beach Umbrella', description: 'Large 7ft umbrella with anchor', price: 20, category: 'UMBRELLA', sortOrder: 1 } }),
    prisma.menuItem.create({ data: { name: 'Canopy', description: '10x10 pop-up canopy with sandbags', price: 35, category: 'CANOPY', sortOrder: 1 } }),
    prisma.menuItem.create({ data: { name: 'Large Canopy', description: '10x15 premium canopy with sidewalls available', price: 50, category: 'CANOPY', sortOrder: 2 } }),
    prisma.menuItem.create({ data: { name: 'Premium Canopy', description: 'Deluxe 12x12 canopy with curtains and lighting', price: 75, category: 'CANOPY', sortOrder: 3 } }),

    // Seating
    prisma.menuItem.create({ data: { name: 'Beach Chair', description: 'Classic folding beach chair', price: 12, category: 'SEATING', sortOrder: 1 } }),
    prisma.menuItem.create({ data: { name: 'Premium Lounger', description: 'Padded reclining beach lounger', price: 25, category: 'SEATING', sortOrder: 2 } }),
    prisma.menuItem.create({ data: { name: 'Beach Blanket', description: 'Large sand-free beach blanket', price: 10, category: 'COMFORT', sortOrder: 1 } }),

    // Comfort
    prisma.menuItem.create({ data: { name: 'Beach Towel', description: 'Soft cotton beach towel', price: 8, category: 'COMFORT', sortOrder: 2 } }),
    prisma.menuItem.create({ data: { name: 'Oversized Towel', description: 'Extra-large premium beach towel', price: 12, category: 'COMFORT', sortOrder: 3 } }),

    // Coolers & Ice
    prisma.menuItem.create({ data: { name: 'Small Cooler', description: '25qt cooler, keeps ice all day', price: 15, category: 'COOLER_ICE', sortOrder: 1 } }),
    prisma.menuItem.create({ data: { name: 'Large Cooler', description: '50qt cooler for bigger groups', price: 25, category: 'COOLER_ICE', sortOrder: 2 } }),
    prisma.menuItem.create({ data: { name: 'Bag of Ice', description: '10lb bag of ice', price: 5, category: 'COOLER_ICE', sortOrder: 3, isAddOn: true } }),

    // Food & Drink
    prisma.menuItem.create({ data: { name: 'Drink Pack', description: 'Water and assorted sodas for 4', price: 12, category: 'FOOD_DRINK', sortOrder: 1 } }),
    prisma.menuItem.create({ data: { name: 'Premium Drink Pack', description: 'Sparkling water, craft sodas, juice', price: 25, category: 'FOOD_DRINK', sortOrder: 2 } }),
    prisma.menuItem.create({ data: { name: 'Snack Pack', description: 'Chips, fruit, granola bars', price: 15, category: 'FOOD_DRINK', sortOrder: 3, isAddOn: true } }),
    prisma.menuItem.create({ data: { name: 'Meal Tray', description: 'Sandwiches and sides for 4', price: 35, category: 'FOOD_DRINK', sortOrder: 4, isAddOn: true } }),
    prisma.menuItem.create({ data: { name: 'Charcuterie Tray', description: 'Premium meats, cheeses, crackers, fruit', price: 45, category: 'FOOD_DRINK', sortOrder: 5, isAddOn: true } }),
    prisma.menuItem.create({ data: { name: 'Fruit Platter', description: 'Fresh seasonal fruit platter', price: 30, category: 'FOOD_DRINK', sortOrder: 6, isAddOn: true } }),

    // Entertainment
    prisma.menuItem.create({ data: { name: 'Bluetooth Speaker', description: 'Waterproof portable speaker', price: 15, category: 'ENTERTAINMENT', sortOrder: 1, isAddOn: true } }),
    prisma.menuItem.create({ data: { name: 'Beach Games Set', description: 'Volleyball, frisbee, paddleball', price: 20, category: 'GAMES', sortOrder: 1, isAddOn: true } }),

    // Kids
    prisma.menuItem.create({ data: { name: 'Kids Beach Toy Set', description: 'Buckets, shovels, molds, water toys', price: 18, category: 'KIDS', sortOrder: 1, isAddOn: true } }),
    prisma.menuItem.create({ data: { name: 'Sand Castle Kit', description: 'Professional sand castle building set', price: 12, category: 'KIDS', sortOrder: 2, isAddOn: true } }),

    // Accessories
    prisma.menuItem.create({ data: { name: 'Side Table', description: 'Portable folding side table', price: 15, category: 'ACCESSORIES', sortOrder: 1 } }),
    prisma.menuItem.create({ data: { name: 'Sunblock', description: 'Reef-safe SPF 50 sunscreen', price: 5, category: 'ACCESSORIES', sortOrder: 2 } }),

    // Lighting
    prisma.menuItem.create({ data: { name: 'Sunset Lighting Kit', description: 'String lights and lanterns for evening', price: 30, category: 'LIGHTING', sortOrder: 1, isAddOn: true } }),
  ])

  console.log('✅ Menu items created')

  // Get menu items by name for package creation
  const getItem = (name) => menuItems.find(i => i.name === name)

  // Create Packages
  await prisma.package.create({
    data: {
      name: 'Basic Beach Day',
      description: 'Everything you need for a simple, perfect beach day.',
      price: 89,
      sortOrder: 1,
      items: {
        create: [
          { menuItemId: getItem('Beach Umbrella').id, quantity: 1 },
          { menuItemId: getItem('Beach Chair').id, quantity: 2 },
          { menuItemId: getItem('Small Cooler').id, quantity: 1 },
          { menuItemId: getItem('Beach Towel').id, quantity: 2 },
          { menuItemId: getItem('Sunblock').id, quantity: 1 },
        ],
      },
    },
  })

  await prisma.package.create({
    data: {
      name: 'Couples Relaxation',
      description: 'Premium comfort for two with all the extras.',
      price: 149,
      tag: 'Most Popular',
      sortOrder: 2,
      items: {
        create: [
          { menuItemId: getItem('Canopy').id, quantity: 1 },
          { menuItemId: getItem('Premium Lounger').id, quantity: 2 },
          { menuItemId: getItem('Small Cooler').id, quantity: 1 },
          { menuItemId: getItem('Drink Pack').id, quantity: 1 },
          { menuItemId: getItem('Beach Towel').id, quantity: 2 },
          { menuItemId: getItem('Bluetooth Speaker').id, quantity: 1 },
          { menuItemId: getItem('Sunblock').id, quantity: 1 },
        ],
      },
    },
  })

  await prisma.package.create({
    data: {
      name: 'Family Fun',
      description: 'Room for the whole family plus games and snacks.',
      price: 199,
      tag: 'Best Value',
      sortOrder: 3,
      items: {
        create: [
          { menuItemId: getItem('Large Canopy').id, quantity: 1 },
          { menuItemId: getItem('Beach Chair').id, quantity: 4 },
          { menuItemId: getItem('Large Cooler').id, quantity: 1 },
          { menuItemId: getItem('Drink Pack').id, quantity: 1 },
          { menuItemId: getItem('Beach Towel').id, quantity: 4 },
          { menuItemId: getItem('Kids Beach Toy Set').id, quantity: 1 },
          { menuItemId: getItem('Beach Games Set').id, quantity: 1 },
          { menuItemId: getItem('Snack Pack').id, quantity: 1 },
          { menuItemId: getItem('Sunblock').id, quantity: 1 },
        ],
      },
    },
  })

  await prisma.package.create({
    data: {
      name: 'Luxury Beach Lounge',
      description: 'The ultimate premium beach experience.',
      price: 349,
      sortOrder: 4,
      items: {
        create: [
          { menuItemId: getItem('Premium Canopy').id, quantity: 1 },
          { menuItemId: getItem('Premium Lounger').id, quantity: 4 },
          { menuItemId: getItem('Side Table').id, quantity: 1 },
          { menuItemId: getItem('Large Cooler').id, quantity: 1 },
          { menuItemId: getItem('Premium Drink Pack').id, quantity: 1 },
          { menuItemId: getItem('Oversized Towel').id, quantity: 4 },
          { menuItemId: getItem('Bluetooth Speaker').id, quantity: 1 },
          { menuItemId: getItem('Charcuterie Tray').id, quantity: 1 },
          { menuItemId: getItem('Beach Blanket').id, quantity: 2 },
          { menuItemId: getItem('Sunblock').id, quantity: 1 },
        ],
      },
    },
  })

  await prisma.package.create({
    data: {
      name: 'Group Party',
      description: 'Perfect for groups of 8+ celebrating together.',
      price: 499,
      sortOrder: 5,
      items: {
        create: [
          { menuItemId: getItem('Large Canopy').id, quantity: 2 },
          { menuItemId: getItem('Beach Chair').id, quantity: 10 },
          { menuItemId: getItem('Side Table').id, quantity: 2 },
          { menuItemId: getItem('Large Cooler').id, quantity: 2 },
          { menuItemId: getItem('Drink Pack').id, quantity: 2 },
          { menuItemId: getItem('Beach Towel').id, quantity: 10 },
          { menuItemId: getItem('Bluetooth Speaker').id, quantity: 1 },
          { menuItemId: getItem('Beach Games Set').id, quantity: 1 },
          { menuItemId: getItem('Snack Pack').id, quantity: 2 },
          { menuItemId: getItem('Sunblock').id, quantity: 2 },
          { menuItemId: getItem('Sunset Lighting Kit').id, quantity: 1 },
        ],
      },
    },
  })

  console.log('✅ Packages created')

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@shoreready.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created (admin@shoreready.com / admin123)')

  // Create Promo Codes
  await prisma.promoCode.createMany({
    data: [
      { code: 'FIRSTBEACH', discountType: 'percentage', discountValue: 20 },
      { code: 'SUMMER10', discountType: 'fixed', discountValue: 10 },
      { code: 'WELCOME', discountType: 'percentage', discountValue: 15 },
    ],
  })

  console.log('✅ Promo codes created')

  console.log('🏖️ Database seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
