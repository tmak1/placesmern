import bcrypt from 'bcrypt';

const users = [
  {
    name: 'User1',
    email: 'dt1@ga.co.uk',
    password: await bcrypt.hash('123', 10),
    imageUrl: '1.jpg',
  },
  {
    name: 'User2',
    email: 'dt2@ga.co.uk',
    password: await bcrypt.hash('123', 10),
    imageUrl: '2.jpg',
  },
];

export default users;
