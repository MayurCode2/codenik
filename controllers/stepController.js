const stepService = require('../services/stepService');

class StepController {
  async getStepsByCourse(req, res) {
    try {
      const steps = await stepService.getStepsByCourse(req.params.courseId);
      
      res.json({
        success: true,
        data: steps
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getStep(req, res) {
    try {
      const step = await stepService.getStepById(req.params.id);
      
      res.json({
        success: true,
        data: step
      });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createStep(req, res) {
    try {
      const step = await stepService.createStep(
        req.params.courseId,
        req.body
      );
      
      res.status(201).json({
        success: true,
        data: step,
        message: 'Step created successfully'
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateStep(req, res) {
    try {
      const step = await stepService.updateStep(
        req.params.id,
        req.body
      );
      
      res.json({
        success: true,
        data: step,
        message: 'Step updated successfully'
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      
      res.status(error.message.includes('not found') ? 404 : 400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteStep(req, res) {
    try {
      await stepService.deleteStep(req.params.id);
      
      res.json({
        success: true,
        message: 'Step deleted successfully'
      });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  async reorderSteps(req, res) {
    try {
      await stepService.reorderSteps(
        req.params.courseId,
        req.body.stepOrder
      );
      
      res.json({
        success: true,
        message: 'Steps reordered successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new StepController();