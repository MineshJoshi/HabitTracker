import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function auth(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload
    req.user = decoded.user;
    next(); // Agle step par jao
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
}

export default auth;