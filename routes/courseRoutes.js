const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const stepController = require('../controllers/stepController');
const auth = require('../middleware/auth');

// Course routes
router.get('/', courseController.getAllCourses);
router.get('/search', courseController.searchCourses);
router.get('/:id', courseController.getCourse);
router.post('/', auth, courseController.createCourse);
router.put('/:id', auth, courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);

// Step routes
router.get('/:courseId/steps', stepController.getStepsByCourse);
router.get('/:courseId/steps/:id', stepController.getStep);
router.post('/:courseId/steps', auth, stepController.createStep);
router.put('/:courseId/steps/:id', auth, stepController.updateStep);
router.delete('/:courseId/steps/:id', auth, stepController.deleteStep);
router.post('/:courseId/steps/reorder', auth, stepController.reorderSteps);

module.exports = router;