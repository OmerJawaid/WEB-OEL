const express = require('express');
const router = express.Router();
const controller = require('../controller/feedbackform');

router.post('/feedback', controller.submitFeedback);

router.get('/feedbacks', controller.getAllFeedbacks);

router.get('/feedbacks/:subject', controller.getFeedbacksBySubject);

module.exports = router;
