const { read, write } = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// GET /users
exports.getUsers = (req, res) => {
  const { search, sort, order = 'asc' } = req.query;
  let { users } = read();

  if (search) {
    const s = search.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s)
    );
  }

  if (sort && ['name', 'email', 'age'].includes(sort)) {
    users.sort((a, b) => {
      if (a[sort] < b[sort]) return order === 'desc' ? 1 : -1;
      if (a[sort] > b[sort]) return order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  res.json({ success: true, count: users.length, data: users });
};

// GET /users/:id
exports.getUserById = (req, res) => {
  const { users } = read();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

// POST /users
exports.createUser = (req, res) => {
  const { name, email, age } = req.body;
  const db = read();

  const exists = db.users.find(u => u.email === email);
  if (exists) return res.status(409).json({ success: false, message: 'Email already exists' });

  const user = {
    id: uuidv4(),
    name,
    email,
    age: age ?? null,
    created_at: new Date().toISOString()
  };

  db.users.push(user);
  write(db);
  res.status(201).json({ success: true, data: user });
};

// PUT /users/:id
exports.updateUser = (req, res) => {
  const { name, email, age } = req.body;
  const db = read();

  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });

  db.users[index] = {
    ...db.users[index],
    name: name ?? db.users[index].name,
    email: email ?? db.users[index].email,
    age: age ?? db.users[index].age,
  };

  write(db);
  res.json({ success: true, data: db.users[index] });
};

// DELETE /users/:id
exports.deleteUser = (req, res) => {
  const db = read();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });

  db.users.splice(index, 1);
  write(db);
  res.json({ success: true, message: 'User deleted successfully' });
};