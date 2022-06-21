const db = require('../db/index')
const { responseClient } = require('../utils/util');

//操作文件
const fs = require("fs");

// 获取全部文章的处理函数
exports.getArticles = async (req, res) => {
  console.log("req",req.query.current)
  let startPos = (req.query.current - 1) * req.query.paginationLimit;
  let query = `select article_cover, article_title, article_content, category_id, category_name, tb_article.create_time, tb_article.id, is_top,type from tb_article join tb_category where tb_article.category_id = tb_category.id and is_delete != 1 limit ${startPos}, ${req.query.paginationLimit}`
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
    responseClient(res, 200, 3, "成功", articles);
}


exports.getArticleById = async (req, res) => {
  // console.log("article/:id",req.params.id)
  let query = `select article_cover, article_title, article_content, category_id, category_name, tb_article.create_time, tb_article.id, is_top,type from tb_article join tb_category on tb_article.category_id = tb_category.id where tb_article.id = ${req.params.id} and is_delete != 1`
  let article =  await new Promise(function(resolve, reject) {
      db.query(query, (err, results) =>  {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  //接下来增加tags
  let queryTag = `select tag_id, tag_name from tb_article_tag join tb_tag on tb_article_tag.tag_id = tb_tag.id where tb_article_tag.article_id = ${req.params.id}` 
  let tags =  await new Promise(function(resolve, reject) {
      db.query(queryTag, (err, results) =>  {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  //增加前一篇文章和后一篇文章
  let queryPrev = `select id, article_cover, article_title from tb_article where id = (select max(id) from tb_article where id < ${req.params.id}) and is_delete != 1; ` 
  let prevArticle =  await new Promise(function(resolve, reject) {
      db.query(queryPrev, (err, results) =>  {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })

  let queryLast = `select id, article_cover, article_title from tb_article where id = (select min(id) from tb_article where id > ${req.params.id}) and is_delete != 1;` 
  let lastArticle =  await new Promise(function(resolve, reject) {
      db.query(queryLast, (err, results) =>  {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })

  //最新文章
  let queryNewest = `select id, article_cover, article_title from tb_article where is_delete != 1 ORDER BY create_time DESC limit 5;` 
  let newArticle =  await new Promise(function(resolve, reject) {
      db.query(queryNewest, (err, results) =>  {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  let data = {};
  data = article[0];
  data.tagDTOList = tags;
  data.prevArticle = {};
  data.lastArticle = {};
  if(prevArticle[0]) {
      data.prevArticle = prevArticle[0];
  }
  if(lastArticle[0]) {
      console.log("存在")
      data.lastArticle = lastArticle[0];
  }
  data.newestArticleList = newArticle;
  //怎么搜索前一章和后一章
  // console.log(data)
  responseClient(res, 200, 3, "成功", data);
}

exports.getArticleStats = async (req, res) => {
  let query = `select count(*) as articleNum from tb_article where is_delete != 1;`;
  let count = await new Promise(function(resolve, reject) {
      db.query(query,  (err, results) => {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  responseClient(res, 200, 3, "成功", count);
}

exports.upLoadArticleImage = async (req, res) => {
  // console.log("req",req.file.path)
  fs.rename(req.file.path, "./uploads/"+req.file.originalname, function(err) {
      if (err) {
          throw err;
      }
      console.log('done!');
  })
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    let data = "http://" + req.headers.host + "/" +req.file.originalname
    responseClient(res, 200, 3, "成功", data)
  }
}


exports.addNewArticle = async (req, res) => {
  console.log("body data",req.body)
  //先找category id
  let query_category = `select id from tb_category where category_name = '${req.body.categoryName}' `
  let category_id = await new Promise(function(resolve, reject) {
      db.query(query_category, (err, results) => {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  let catetegory_id = category_id[0].id;
  let article = req.body;
  let article_id;
  if(article.id) {
    article_id = article.id;
    //更新文章
    let updateQuery = `UPDATE tb_article SET article_title='${article.articleTitle}',article_content='${article.articleContent}', article_cover='${article.articleCover}',category_id=${catetegory_id},original_url='${article.originalUrl}',is_top=${article.isTop},status=${article.status},type=${article.type},update_time=Now() WHERE id=${article_id};`
    console.log("updateQuery",updateQuery)
    let updateResult = await new Promise(function(resolve, reject) {
      // console.log(query)
      db.query(updateQuery, (err, results) => {
        // 以json的形式返回
        //判断是不是admin
        if (err) return responseClient(res, 200, 3, "执行SQL语句失败", {}, false);
        resolve(results)
      })
    })
    console.log("updateResult",updateResult)
    // 判断影响的行数
    if (updateResult.affectedRows !== 1) return  responseClient(res, 200, 3, "更新失败", data, false);

    //删除标签
    let DeleteTagsQuery = `DELETE FROM tb_article_tag WHERE article_id = ${article_id}`;
    let DeleteResult = await new Promise(function(resolve, reject) {
      // console.log(query)
      db.query(DeleteTagsQuery, (err, results) => {
        // 以json的形式返回
        //判断是不是admin
        if (err) return responseClient(res, 200, 3, "执行SQL语句失败", {}, false);
        resolve(results)
      })
    })
    
  } else {
    //新增文章
    let query = `INSERT INTO tb_article(user_id, category_id, article_cover, article_title, article_content, type, original_url, is_top, is_delete, status, create_time, update_time) VALUES(1, ${catetegory_id}, '${article.articleCover}', '${article.articleTitle}', '${article.articleContent}', 1, '${article.originalUrl}', ${article.isTop}, 0, ${article.status}, NOW(), NOW())`;
    let insertData = await new Promise(function(resolve, reject) {
        // console.log(query)
      db.query(query, (err, results) => {
        // 以json的形式返回
        //判断是不是admin
        resolve(results)
      })
    })
    article_id = insertData.insertId;
  }

  for(let i = 0; i < req.body.tagNameList.length; i++) {
    req.body.tagNameList[i] = "'" + req.body.tagNameList[i] + "'";
  }
  let tagNameList = req.body.tagNameList.join(",");
  //查询标签
  let queryTag = `select id from tb_tag where tag_name IN (${tagNameList})`
  let tags = await new Promise(function(resolve, reject) {
    db.query(queryTag, (err, results) => {
        // 以json的形式返回
        //判断是不是admin
        resolve(results)
    })
  })
  // console.log("tags", tags)
  let value = [];
  for(let item of tags) {
      let temp = []
      temp.push(article_id);
      temp.push(item.id);
      let str = temp.join(',');
      str = "(" + str + ")";
      value.push(str);
  }
  let value_str = value.join(",")
  let queryTags = `insert INTO tb_article_tag(article_id, tag_id) VALUES ${value_str}`
  let insertTags = await new Promise(function(resolve, reject) {
    db.query(queryTags, (err, results) => {
        resolve(results)
    })
    //插入标签
  })
  responseClient(res, 200, 3, "成功", {})
}

// 管理员获取文章的处理函数
exports.getArticlesByAdmin = async (req, res) => {
  let paginationLimit = req.query.size;
  let startPos = (req.query.current - 1) * paginationLimit;
  let query = `select article_cover, article_title, article_content, category_id, category_name, tb_article.create_time, tb_article.id, is_top, type, is_delete, status from tb_article join tb_category where tb_article.category_id = tb_category.id and is_delete != 1 limit ${startPos}, ${paginationLimit}`
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
    //获取文章count
    let count =  await new Promise(function(resolve, reject) {
    let queryCount = `select count(*) as count from tb_article where is_delete != 1`
      db.query(queryCount, (err, results) => {
        // 以json的形式返回
        //判断是不是admin
        resolve(results)
      })
    })

    let data = {};
    data.recordList = articles;
    data.count = count[0].count;
    responseClient(res, 200, 3, "成功", data);
}

// 管理员根据获取文章的处理函数
exports.getArticlesByIdAdmin = async (req, res) => {
  // console.log("/admin/article/:id",req.params.id)
  let query = `select article_cover, original_url, status, type, article_title, article_content, category_id, category_name, tb_article.create_time, tb_article.id, is_top,type from tb_article join tb_category on tb_article.category_id = tb_category.id where tb_article.id = ${req.params.id}`
  let result =  await new Promise(function(resolve, reject) {
      db.query(query, (err, results) =>  {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  let article = result[0];
  // console.log("article",article)
  //获取文章tags
  let queryTags = `select tag_name from tb_article_tag join tb_tag on tb_article_tag.tag_id = tb_tag.id where tb_article_tag.article_id = ${article.id}` 
  // console.log(queryTags)
  let tags =  await new Promise(function(resolve, reject) {
      db.query(queryTags, (err, results) => {
          // 以json的形式返回
          //判断是不是admin
          resolve(results)
      })
  })
  let tag_name_list = [];
  for(let i = 0; i < tags.length; i++) {
    tag_name_list.push(tags[i].tag_name);
  }
  article.tag_name_list = tag_name_list;

  /*
   article: {
        id: null,
        articleTitle: this.$moment(new Date()).format("YYYY-MM-DD"),
        articleContent: "",
        articleCover: "",
        categoryName: null,
        tagNameList: [],
        originalUrl: "",
        isTop: 0,
        type: 1,
        status: 1
      }
  */
  let data = {
    id: article.id,
    articleTitle: article.article_title,
    articleContent: article.article_content,
    articleCover: article.article_cover,
    categoryName: article.category_name,
    tagNameList: article.tag_name_list,
    originalUrl: article.original_url,
    isTop: article.is_top,
    type: article.type,
    status: article.status
  };
  responseClient(res, 200, 3, "成功", data);
}

exports.UpdateDeleteByAdmin = async (req, res) => {
  console.log("UpdateDelteByAdmin data",req.body.idList)
  //update article Delete status
  let query = `update tb_article set is_delete=1 where id IN (${req.body.idList})`
  let results =  await new Promise(function(resolve, reject) {
    db.query(query, (err, results) => {
        // 以json的形式返回
        //判断是不是admin
        if (err) reject(err);
        resolve(results);
    })
  })
  if (results.affectedRows < 1) return responseClient(res, 200, 3, "新增分类失败", results, false)
  //新增分类成功
  return responseClient(res, 200, 3, "新增分类成功", results, true)
}