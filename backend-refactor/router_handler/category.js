const db = require('../db/index')
const { responseClient } = require('../utils/util');

exports.getCategory = async (req, res) => {
  let query = `select id, category_name, 0 as article_count from tb_category where id NOT IN (select category_id from tb_article GROUP BY category_id) 
  UNION 
  select tb_category.id, category_name, count(*) as article_count from tb_category JOIN tb_article on category_id = tb_category.id where is_delete != 1 GROUP BY category_name, tb_category.id;`;
  let result = await new Promise(function(resolve, reject) {
      db.query(query, (err, results) => {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  let data = {};
  data.count = result.length;
  data.recordList = result;
  responseClient(res, 200, 3, "成功", data);
}

exports.getCategoryById = async (req, res) => {
  let pagePerItem =6;
  let curPage = (req.query.current - 1) * pagePerItem;
  let queryName = `select category_name from tb_category where id = ${req.params.id} `;
  let categoryName =  await new Promise(function(resolve, reject) {
      db.query(queryName, (err, results) => {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  console.log("categoryName",categoryName[0].category_name);
  let query = `select article_cover, article_title, category_id, category_name, tb_article.create_time, tb_article.id from tb_article join tb_category on tb_article.category_id = tb_category.id where category_id = ${req.params.id} and is_delete != 1 limit ${curPage}, ${pagePerItem};`
  // let query = `select * from display_bank_stats;`;
  let articles =  await new Promise(function(resolve, reject) {
      db.query(query, (err, results) => {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  //接下来增加tags
  for(let article of articles){
      let query = `select tag_id, tag_name from tb_article_tag join tb_tag on tb_article_tag.tag_id = tb_tag.id where tb_article_tag.article_id = ${article.id}` 
      let tags =  await new Promise(function(resolve, reject) {
          db.query(query, (err, results) => {
              // 以json的形式返回
              //判断是不是admin
              resolve(results)
          })
      })
      article.tagDTOList = tags;
  }
  let data = {};

  data.articlePreviewDTOList = articles;
  data.name = categoryName[0].category_name;
  
  responseClient(res, 200, 3, "成功", data);
}

exports.getCategoryByAdmin = async (req, res) => {
  let query = `select id, category_name as categoryName from tb_category;`;
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

exports.AdminGetCategoryList = async (req, res) => {
    //获取分类列表
    let size = req.query.size;
    let current = (req.query.current - 1) * size;
    let query = `select id, category_name as categoryName, create_time as createTime from tb_category limit ${current}, ${size}`; 
    let categories = await new Promise(function(resolve, reject) {
        db.query(query, (err, results) => {
            // 以json的形式返回
            //判断是不是admin
            resolve(results)
        })
    })
    //获取文章分类数量
    let count =  await new Promise(function(resolve, reject) {
    let queryCount = `select count(*) as count from tb_category`
        db.query(queryCount, (err, results) => {
        // 以json的形式返回
        //判断是不是admin
        resolve(results)
        })
    })
    let data = {};
    //获取分类对应文章数量
    for(let i = 0; i < categories.length; i++) {
        let queryArticleCount = `select count(*) as count from tb_article where category_id = ${categories[i].id} and is_delete != 1`;
        let count =  await new Promise(function(resolve, reject) {
            db.query(queryArticleCount, (err, results) => {
            // 以json的形式返回
            //判断是不是admin
            resolve(results)
            })
        })
        categories[i].articleCount = count[0].count;
    }
    data.recordList = categories;
    data.count = count[0].count
    console.log("data",data)
    responseClient(res, 200, 3, "成功", data)
}

exports.AdminAddCategory = async (req, res) => {
    //检查重复category
    let sqlStr = `select * from tb_category where category_name='${req.body.categoryName}'`;
    let duplicate = await new Promise(function(resolve, reject) {
        db.query(sqlStr, (err, results) => {
            // 执行 SQL 语句失败
            if (err) {
                return responseClient(res, 200, 3, "失败", err, false)
            }
            // 判断category名是否被占用
            if (results.length > 0) {
                return responseClient(res, 200, 3, "分类名被占用，请更换其他分类名！", {}, false)
            }
            resolve(results)
        })
    })
    console.log("asdasda")

    //新增category
    let addCateQuery = `INSERT INTO tb_category(category_name, create_time) VALUES('${req.body.categoryName}', NOW())`;
    let result = await new Promise(function(resolve, reject) {
        db.query(addCateQuery, (err, results) => {
            // 判断 SQL 语句是否执行成功
            console.log("asdasda")
            if (err) return responseClient(res, 200, 3, "失败", err, false)
            if (results.affectedRows !== 1) return responseClient(res, 200, 3, "新增分类失败", err, false)
            //新增分类成功
            return responseClient(res, 200, 3, "新增分类成功", results, true)
        })
    })
}