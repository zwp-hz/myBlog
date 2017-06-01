const express = require('express');
const router = express.Router();
const request = require('request');
const http = require('http');
const db = require('./db');
const common = require('./common');

//必应每日壁纸
router.get('/api/bing', (req,res) => {
	let proxy_url = 'http://cn.bing.com/HPImageArchive.aspx?idx=0&n=1';
  	let options = {
        url: proxy_url,
        headers: {"Connection": "close"},
        method: "GET",
        json: true
  	};

	request(options, (error, response, data) => {
		if (!error && response && response.statusCode == 200) {
	        let imgs = data.match(/<url>(\S*)<\/url>/g);

	        imgs.forEach((item,i) => {
	        	imgs[i] = "http://images.ioliu.cn/bing/" + item.replace(/(<url>\/az\/hprichbg\/rb\/|<\/url>)/g,'').replace(/1366x768/g,'1920x1080');
	        })
	        return res.status(200).jsonp({code: 0,data: imgs,message: "成功"}).end();
	    }
	});
});

//获取天气信息
router.get('/api/getWeather',(req,res) => {
    var ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    ip = "115.236.163.114";

	getWeatherInfo(ip, function(err, msg) {
	    if (err) {
	    	return res.status(200).jsonp({code: 1,data: [],message: err}).end();
	    } else {
	    	return res.status(200).jsonp({code: 0,data: msg,message: "成功"}).end();
	    }
	})
})

//获取分类列表
router.get('/api/getCategoryList', (req,res) => {
	db.Category.find((err, doc) => {
		if (doc) {
			return res.status(200).jsonp({code: 0,data: doc,message: "成功"}).end();
	    }else {
	    	return res.status(500).jsonp({code: 1,data: [],message: "请求有误"}).end();
	    }
	})
})

//获取标签列表
router.get('/api/getTagsList', (req,res) => {
	db.Tag.find((err, doc) => {
		if (doc) {
			return res.status(200).jsonp({code: 0,data: doc,message: "成功"}).end();
	    }else {
	    	return res.status(500).jsonp({code: 1,data: [],message: "请求有误"}).end();
	    }
	})
})

//获取文章列表
router.get('/api/getArticlesList', (req,res) => {
	let per_page = 10, countNum = 0,
		criteria = {}, fields = {}, options = {sort: {browsing: -1},limit: per_page},
		categories = req.param("categories"),
		searchCnt = req.param("searchCnt"),
		_id = req.param("_id"),
		reg = new RegExp(searchCnt, 'i'),
		page = Number(req.param("page"));

	/**
	  * @type 	hot: "最新更改文章", categories: "文章类别"
	 */
	if (_id) {
		criteria = {_id: _id};	
		//增加访问数
		db.Article.update(criteria,{$inc: {browsing: 1}},(err, doc) => {});
	} else if (req.param("type") === "hot") {
		fields = {title: 1,images_src: 1,categories: 1,review: 1};
		options = {sort: {'update_at': -1},limit: 3};
	} else if (categories && categories != "全部") {
		criteria = {categories: {$in: [categories]}};
		options.skip = (page - 1) * per_page;
	} else {
		options.skip = (page - 1) * per_page;
	}

	if (searchCnt) {
		criteria.$or = [
			{title: {$regex: reg}},
			{categories: {$in: [searchCnt]}}
		];
	}

	//获取文章
	db.Article.count(criteria,(err, doc) => {
		//文章总数
		countNum = doc;

		db.Article.find(criteria,fields,options,(error, data) => {
			if (data) {
				return res.status(200).jsonp({code: 0,data: {
					current_page: page,
					data: data,
					last_page: Math.ceil(countNum / per_page)
				},message: "成功"}).end();
		    }else {
		    	return res.status(500).jsonp({code: 1,data: [],message: "请求有误"}).end();                                                                                                                                                                                                                                                                                                                                       
		    }
		})
	})
})

//获取天气信息
let getWeatherInfo = (ip, cb) => {
    let sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + ip,
    	weather_server = 'http://wthrcdn.etouch.cn/WeatherApi?citykey=',
    	weatherJson = {wendu: /<wendu>(\S*)<\/wendu>/g,sunrise_1: /<sunrise_1>(\S*)<\/sunrise_1>/g,sunset_1: /<sunset_1>(\S*)<\/sunset_1>/g,type: /<type>([\u4e00-\u9fa5]*)<\/type>/g};

    http.get(sina_server, (res) => {
        if (res && res.statusCode == 200) {
            res.on('data', function(data) {
                try {
                	let param = JSON.parse(data);

                	request({
				        url: weather_server + common.cityKey[param.province][param.city],
				        headers: {"Connection": "close"},
				        method: "GET",
				        gzip: true
				  	},(error, response, data) => {
				  		if (!error && response && response.statusCode == 200) {

				  			//中文转换拼音
				  			for (var i in weatherJson) {
				  				weatherJson[i] = data.match(weatherJson[i]);
				  				
				  				if(i === "type")
				  					weatherJson[i].splice(2,10);

				  				weatherJson[i].forEach((item,j) => {
				  					if (i === "type") {
				  						weatherJson[i][j] = common.getInitials(item.replace(new RegExp("(<wendu>|<\/wendu>|<sunrise_1>|<\/sunrise_1>|<sunset_1>|<\/sunset_1>|<type>|<\/type>)","g"),""));
				  					} else {
				  						weatherJson[i] = item.replace(new RegExp("(<wendu>|<\/wendu>|<sunrise_1>|<\/sunrise_1>|<sunset_1>|<\/sunset_1>|<type>|<\/type>)","g"),"");
				  					}
				  				});
				  			}

				  			weatherJson.time = new Date().getTime();
				  			weatherJson.city = param.city;

				  			cb(error,weatherJson)
				  		} else {
				  			cb(error);
				  		}
				  	});
                } catch (err) {
                    cb(err);
                }
            });
        } else {
            cb({ code: code });
        }
    }).on('error', (e) => { cb(e); });
};

module.exports = router;