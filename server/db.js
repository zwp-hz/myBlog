const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/blog');
const db = mongoose.connection;

db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
	console.log("mongo 链接成功");
});

const categorySchema = new Schema({
  name: String
})

const articleSchema = new Schema({
  title: String,
  date: Date,
  content: String,
  type: Array,
  cover: Array,
  previewNum: Number,
  commentNum: Number
})

const Models = {
  Category: mongoose.model('category', categorySchema),
  Article: mongoose.model('article', articleSchema)
}

module.exports = Models;