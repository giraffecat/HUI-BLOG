const db = require('../db/index')
const { responseClient } = require('../utils/util');

exports.getMenu = async (req, res) => {
    console.log("get/menu")
    let query = `select * from tb_menu`;
    let promise = new Promise(function(resolve, reject) {
        db.query(query, (err, results) => {
            // 以json的形式返回
            //判断是不是admin
            resolve(results)
        })
    }).then(data => {
        //只有两层嵌套
        let map = new Map();
        data.forEach(item => {
            if(item.parent_id == null) {
                map.set(item.id, item);
            } 
        })
        data.forEach(item => {
            if(item.parent_id != null) {
                let parent = map.get(item.parent_id);
                if(!parent.children) {
                    parent.children = [];
                } 
                parent.children.push(item)
                map.set(item.parent_id, parent);
            }
        })
        //已经找到所有的映射关系 开始映射
        
        data = Array.from(map.values())
        // console.log("menu",data)
        responseClient(res, 200, 3, "成功", data);
    })
}

exports.getMenuByAdmin = async (req, res) => {
    console.log("get admin ")
    let query = `select * from tb_menu`;
    let promise = new Promise(function(resolve, reject) {
        db.query(query, (err, results) => {
            // 以json的形式返回
            //判断是不是admin
            resolve(results)
        })
    }).then(data => {
        //只有两层嵌套
        let map = new Map();
        data.forEach(item => {
            if(item.parent_id == null) {
                map.set(item.id, item);
            } 
        })
        data.forEach(item => {
            if(item.parent_id != null) {
                let parent = map.get(item.parent_id);
                if(!parent.children) {
                    parent.children = [];
                } 
                parent.children.push(item)
                map.set(item.parent_id, parent);
            }
        })
        //已经找到所有的映射关系 开始映射
        
        data = Array.from(map.values())
        // console.log("menu",data)
        responseClient(res, 200, 3, "成功", data);
    })
}