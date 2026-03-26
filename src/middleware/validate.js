exports.validateUser = (req, res, next) => {
  const { name, email, age } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'name is required and must be a string' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'email is invalid' });
  }

  if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 120)) {
    return res.status(400).json({ success: false, message: 'age must be a number between 0 and 120' });
  }

  next();
};