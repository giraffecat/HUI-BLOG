const db = require('../db/index')
const { responseClient } = require('../utils/util');

exports.getTag = async (req, res) => {
  let query = `select id, tag_name as tagName from tb_tag;`;
  let promise = new Promise(function(resolve, reject) {
      db.query(query, (err, results) => {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  }).then(data => {
      responseClient(res, 200, 3, "成功", data)
  })
}