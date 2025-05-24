async function insertPolicyData(client, conversationId, policyData) {
  // הכנסת פוליסה
  await client.query(
    `INSERT INTO policies (conversationId, policyid, name, subname)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (conversationId, policyid) DO NOTHING`,
    [conversationId, policyData.policyid, policyData.name, policyData.subname]
  );

  // הכנסת חיובים
  for (const charge of policyData.listCharges || []) {
    await client.query(
      `INSERT INTO charges (conversationId, chargeid, cost, policyid)
       VALUES ($1, $2, $3, $4)`,
      [conversationId, charge.chargeid, charge.cost, policyData.policyid]
    );
  }
}

async function dropTempTables(client, conversationId) {
  await client.query(`DELETE FROM charges WHERE conversationId = $1`, [conversationId]);
  await client.query(`DELETE FROM policies WHERE conversationId = $1`, [conversationId]);
}

module.exports = {
  insertPolicyData,
  dropTempTables,
};
