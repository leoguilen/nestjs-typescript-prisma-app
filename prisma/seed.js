const { PrismaClient } = require('@prisma/client');
const { customers, sensors } = require('./data.js');

const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.customer.deleteMany();
    console.log('Deleted records in Customer table.');

    await prisma.sensor.deleteMany();
    console.log('Deleted records in Sensor table');

    await prisma.customer.createMany({
      data: customers,
    });
    console.log('Added customers data');

    await prisma.sensor.createMany({
      data: sensors,
    });
    console.log('Added sensors data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
