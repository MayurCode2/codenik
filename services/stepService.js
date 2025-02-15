const Step = require('../models/Step');
const Course = require('../models/Course');

class StepService {
  async getStepsByCourse(courseId) {
    try {
      const steps = await Step.find({ courseId })
        .sort('stepNumber');
      return steps;
    } catch (error) {
      throw new Error('Error fetching steps: ' + error.message);
    }
  }

  async getStepById(stepId) {
    try {
      const step = await Step.findById(stepId);
      if (!step) {
        throw new Error('Step not found');
      }
      return step;
    } catch (error) {
      throw new Error('Error fetching step: ' + error.message);
    }
  }

  async createStep(courseId, stepData) {
    try {
      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Validate step data
      const validatedData = await Step.validateCreate(stepData);
      
      // Create step
      const step = new Step({
        ...validatedData,
        courseId
      });
      
      await step.save();

      // Add step to course
      course.steps.push(step._id);
      await course.save();

      return step;
    } catch (error) {
      throw error;
    }
  }

  async updateStep(stepId, updateData) {
    try {
      // Validate update data
      const validatedData = await Step.validateUpdate(updateData);
      
      const step = await Step.findByIdAndUpdate(
        stepId,
        validatedData,
        { new: true, runValidators: true }
      );

      if (!step) {
        throw new Error('Step not found');
      }

      return step;
    } catch (error) {
      throw error;
    }
  }

  async deleteStep(stepId) {
    try {
      const step = await Step.findById(stepId);
      if (!step) {
        throw new Error('Step not found');
      }

      // Remove step from course
      await Course.findByIdAndUpdate(step.courseId, {
        $pull: { steps: step._id }
      });

      await step.remove();
      return { message: 'Step deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting step: ' + error.message);
    }
  }

  async reorderSteps(courseId, stepOrder) {
    try {
      const updates = stepOrder.map((item, index) => ({
        updateOne: {
          filter: { _id: item.stepId },
          update: { $set: { stepNumber: index + 1 } }
        }
      }));

      await Step.bulkWrite(updates);
      return { message: 'Steps reordered successfully' };
    } catch (error) {
      throw new Error('Error reordering steps: ' + error.message);
    }
  }
}

module.exports = new StepService();