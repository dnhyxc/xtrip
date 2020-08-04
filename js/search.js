window.addEventListener('load', function () {
  var searchInp = document.querySelector('.search-msg')
  var hotSearch = document.querySelector('.hotSearch')
  var goBack = document.querySelector('.goBack')
  var clear = document.querySelector('.clear')
  var sortItems = document.querySelector('.sort-items')
  var list = sortItems.querySelectorAll('li')
  var selectList = document.querySelector('.list')
  var selectContent = document.querySelector('.select')
  var listIcon = document.querySelector('.list-icon')
  var searchContent = document.querySelector('.searchContent')
  var history = document.querySelector('.history')
  var historySearch = document.querySelector('.historySearch')
  var clearHistory = document.querySelector('.clearHistory')
  var submitData = document.querySelector('.submitData')
  var searchItems = document.querySelector('.search-items')
  // 获取输入的内容后台不存在情况的存储数据的标签
  var searchResult = document.querySelector('.search-result')
  var sort = document.querySelector('.sort')

  // 获取缓存的数据
  var historyData = window.localStorage.getItem('data')
  // historyData是否有值
  if (historyData) {
    addNode()
  }
  // 定义页面一刷新加载数据并创建对应的节点的函数
  function addNode() {
    history.style.display = 'block'
    clearHistory.style.display = 'block'
    // 创建需要添加的元素
    var li = document.createElement('li')
    var span = document.createElement('span')
    span.innerHTML = '&#xe764;'
    var p = document.createElement('p')
    p.innerHTML = historyData
    li.appendChild(p)
    li.appendChild(span)
    var limsg = li.children[0].innerHTML
    // 声明一个用于保存已经添加过的历史记录
    var msgs = []
    for (let i = 0; i < searchContent.children.length; i++) {
      var j = searchContent.children[i].children[0].innerHTML
      msgs.push(j)
    }
    if (msgs.indexOf(limsg) == -1) {
      // 向父元素中指定子元素之前插入li元素
      searchContent.insertBefore(li, searchContent.children[0])
      // 调用该函数设置样式
      setStyle()
    }
  }

  // 用于创建节点的函数
  function createNode(id, price, count) {
    var li = document.createElement('li')
    li.className = 'search-item-list'
    var i = document.createElement('i')
    i.className = 'search-icon'
    if (count === 'name') {
      i.style.backgroundPosition = '0px 0px'
    } else {
      i.style.backgroundPosition = '0 -50px'
    }
    var span = document.createElement('span')
    span.className = 'search-content'
    span.innerHTML = id
    var em = document.createElement('em')
    em.className = 'font-icon iconfont'
    em.innerHTML = '&#xe764;'
    em.addEventListener('click', function (e) {
      e.stopPropagation()
      searchInp.value = id
    })
    var p = document.createElement('p')
    p.className = 'origin'
    if (count === 'hotel') {
      p.innerHTML = `实时计价：${price}`
    } else if (count === 'name') {
      p.innerHTML = `所属地：${price}`
    }
    li.appendChild(i)
    li.appendChild(span)
    li.appendChild(em)
    li.appendChild(p)
    li.addEventListener('click', function () {
      ajax(id)
      window.localStorage.setItem('data', id)
      // location.assign(`../html/details.html?details=${result.search}`)
      // 将携带参数进行转码
      window.location.href = "../html/details.html?id=" + encodeURI(id) + "&price=" + encodeURI(price)
    })
    // searchItems.insertBefore(li, searchItems.children[0])
    searchItems.appendChild(li)
  }

  // ajax简易函数
  function ajax(msg) {
    var xhr = new XMLHttpRequest()
    xhr.open('post', "http://localhost:6060/search")
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.onload = () => {
      var inpValue = searchInp.value
      const result = JSON.parse(xhr.responseText)
      // 输入数据后台存在数据的情况
      if (result.code === 0) {
        var address = result.data.address
        var hotel = result.data.hotel
        var name = address.name
        var hotel = hotel.name
        for (let i = 0; i < name.length; i++) {
          var id = name[i].id
          var origin = name[i].origin
          var addNames = []
          for (let i = 0; i < searchItems.children.length; i++) {
            addNames.push(searchItems.children[i].children[1].innerHTML)
          }
          if (addNames.indexOf(id) == -1) {
            createNode(id, origin, 'name', result)
          }
        }
        // 创建酒店节点
        for (let i = 0; i < hotel.length; i++) {
          var id = hotel[i].id
          var price = hotel[i].price
          var hotels = []
          for (let i = 0; i < searchItems.children.length; i++) {
            hotels.push(searchItems.children[i].children[1].innerHTML)
          }
          if (hotels.indexOf(id) == -1) {
            createNode(id, price, 'hotel', inpValue, result)
          }
        }
        // 输入数据后台不存在数据的情况
      } else if (result.code === 1) {
        var msgs = result.msg
        if (searchItems.children.length !== 0) {
          searchItems.innerHTML = ''
        } else {
          var div = document.createElement('div')
          div.className = 'failedSearch'
          var p = document.createElement('p')
          p.className = 'failMsg'
          p.innerHTML = msgs
          var span = document.createElement('span')
          span.className = 'fail-hot'
          span.innerHTML = '您还可以在携程查找：'
          div.appendChild(p)
          div.appendChild(span)
          var ul = document.createElement('ul')
          ul.className = 'fail-items'
          for (let i = 0; i < 6; i++) {
            var li = document.createElement('li')
            li.className = 'failList'
            var p = document.createElement('p')
            p.className = 'icon-' + i
            li.appendChild(p)
            var a = document.createElement('a')
            a.className = 'failLink'
            var content = ['机票', '酒店', '门票', '旅游', '火车票', '一日游']
            for (let j = 0; j < content.length; j++) {
              a.innerHTML = content[i]
              li.appendChild(a)
            }
            var span = document.createElement('span')
            span.className = 'fail-icon iconfont'
            span.innerHTML = '&#xe764;'
            li.appendChild(span)
            ul.appendChild(li)
          }
          div.appendChild(ul)
          searchItems.appendChild(div)
        }
      }
    }
    xhr.send(`category=${msg}`)
  }

  // 用于设置样式的函数
  function setStyle() {
    for (let i = 0; i < searchContent.children.length; i++) {
      // 给历史记录内容绑定操作
      searchContent.children[i].children[0].onclick = function () {
        var container = searchContent.children[i].children[0].innerHTML
        ajax(container)
      }
      // 给历史记录右边箭头绑定点击事件
      var index = searchContent.children[i].children.length - 1
      searchContent.children[i].children[index].onclick = function () {
        var container = searchContent.children[i].children[0].innerHTML
        searchInp.value = container
        selectContent.innerHTML = container
        selectContent.style.font = 'normal 16px/1.5 Arial,"Lucida Grande",Verdana,"Microsoft Yahei",STXihei,hei;'
        selectContent.style.color = '#FF9A14'
        selectList.style.display = 'block'
        sortItems.style.display = 'none'
        history.style.display = 'none'
        clearHistory.style.display = 'none'
      }
    }
  }

  // 输入框自动获取焦点
  searchInp.focus()
  // 点击header左边回退按钮回到首页
  goBack.addEventListener('click', function () {
    location.assign('../html/index.html')
  })

  // 给输入框中右边❌绑定点击事件
  clear.addEventListener('click', function () {
    searchInp.focus()
    if (searchInp.value) {
      searchInp.value = ''
      if (searchContent.children.length !== 0) {
        history.style.display = 'block'
        // 如果有历史记录，才显示
        clearHistory.style.display = 'block'
      }
    }
    selectList.style.display = 'none'
    sortItems.style.display = 'block'
    hotSearch.style.display = 'block'
    searchResult.style.display = 'none'
    sort.style.display = 'block'
  })

  for (let i = 0; i < list.length; i++) {
    // 点击热门搜索操作
    list[i].children[0].onclick = function () {
      var msg = this.innerHTML
      // 发送ajax请求
      ajax(msg)
      // ====================跳转页面并携带参数==========================
      window.location.href = "../html/details.html?id=" + encodeURI(msg)
    }
    // 点击右箭头操作
    var child = list[i].children
    child[1].onclick = function () {
      var content = list[i].children[0].innerHTML
      searchInp.value = content
      selectContent.innerHTML = content
      selectContent.style.font = 'normal 16px/1.5 Arial,"Lucida Grande",Verdana,"Microsoft Yahei",STXihei,hei;'
      selectContent.style.color = '#FF9A14'
      selectList.style.display = 'block'
      sortItems.style.display = 'none'
      history.style.display = 'none'
      clearHistory.style.display = 'none'
      if (i === 0) {
        listIcon.style.backgroundPosition = '0px -75px'
      } else if (i === 1) {
        listIcon.style.backgroundPosition = '0px -50px'
      } else if (i === 2) {
        listIcon.style.backgroundPosition = '0px -125px'
      } else if (i == 3) {
        listIcon.style.backgroundPosition = '0px -174px'
      } else if (i === 4) {
        listIcon.style.backgroundPosition = '0px -100px'
      } else if (i === 5) {
        listIcon.style.backgroundPosition = '0px -275px'
      }
    }
  }

  // 点击热门搜索内容操作selectList
  selectContent.addEventListener('click', function () {
    var msg = this.innerHTML
    // 保存数据
    window.localStorage.setItem('data', msg)
    // 使用localStorage保存数据
    var res = window.localStorage.getItem('data')
    // 创建需要添加的元素
    var li = document.createElement('li')
    var span = document.createElement('span')
    span.innerHTML = '&#xe764;'
    var p = document.createElement('p')
    p.innerHTML = res
    li.appendChild(p)
    li.appendChild(span)
    var limsg = li.children[0].innerHTML
    // 声明一个用于保存已经添加过的历史记录
    var msgs = []
    for (let i = 0; i < searchContent.children.length; i++) {
      var j = searchContent.children[i].children[0].innerHTML
      msgs.push(j)
    }
    if (msgs.indexOf(limsg) == -1) {
      // 向父元素中指定子元素之前插入li元素
      searchContent.insertBefore(li, searchContent.children[0])
      // 调用该函数设置样式
      setStyle()
    }
    historySearch.style.display = 'block'
  })

  // 给选中的热门搜索绑定点击事件
  selectList.addEventListener('click', function () {
    ajax(this.children[1].innerHTML)
    // ☆☆☆☆☆☆☆☆☆☆☆☆☆☆跳转页面并携带参数☆☆☆☆☆☆☆☆☆☆☆☆☆
    window.location.href = "../html/details.html?id=" + encodeURI(this.children[1].innerHTML)
  })

  // 给input输入框绑定事件
  searchInp.addEventListener('keyup', function () {
    hotSearch.style.display = 'none'
    sortItems.style.display = 'none'
    if (!this.value.trim()) {
      searchItems.innerHTML = ''
      selectList.style.display = 'none'
      sortItems.style.display = 'block'
      hotSearch.style.display = 'block'
      sort.style.display = 'block'
      if (searchContent.children.length !== 0) {
        history.style.display = 'block'
        clearHistory.style.display = 'block'
      }
    } else {
      selectList.style.display = 'none'
      history.style.display = 'none'
      clearHistory.style.display = 'none'
      clearHistory.style.display = 'none'
      searchResult.style.display = 'block'
      searchItems.style.display = 'block'
    }
  })

  // 当输入框的值发生变化时，发送ajax请求，否者不发生请求，
  // 解决input元素onkeyup事件所带来的页面刷新就发送ajax请求的问题
  searchInp.oninput = function () {
    searchItems.innerHTML = ''
    if (!this.value.trim()) {
      searchItems.style.display = 'none'
    }
    ajax(this.value)
    // ====================跳转页面并携带参数==========================
    // window.location.href = "../html/details.html?id=" + encodeURI(this.value)
  }

  // 给搜索按钮绑定事件
  submitData.addEventListener('click', function () {
    var failedSearch = document.querySelector('.failedSearch')
    var value = searchInp.value
    if (value.trim()) {
      history.style.display = 'none'
      // clearHistory.style.display = 'block'
      selectList.style.display = 'none'
      sortItems.style.display = 'block'
      hotSearch.style.display = 'block'
      historySearch.style.display = 'block'
      sort.style.display = 'none'
      if (failedSearch === null) {
        ajax(value)
        window.localStorage.setItem('data', value)
        // ====================跳转页面并携带参数==========================
        window.location.href = "../html/details.html?id=" + encodeURI(value)
      }
    }
    // 创建需要添加的元素
    var li = document.createElement('li')
    var span = document.createElement('span')
    span.innerHTML = '&#xe764;'
    var p = document.createElement('p')
    if (value.trim()) {
      p.innerHTML = value
    }
    li.appendChild(p)
    li.appendChild(span)
    var limsg = li.children[0].innerHTML
    // 声明一个用于保存已经添加过的历史记录
    var msgs = []
    for (let i = 0; i < searchContent.children.length; i++) {
      var j = searchContent.children[i].children[0].innerHTML
      msgs.push(j)
    }
    if (msgs.indexOf(limsg) == -1) {
      // 向父元素中指定子元素之前插入li元素
      if (value.trim()) {
        searchContent.insertBefore(li, searchContent.children[0])
        // 调用该函数设置样式
        setStyle()
      }
    }
  })

  // 给清除历史按钮绑定事件
  clearHistory.addEventListener('click', function () {
    historySearch.style.display = 'none'
    searchContent.innerHTML = ''
    clearHistory.style.display = 'none'
    window.localStorage.clear()
  })
})





