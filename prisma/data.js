const { Prisma } = require('@prisma/client');

const customers = [
  {
    Email: 'test1@email.com',
    FirstName: 'test1',
    LastName: 'test1',
  },
  {
    Email: 'test2@email.com',
    FirstName: 'test2',
    LastName: 'test2',
  },
  {
    Email: 'test3@email.com',
    FirstName: 'test3',
    LastName: 'test3',
  },
];

const sensors = [
  {
    Name: 'MAX30001',
    SerialCode: 'MAX30001-123',
  },
  {
    Name: 'MAX86141',
    SerialCode: 'MAX86141-123',
  },
  {
    Name: 'MAX66543',
    SerialCode: 'MAX66543-123',
  },
];

module.exports = {
  customers,
  sensors,
};
