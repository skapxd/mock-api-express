const getSource = require('../get-source');

function evaluateWhereCondition(where, inValue, req) {
  if (!where || !inValue) return false;

  const source = getSource(inValue, req);

  return Object.keys(where).every(key => source[key] == where[key]);
}

module.exports = evaluateWhereCondition;