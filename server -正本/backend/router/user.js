const express = require('express');
const router = express.Router();
const query = require('../db/mysql')//引入自定义模块
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extend: false })
const { create, verify } = require('./token');
const multer = require('multer');
//配置文件上传的目录,无则自动创建
// var upload = multer({ dest: 'upload' })

// const formidable = require('formidable');
//重命名图片
var storage = multer.diskStorage({
    // destination: function (req, file, cd) {
    //     cd(null, 'uploads')//配置文件上传的目录,不会自动创建
    // },
    destination: 'uploads',//配置文件上传的目录,无则自动创建
    filename: function (req, file, cd) {
        let arr = file.originalname.split('.');
        cd(null, arr[0] + '-' + Date.now() + '.' + arr[1])
    }
})
var upload = multer({ storage });

router.post('/reg', urlencodedParser, express.json(), async (req, res) => {
    let { name, password, nc, phone } = req.body;
    let sql2 = `SELECT * FROM user  WHERE name='${name}'`
    let data2 = await query(sql2);
    if (!data2.length) {
        let sql = `INSERT INTO user(uid,name,password,nc, phone,touxiang) VALUES (null,'${name}','${password}','${nc}',${phone},null)`;
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
    } else {
        respons = {
            type: 0,
            msg: "用户名已存在",
        };
    }

    res.send(respons)
});
//

router.get('/getmine', async (req, res) => {
    let { uid } = req.query;
    let sql = `SELECT * FROM user  WHERE uid=${uid}`;
    let data = await query(sql);
    if (data.length) {
        respons = {
            type: 1,
            msg: "success",
            datalist: data
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

router.post('/login', urlencodedParser, express.json(), async (req, res) => {
    let { name, password } = req.body;
    // console.log(name, password)
    let sql = `SELECT * FROM user  WHERE name='${name}'`
    let data = await query(sql);
    if (data.length) {
        let sql2 = `SELECT * FROM user  WHERE password='${password}'`
        let data2 = await query(sql2);
        if (data2.length) {
            let sql = `SELECT * FROM user  WHERE name='${name}'`
            let data = await query(sql);
            let token = '';
            token = create(password);
            respons = {
                type: 1,
                token,
                name,
                uid: data[0].uid,
                msg: "success",
            }
        } else {
            respons = {
                type: 0,
                msg: "密码不正确！",
            };
        };
    } else {
        respons = {
            type: 0,
            msg: "用户名不存在！",
        };
    }

    res.send(respons)
});
router.get('/verify', (req, res) => {
    let { token } = req.query;
    let result = verify(token);
    let respons = {};
    if (result) {
        respons = {
            type: 1,
            msg: '校验通过'
        }
    } else {
        respons = {
            type: 0,
            msg: '校验失败'
        }
    }
    res.send(respons);
});

//上传图片
router.post("/upload", upload.single('file'), async (req, res) => {
    // console.log(req.file)
    //upload.single()接受单个文件，会帮你保存在req的file属性里面
    let url = req.file.path.split("\\");
    url = "http://localhost:1022/uploads/" + url[1]
    let sql = `UPDATE user SET touxiang = '${url}' WHERE  uid = ${uid}`;
    let data = await query(sql);
    let data2 = {
        url,
        mes: '上传成功'
    }
    // console.log(data.url)
    res.send(data2)
})
//
router.get('/site', async (req, res) => {
    let { uid } = req.query;
    let sql = `SELECT * FROM site  WHERE uid=${uid}`;
    let data = await query(sql);
    if (data.length) {
        respons = {
            type: 1,
            msg: "success",
            datalist: data
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
router.post('/addsite', urlencodedParser, express.json(), async (req, res) => {
    let { uid, name, diqu, dizhi, phone } = req.body;
    let sql = `INSERT INTO site(uid, name, diqu, dizhi, phone,checked) VALUES (${uid},'${name}','${diqu}','${dizhi}',${phone},0)`;
    let data = await query(sql);
    let sql2 = `SELECT * FROM site  WHERE uid=${uid}`;
    let data2 = await query(sql2);
    if (data2.length) {
        respons = {
            type: 1,
            msg: "success",
            datalist: data2
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