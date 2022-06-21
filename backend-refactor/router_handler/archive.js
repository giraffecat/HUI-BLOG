const db = require('../db/index')
const { responseClient } = require('../utils/util');

exports.getArchive = async (req, res) => {
  console.log("getArchive")
  let pagePerItem = 10;
  let curPage = req.query.current - 1;
  let queryAmount = `select count(*) as count from tb_article where is_delete != 1;`;
  let count = await new Promise(function(resolve, reject) {
      db.query(queryAmount, (err, results) => {
          // 以json的形式返回
          resolve(results)
      })
  })
  let query = `select id, article_title, create_time from tb_article where is_delete != 1 limit ${curPage}, ${pagePerItem};`;
  let result = await new Promise(function(resolve, reject) {
      db.query(query,  (err, results) => {
          // 以json的形式返回
          resolve(results)
      })
  })
  let data = {};
  data.count = count[0].count;
  data.recordList = result;
  responseClient(res, 200, 3, "成功", data);
}
