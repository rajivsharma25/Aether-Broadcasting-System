import api from './api';

// Mock users for demonstration
const MOCK_USERS = {
  'teacher@test.com': { id: '1', name: 'John Teacher', role: 'teacher', email: 'teacher@test.com' },
  'principal@test.com': { id: '2', name: 'Jane Principal', role: 'principal', email: 'principal@test.com' },
};

const AuthService = {
  login: async (email, password) => {
    // Simulating API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS[email];
        if (user && password === 'password') {
          const response = {
            user,
            token: `mock-jwt-token-${user.role}`,
          };
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          resolve(response);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default AuthService;
