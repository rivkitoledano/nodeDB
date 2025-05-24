const { getClient } = require('../db');
const { insertPolicyData, dropTempTables } = require('../services/conversationService');

async function receivePolicy(req, res) {
  const { conversationId, policy } = req.body;

  if (!conversationId || !policy) {
    return res.status(400).json({ error: 'Missing conversationId or policy data' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');
    await insertPolicyData(client, conversationId, policy);
    await client.query('COMMIT');

    res.json({ message: 'Policy data inserted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

async function runQuery(req, res) {
  const { conversationId, sqlQuery } = req.body;

  if (!conversationId || !sqlQuery) {
    return res.status(400).json({ error: 'Missing conversationId or sqlQuery' });
  }

  if (!sqlQuery.trim().toLowerCase().startsWith('select')) {
    return res.status(400).json({ error: 'Only SELECT queries allowed' });
  }

  const client = await getClient();

  try {
    const result = await client.query(sqlQuery);
    res.json({ rows: result.rows, rowCount: result.rowCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
}

async function cleanupConversation(req, res) {
  const { conversationId } = req.body;

  if (!conversationId) {
    return res.status(400).json({ error: 'Missing conversationId' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');
    await dropTempTables(client, conversationId);
    await client.query('COMMIT');
    res.json({ message: 'Policy data cleaned for this conversationId' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
  
}

module.exports = {
  receivePolicy,
  runQuery,
  cleanupConversation,
};
