async function createPermanentTables(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS policies (
      conversationId TEXT,
      policyid TEXT,
      name TEXT,
      subname TEXT,
      PRIMARY KEY (conversationId, policyid)
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS charges (
      conversationId TEXT,
      chargeid TEXT,
      cost TEXT,
      policyid TEXT
    )
  `);
}

module.exports = {
  createPermanentTables
};
