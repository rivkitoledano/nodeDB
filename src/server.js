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
const { pool } = require('./db');
const { createPermanentTables } = require('./services/tableManager');

// צור את הטבלאות הקבועות כששרת עולה
(async () => {
  const client = await pool.connect();
  try {
    await createPermanentTables(client);
    console.log('Permanent tables created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
})();


// הרצת השרת
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
