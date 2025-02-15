const mongoose = require('mongoose');
const z = require('zod');
const bcrypt = require('bcryptjs');

// Validation Schemas
const userValidation = {
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email is too short')
    .max(50, 'Email cannot exceed 50 characters'),
    
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
}, { 
  timestamps: true,
  methods: {
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }
  },
  statics: {
    // Validation methods
    validateRegister(userData) {
      const registerSchema = z.object({
        username: userValidation.username,
        email: userValidation.email,
        password: userValidation.password
      });
      
      return registerSchema.parseAsync(userData);
    },

    validateLogin(credentials) {
      const loginSchema = z.object({
        email: userValidation.email,
        password: z.string().min(1, 'Password is required')
      });
      
      return loginSchema.parseAsync(credentials);
    }
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;