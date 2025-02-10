import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('Access Denied: No Token Provided'); // Debug log
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found'); // Debug log
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log('Invalid Token', err); // Debug log
    return res.status(403).json({ message: 'Invalid Token' });
  }
};

export default authenticateToken;
