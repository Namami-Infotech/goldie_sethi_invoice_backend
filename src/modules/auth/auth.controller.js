const authService = require('./auth.service');

class AuthController {
  login = async (req, res) => {
    try {
      const { username, email, identifier, password } = req.body;
      const targetIdentifier = identifier || username || email;

      const result = await authService.login(targetIdentifier, password);
      if (!result.success) {
        return res.status(result.statusCode || 400).json({
          success: false,
          message: result.message
        });
      }

      return res.json({
        success: true,
        message: 'Admin login successful',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Login failed due to internal error'
      });
    }
  };

  me = async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

      if (!token) {
        return res.status(401).json({ success: false, message: 'No authorization token provided' });
      }

      const user = await authService.verifyToken(token);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
      }

      return res.json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new AuthController();
