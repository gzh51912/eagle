const express = require('express');
const router = express.Router();
const query = require('../db/mysql')//引入自定义模块
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extend: false })

router.post('/addcart', urlencodedParser, express.json(), async (req, res) => {
    let { uid, gid, gitem, num } = req.body;
    if (!gitem) gitem = "";
    let str = `SELECT * FROM cart WHERE uid=${uid} AND gid=${gid}`;
    let data = await query(str);
    if (!data.length) {
        let str = `SELECT * FROM goods WHERE  gid=${gid}`;
        let data = await query(str);
        let { title, price, imga } = data[0];
        let sql2 = `INSERT INTO cart(cid,uid,gid,title,gitem,price, num,img,checked) VALUES (null,${uid},${gid},'${title}','${gitem}',${price},${num},'${imga}',0)`;
        let data2 = await query(sql2);
        if (data2.affectedRows) {
            result = {
                type: 1
            }
        } else {
            result = {
                type: 0
            }
        }
    } else {
        let str = `UPDATE cart SET num = num + ${num} WHERE  uid = ${uid} AND gid=${gid}`;
        let data = await query(str);
        if (data.affectedRows) {
            result = {
                type: 1
            }
        } else {
            result = {
                type: 0
            }
        }
    }
    res.send(result);
});
//
router.get('/getcart', async (req, res) => {
    let { uid } = req.query;
    let str = `SELECT * FROM cart WHERE uid=${uid} `;
    let data = await query(str);
    if (data.length) {
        result = {
            type: 1,
            datalist: data
        }
    } else {
        result = {
            type: 0
        }
    }

    res.send(result);
});
//
router.put('/putcart', urlencodedParser, express.json(), async (req, res) => {
    let { number, uid, gid } = req.body;
    let str = `UPDATE cart SET num = num + ${number} WHERE uid = ${uid} AND gid = ${gid}`;
    let data = await query(str);
    if (data.affectedRows) {
        let str2 = `SELECT * FROM cart WHERE uid=${uid} `;
        let data2 = await query(str2);
        result = {
            type: 1,
            datalist: data2
        }
    } else {
        result = {
            type: 0
        }
    }

    res.send(result);
});
//
router.delete('/daletecart', async (req, res) => {
    let { uid, gid } = req.query;
    let sql = `DELETE FROM cart WHERE uid=${uid} AND gid in(${gid}) `;
    let data = await query(sql);
    if (data.affectedRows) {
        let str2 = `SELECT * FROM cart WHERE uid=${uid} `;
        let data2 = await query(str2);
        result = {
            type: 1,
            datalist: data2
        }
    } else {
        result = {
            type: 0
        }
    }

    res.send(result);
});

module.exports = router