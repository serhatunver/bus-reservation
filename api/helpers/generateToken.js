import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for the given user.
 * @param {Object} user - The user object containing user details.
 * @returns {Promise<string>} - A promise that resolves to the generated JWT token.
 * @throws {Error} - Throws an error if JWT_SECRET is not defined or token generation fails.
 */
const generateToken = async (user) => {
  console.log('Generating token for user:', user);
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

export default generateToken;
