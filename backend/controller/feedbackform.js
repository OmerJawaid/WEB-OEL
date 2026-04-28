const Feedback = require('../model/feedbackschema');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, subject, rating, comments } = req.body;
    const feedback = new Feedback({ name, subject, rating, comments });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeedbacksBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const feedbacks = await Feedback.find({ subject });
    // compute average rating
    const avg = feedbacks.length
      ? feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length
      : 0;
    res.json({ subject, averageRating: avg, feedbacks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};