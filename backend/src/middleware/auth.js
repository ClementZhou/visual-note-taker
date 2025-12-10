/**
 * Authentication Middleware
 * Verifies JWT tokens and Supabase auth
 */

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Verify token (implementation will use Supabase auth)
    // For now, just pass through
    req.userId = token
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export default authMiddleware
