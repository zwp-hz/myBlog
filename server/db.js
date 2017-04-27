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

module.exports = Models;