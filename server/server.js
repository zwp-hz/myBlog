const express = require('express')
const router = express.Router()
const app = express()
const request = require('request')

//必应每日壁纸
router.get('/bing', (req,res,next) => {
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
	        res.status(200).jsonp({code:0,data:imgs,message:"成功"}).end();
	    }
	});
});

app.use(router);
app.listen(8989, function () {
  console.log('Visit http://localhost:8989')
});