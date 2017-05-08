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
//   title: "猫咪猫咪猫咪",
//   content: "猫咪[1]  喜欢孤独而自由地活动。除发情交配外，很少三五成群地一起栖息。猫的本性是不认特定的主人的。但是，当猫在一个家庭被饲养一段时间，在主人的关怀、训练和调教下，孤独习性也是可以改变的，并能最终与主人建立感情；在这个过程中，它会对主人家庭与其周围环境建立起一个属于自己领地范围的概念，不允许其他猫进入自己的领地，一旦有入侵者，就会立即发起攻击。",
//   categories: [ 
//         "生活"
//     ],
//   tags: [ 
//         "生活"
//     ],
//   images_src: ["maomi1.jpg"],
//   browsing: 10,
//   review: 0,
//   creation_at: 1494245770000,
//   update_at: 1494245770000
// })

// aaa.save();

module.exports = Models;