const express = require('express');
const router = express.Router();
const query = require('../db/mysql')//引入自定义模块
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extend: false })

router.get('/all', async (req, res) => {
    let str = `SELECT * FROM goods`;
    let data = await query(str);
    if (data.length) {
        result = {
            type: 1,
            datalist: data
        }
    } else {
        result = {
            type: 0,
        }
    }
    res.send(result);
});
router.get('/gid', async (req, res) => {
    let { gid } = req.query;
    let str = `SELECT * FROM goods WHERE gid=${gid}`;
    let data = await query(str);
    if (data.length) {
        result = {
            type: 1,
            datalist: data
        }
    } else {
        result = {
            type: 0,
        }
    }
    res.send(result);
});
router.get('/getlist', async (req, res) => {
    let { type, style } = req.query;
    if (type === "all") {
        let str = `SELECT * FROM goods `;
        let data = await query(str);
        if (data.length) {
            result = {
                type: 1,
                datalist: data
            }
        } else {
            result = {
                type: 0,
            }
        }
    } else {
        let str = `SELECT * FROM goods WHERE type='${type}' AND style='${style}'`;
        let data = await query(str);
        if (data.length) {
            result = {
                type: 1,
                datalist: data
            }
        } else {
            result = {
                type: 0,
            }
        }
    }
    res.send(result);
});
//react
router.get('/list', async (req, res) => {//GET静态路由传参   
    //前端传：第几页page 传数量 num
    let { page, num } = req.query;
    // console.log(page, num);

    page = page || 1;//设置默认值
    num = num || 6;//设置默认值
    let index = (page - 1) * num;

    let str = `SELECT * FROM goods  LIMIT ${index},${num}`;
    let data = await query(str);
    // console.log(data);

    let sql2 = ` SELECT * FROM goods `;
    let data2 = await query(sql2);

    let result = {};
    if (data.length) {
        // let pages = Math.ceil(data2.length / num);
        let pages = data2.length;
        //成功返回的数据
        result = {
            type: 1,
            msg: 'success',
            num,
            page,
            pages,
            datalist: data
        }
    } else {
        //失败返回的数据
        result = {
            type: 0,
            msg: 'error',
            datalist: []
        }
    }
    res.send(result);
});

router.delete('/remove', urlencodedParser, express.json(), async (req, res) => {
    let { gid } = req.query;
    // console.log(gid);
    let sql = `DELETE FROM goods WHERE  gid =${gid} `;
    let data = await query(sql);

    if (data.affectedRows) {
        // console.log(888);
        respons = {
            type: 1,
            msg: "success",
        }
    } else {
        respons = {
            type: 0,
            msg: "error",
        };
    };
    // console.log(respons);
    res.send(respons)
});
//

router.post('/add', urlencodedParser, express.json(), async (req, res) => {
    let { title, gname } = req.body;
    // console.log(title, gname)
    let sql = `INSERT INTO goods(gid,title,gname) VALUES (null,'${title}','${gname}')`;
    let data = await query(sql);
    if (data.affectedRows) {
        respons = {
            type: 1,
            msg: "success",
        }
    } else {
        respons = {
            type: 0,
            msg: "error",
        };
    };
    res.send(respons)
});
//

module.exports = router