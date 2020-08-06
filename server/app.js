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
  var city = searchName.id
  console.log(city)
  var cityId
  var url
  if (city == '澳门') {
    cityId = 'Aomen'
    url = 'url(../images/aomen.jpg)'
  } else if (city == '亚琛') {
    cityId = 'Aachen'
    url = 'url(../images/yatan.jpg)'
  } else if (city == '奥胡斯') {
    cityId = 'Aarhus'
    url = 'url(../images/Aarhus.jpg)'
  } else if (city == '阿尔高州') {
    cityId = 'Aargau'
    url = 'url(../images/Aargau.jpg)'
  }
  res.send({
    code: 0,
    data: {
      id: city,
      eId: cityId,
      src: url
    }
  })
})

app.post('/detialLocalHot', (req, res) => {
  const title = req.body
  var address = title.address
  console.log(address)
  var localHot
  fs.readFile('./hot.json', function (err, msg) {
    if (err) {
      res.status(500).send(err)
    }
    var hot = JSON.parse(msg)
    console.log(hot)
    // 判断数据库中是否有搜索的内容
    // if (hot.hasOwnProperty(title)) {
    if (address == '亚琛') {
      localHot = hot
      res.send({
        code: 0,
        data: localHot
      })
    } else if (address == '澳门') {
      localHot = hot
      res.send({
        code: 0,
        data: localHot
      })
    } else {
      localHot = hot
      res.send({
        code: 0,
        data: localHot
      })
    }
    // } else {
    //   res.send({
    //     code: 1,
    //     msg: '您查找的内容飞走了...'
    //   })
    // }
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