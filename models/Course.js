const mongoose = require('mongoose');
const z = require('zod');

// Zod Validation Schemas
const courseValidation = {
  name: z.string()
    .min(3, 'Course name must be at least 3 characters')
    .max(100, 'Course name cannot exceed 100 characters'),
    
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
    
  language: z.string()
    .min(1, 'Programming language is required'),
    
  iconUrl: z.string()
    .url('Invalid URL format')
    .optional()
};

const CourseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Course name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  language: { 
    type: String, 
    required: [true, 'Programming language is required']
  },
  steps: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Step' 
  }],
  iconUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  statics: {
    validateCreate(courseData) {
      const createSchema = z.object({
        name: courseValidation.name,
        description: courseValidation.description,
        language: courseValidation.language,
        iconUrl: courseValidation.iconUrl
      });
      
      return createSchema.parseAsync(courseData);
    },

    validateUpdate(updateData) {
      const updateSchema = z.object({
        name: courseValidation.name.optional(),
        description: courseValidation.description.optional(),
        language: courseValidation.language.optional(),
        iconUrl: courseValidation.iconUrl.optional()
      });
      
      return updateSchema.parseAsync(updateData);
    }
  }
});

// Update timestamp on save
CourseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', CourseSchema);