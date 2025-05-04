const express = require('express');
const router = express.Router();
const { getPostAnalytics } = require('../controllers/analyticsController'); // Ensure this is the correct controller import

// Route to get analytics of posts popular
router.get('/posts', getPostAnalytics);

module.exports = router;
