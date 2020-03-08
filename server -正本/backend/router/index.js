//001-先引用模块
const express = require('express');
const router = express.Router();//路由设置

const userRouter = require('./user');
const goodsRouter = require('./goods');
const cartRouter = require('./cart');

const bodyparser = require('body-parser')//引入

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,GET,DELETE,OPTIONS");

    // 跨域请求CORS中的预请求
    if (req.method == "OPTIONS") { //特殊请求：发送了请求头的那些请求
        res.sendStatus(200); /*让options请求快速返回*/
    } else {
        next();
    }
})

router.use('/user', userRouter);
router.use('/goods', goodsRouter);
router.use('/cart', cartRouter);


module.exports = router;