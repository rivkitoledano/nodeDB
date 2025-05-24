const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const conversationRoutes = require('./routes/conversationRoutes');

app.use(cors());
app.use(express.json());

// חיבור הנתיבים
app.use('/api', conversationRoutes);

// ברירת מחדל למסלול לא קיים
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// הרצת השרת
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
