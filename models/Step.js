const mongoose = require('mongoose');
const z = require('zod');

// Zod Validation Schemas
const stepValidation = {
  stepNumber: z.number()
    .min(1, 'Step number must be at least 1')
    .max(1000, 'Step number cannot exceed 1000'),
    
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
    
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot exceed 10000 characters'),
    
  images: z.array(z.object({
    caption: z.string().optional(),
    url: z.string().url('Invalid image URL')
  })).optional(),
    
  codeSnippets: z.array(z.object({
    title: z.string().optional(),
    code: z.string().min(1, 'Code snippet cannot be empty'),
    explanation: z.string().optional(),
    output: z.string().optional(),
    language: z.string().default('javascript')
  })).optional(),
    
  activities: z.array(z.object({
    type: z.string(),
    question: z.string().min(1, 'Question is required'),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1, 'Correct answer is required'),
    starterCode: z.string().optional(),
    solution: z.string().optional(),
    explanation: z.string().optional()
  })).optional()
};

const StepSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  stepNumber: { 
    type: Number, 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true 
  },
  images: [{
    caption: String,
    url: { type: String, required: true }
  }],
  codeSnippets: [{
    title: String,
    code: { type: String, required: true },
    explanation: String,
    output: String,
    language: { 
      type: String, 
      default: 'javascript'
    }
  }],
  activities: [{
    type: { type: String, required: true },
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: String, required: true },
    starterCode: String,
    solution: String,
    explanation: String
  }],
  createdAt: { type: Date, default: Date.now }
}, {
  statics: {
    validateCreate(stepData) {
      const createSchema = z.object({
        stepNumber: stepValidation.stepNumber,
        title: stepValidation.title,
        content: stepValidation.content,
        images: stepValidation.images,
        codeSnippets: stepValidation.codeSnippets,
        activities: stepValidation.activities
      });
      
      return createSchema.parseAsync(stepData);
    },

    validateUpdate(updateData) {
      const updateSchema = z.object({
        stepNumber: stepValidation.stepNumber.optional(),
        title: stepValidation.title.optional(),
        content: stepValidation.content.optional(),
        images: stepValidation.images,
        codeSnippets: stepValidation.codeSnippets,
        activities: stepValidation.activities
      });
      
      return updateSchema.parseAsync(updateData);
    }
  }
});

module.exports = mongoose.model('Step', StepSchema);