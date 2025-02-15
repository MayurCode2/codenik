const Course = require('../models/Course');
const Step = require('../models/Step');

class CourseService {
  async getAllCourses(query = {}) {
    try {
      const courses = await Course.find(query)
        .select('-steps')
        .sort('-createdAt');
      return courses;
    } catch (error) {
      throw new Error('Error fetching courses: ' + error.message);
    }
  }

  async getCourseById(courseId) {
    try {
      const course = await Course.findById(courseId)
        .populate('steps');
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      return course;
    } catch (error) {
      throw new Error('Error fetching course: ' + error.message);
    }
  }

  async createCourse(courseData) {
    try {
      // Validate data
      const validatedData = await Course.validateCreate(courseData);
      
      // Create course
      const course = new Course(validatedData);
      await course.save();
      
      return course;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(courseId, updateData) {
    try {
      // Validate update data
      const validatedData = await Course.validateUpdate(updateData);
      
      const course = await Course.findByIdAndUpdate(
        courseId,
        validatedData,
        { new: true, runValidators: true }
      );

      if (!course) {
        throw new Error('Course not found');
      }

      return course;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(courseId) {
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      // Delete associated steps
      await Step.deleteMany({ courseId: course._id });
      await course.remove();

      return { message: 'Course deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting course: ' + error.message);
    }
  }

  async searchCourses(searchTerm) {
    try {
      const courses = await Course.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { language: { $regex: searchTerm, $options: 'i' } }
        ]
      }).select('-steps');

      return courses;
    } catch (error) {
      throw new Error('Error searching courses: ' + error.message);
    }
  }
}

module.exports = new CourseService();