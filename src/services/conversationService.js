const { pool } = require('../db');

function getTableNames(conversationId) {
  return {
    policiesTable: `temp_policies_${conversationId}`,
    chargesTable: `temp_charges_${conversationId}`,
  };
}

async function createTempTables(client, conversationId) {
  const { policiesTable, chargesTable } = getTableNames(conversationId);

  await client.query(`
    CREATE TEMP TABLE IF NOT EXISTS ${policiesTable} (
      policyid TEXT PRIMARY KEY,
      name TEXT,
      subname TEXT
    ) ON COMMIT PRESERVE ROWS;
  `);

  await client.query(`
    CREATE TEMP TABLE IF NOT EXISTS ${chargesTable} (
      chargeid TEXT,
      cost TEXT,
      policyid TEXT
    ) ON COMMIT PRESERVE ROWS;
  `);

  return { policiesTable, chargesTable };
}

async function insertPolicyData(client, conversationId, policyData) {
  const { policiesTable, chargesTable } = await createTempTables(client, conversationId);

  // הכנס את הפוליסה
  await client.query(
    `INSERT INTO ${policiesTable} (policyid, name, subname) VALUES ($1, $2, $3)
     ON CONFLICT (policyid) DO NOTHING`,
    [policyData.policyid, policyData.name, policyData.subname]
  );

  // הכנס את החיובים
  for (const charge of policyData.listCharges || []) {
    await client.query(
      `INSERT INTO ${chargesTable} (chargeid, cost, policyid) VALUES ($1, $2, $3)`,
      [charge.chargeid, charge.cost, policyData.policyid]
    );
  }
}

async function dropTempTables(client, conversationId) {
  const { policiesTable, chargesTable } = getTableNames(conversationId);

  await client.query(`DROP TABLE IF EXISTS ${chargesTable}`);
  await client.query(`DROP TABLE IF EXISTS ${policiesTable}`);
}

module.exports = {
  insertPolicyData,
  dropTempTables,
};
