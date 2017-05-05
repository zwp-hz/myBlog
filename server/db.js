const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/blog');
const db = mongoose.connection;

db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){console.log("mongo 链接成功");});

const categorySchema = new Schema({
    name: String
})

const TagSchema = new Schema({
    name: String
})

const articleSchema = new Schema({
  title: String,
  content: String,
  categories: Array,
  tags: Array,
  images_src: Array,
  browsing: Number,
  review: Number,
  creation_at: Date,
  update_at: Date
})

const Models = {
  Category: mongoose.model('categories', categorySchema),
  Tag: mongoose.model('tags', TagSchema),
  Article: mongoose.model('articles', articleSchema)
}

// let aaa = new Models.Article({
//   title: "javaScript 性能优化",
//   content: "模式定义了操作和属性，这些操作和属性包括mongoose自带和自定义，而模型和实例可以对模式里面定义的属性和方法进行引用。模型是mongoose用来和数据库直接打交道的中介，实例是往数据库存的真实数据。模式并非必须，那为什么要分开模式和模型呢？我觉得是遵循了软件设计中“定义和实现分开”这个原则。有的文章说模式没有操作数据库的能力，模型才有，对这个观点，我觉得部分对，虽说模式不能直接操作数据库，但模式定义的方法可以被模型用来操作数据库。官方文档是这么说的：",
//   categories: "代码,学习",
//   tags: ["javaScript"],
//   images_src: ["javaScript9.jpg"],
//   browsing: 300,
//   review: 2,
//   creation_at: 1493674210000,
//   update_at: 1493674210000
// })

// aaa.save();

module.exports = Models;