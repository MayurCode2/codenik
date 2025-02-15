const courseService = require('../services/courseService');

class CourseController {
  async getAllCourses(req, res) {
    try {
      const courses = await courseService.getAllCourses();
      
      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCourse(req, res) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      
      res.json({
        success: true,
        data: course
      });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createCourse(req, res) {
    try {
      const course = await courseService.createCourse(req.body);
      
      res.status(201).json({
        success: true,
        data: course,
        message: 'Course created successfully'
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

  async updateCourse(req, res) {
    try {
      const course = await courseService.updateCourse(
        req.params.id,
        req.body
      );
      
      res.json({
        success: true,
        data: course,
        message: 'Course updated successfully'
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

  async deleteCourse(req, res) {
    try {
      await courseService.deleteCourse(req.params.id);
      
      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  async searchCourses(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const courses = await courseService.searchCourses(q);
      
      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new CourseController();