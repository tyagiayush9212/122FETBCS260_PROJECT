const express = require('express');
const dotenv = require('dotenv');
const analyticsRoutes = require('./routes/analytics');

dotenv.config(); // Load environment variables (if needed, otherwise remove)

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Use analytics routes under /evaluation-service/hFhJhm
app.use('/evaluation-service/hFhJhm', analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
