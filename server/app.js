var express = require('express')
var cors = require('cors')
var fs = require('fs')
var bodyParser = require('body-parser')

var app = express()

app.use(cors())

app.use(express.static('public'))
// const upload_dir = path.resolve(__dirname, './uploads/images')

// 处理请求的content-type为:application/json
app.use(bodyParser.json())
// 处理请求的content-type为:application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

app.post('/search', (req, res) => {
  const search = req.body
  console.log(search)
  var category = search.category
  fs.readFile('./db.json', (err, msg) => {
    let content = JSON.parse(msg)
    if (content.hasOwnProperty(category)) {
      res.send({
        code: 0,
        data: content[category]
      })
    } else {
      res.send({
        code: 1,
        msg: '抱歉！没有搜到相关信息！',
        search: search
      })
    }
  })
})


app.post('/searchName', (req, res) => {
  const searchName = req.body
  console.log(searchName.id)
  res.send({
    code: 0,
    data: searchName.id
  })
})

app.listen(6060, () => {
  console.log('server is running')
})

// app.get('/search', (req, res) => {
//   const search = req.query
//   console.log(search)
//   // res.send({
//   //   data: user
//   // })
//   fs.readFile('./db.json', (err, msg) => {
//     let content = JSON.parse(msg)
//     console.log(content)
//     // var address = content.a.address.name.find((item) => {
//     //   return item.name === msg.name
//     // })
//     if (search.category in content) {
//       res.send({
//         code: 0,
//         data: content
//       })
//     } else {
//       res.send({
//         code: 1,
//         msg: '抱歉！没有搜到相关信息！',
//         search: content
//       })
//     }
//   })
// })