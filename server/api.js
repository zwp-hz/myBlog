const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('./db');

//必应每日壁纸
router.get('/api/bing', (req,res) => {
	let proxy_url = 'http://cn.bing.com/HPImageArchive.aspx?idx=0&n=1';
  	let options = {
        headers: {"Connection": "close"},
         url: proxy_url,
         method: "GET",
         json: true
  	};

	request(options, (error, response, data) => {
		if (!error && response.statusCode == 200) {
	        let imgs = data.match(/<url>(\S*)<\/url>/g);

	        imgs.forEach((itme,i) => {
	        	imgs[i] = "http://images.ioliu.cn/bing/" + itme.replace(/(<url>\/az\/hprichbg\/rb\/|<\/url>)/g,'').replace(/1366x768/g,'1920x1080');
	        })
	        res.status(200).jsonp({code: 0,data: imgs,message: "成功"}).end();
	    }
	});
});

//获取分类列表
router.get('/api/getCategoryList', (req,res) => {
	console.log(db.Category.find().exec());
	db.Category.find((err, doc) => {
		console.log(err,doc)
		if (doc) {
			res.status(200).jsonp({code: 0,data: doc,message: "成功"}).end();
	    }else {
	    	res.status(500).jsonp({code: 1,data: [],message: "请求有误"}).end();
	    }
	})
})

module.exports = router;