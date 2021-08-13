const { Op } = require('sequelize');
// http://localhost:5000/api/event/getAllEvents?limit=4&page=1&search=eventName:Node for testing

module.exports.pagination = req => {
  const limit = parseInt(req.query.limit, 10) || null;
  const offset = (parseInt(req.query.page, 10) - 1) * parseInt(req.query.limit, 10) || 0;
  let str; let
    order;
  if (req.query.sort) {
    str = req.query.sort.split(':');
    str[1] = str[1].toUpperCase();
    order = [str];
  } else {
    order = [];
  }
  const searchOpt = {};
  if (req.query.search) {
    const searchQuery = req.query.search.split(':');
    searchOpt[searchQuery[0]] = { [Op.iLike]: `${searchQuery[1]}%` };
  }
  return {
    searchOpt, limit, offset, order,
  };
};
