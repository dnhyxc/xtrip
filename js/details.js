window.addEventListener('load', function () {
  var cityType = document.querySelector('.city-type')
  var inpWrapper = document.querySelector('.inp-wrapper')
  var city = document.querySelector('.city')
  var searchMsg = document.querySelector('.search-msg')
  var topheadpic = document.querySelector('.topheadpic')
  var titleCity = document.querySelector('.title-city')
  var ename = document.querySelector('.ename')
  var cIcon = document.querySelector('.c-icon')
  var container = document.querySelector('.container')
  var progressbar = document.querySelector('.progressbar')
  var sliderbar = document.querySelector('.sliderbar')
  var goBack = document.querySelector('.goBack')
  var aItems = document.querySelector('.a-items')
  var animate = document.querySelector('.animate')
  var tabBar = document.querySelector('.tab-bar')
  var aHref = document.querySelectorAll('.a-href')
  var titleText = document.querySelectorAll('.title-text')
  var sectext = document.querySelectorAll('.sectext')

  // 动态设置searchMsg的宽度
  var inpWrapperW = inpWrapper.offsetWidth
  var cityW = city.offsetWidth
  var width = inpWrapperW - cityW
  searchMsg.style.width = width + 'px'

  // 获取url中携带的参数
  var params = location.search
  var result = params.split('=')
  //将转码的参数转码
  var name = decodeURI(result[1], "utf-8");
  var id = name.split('&')
  //将转码的参数转码
  var price = decodeURI(result[2], "utf-8");

  ajax(`id=${id[0]}`)

  // 根据用户点击的选项获取对应页面的数据内容
  function ajax(name) {
    var xhr = new XMLHttpRequest()
    xhr.open('post', "http://localhost:6060/searchName")
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send(name)
    xhr.onload = function () {
      var result = JSON.parse(this.responseText)
      if (result.code === 0) {
        cityType.innerHTML = result.data.id
        titleCity.innerHTML = result.data.id
        ename.innerHTML = result.data.eId
        topheadpic.style.backgroundImage = result.data.src
      } else {
        console.log(result.msg)
      }
    }
  }

  // 用于获取当地热门的数据
  function ajaxLocalHot(e) {
    var xhr = new XMLHttpRequest()
    xhr.open('post', "http://localhost:6060/detialLocalHot")
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send(`address=${id[0]}`)
    xhr.onload = function () {
      var result = JSON.parse(this.responseText)
      if (result.code === 0) {
        var type = result.data.yachen
        // 设置滑动图的内容
        setData(e, type)
      } else {
        console.log(result.msg)
      }
    }
  }

  function setData(e, data) {
    Array.from(tabBar.children).forEach(item => {
      item.classList.remove('active-tab_list')
    });
    e.target.classList.add('active-tab_list')
    for (let i = 0; i < aHref.length; i++) {
      var img = aHref[i].children[0]
      if (e.target.innerHTML == '酒店') {
        img.src = data.hotelImgsSrc[i].src
      } else if (e.target.innerHTML == '景点') {
        img.src = data.AttractionsImgsSrc[i].src
      } else if (e.target.innerHTML == '美食') {
        img.src = data.foodImgsSrc[i].src
      } else if (e.target.innerHTML == '购物') {
        img.src = data.shopImgsSrc[i].src
      }
    }
    for (let i = 0; i < titleText.length; i++) {
      if (e.target.innerHTML == '酒店') {
        titleText[i].innerHTML = data.hotelImgsSrc[i].text
      } else if (e.target.innerHTML == '景点') {
        titleText[i].innerHTML = data.AttractionsImgsSrc[i].text
      } else if (e.target.innerHTML == '美食') {
        titleText[i].innerHTML = data.foodImgsSrc[i].text
      } else if (e.target.innerHTML == '购物') {
        titleText[i].innerHTML = data.shopImgsSrc[i].text
      }
    }
    for (let i = 0; i < sectext.length; i++) {
      if (e.target.innerHTML == '酒店') {
        sectext[i].innerHTML = data.hotelImgsSrc[i].score
      } else if (e.target.innerHTML == '景点') {
        sectext[i].innerHTML = data.AttractionsImgsSrc[i].score
      } else if (e.target.innerHTML == '美食') {
        sectext[i].innerHTML = data.foodImgsSrc[i].score
      } else if (e.target.innerHTML == '购物') {
        sectext[i].innerHTML = data.shopImgsSrc[i].score
      }
    }
  }

  goBack.addEventListener('click', function () {
    location.href = '../html/search.html'
  })

  // 为景点酒店等八大选项设置滚动事件
  var startX = 0
  var moveX = 0
  // 使用该变量记录上一次的移动距离
  var centerX = 0
  // 设置向右滑动的最大滑动距离
  var maxMoveRight = 380
  // 设置向左滑动的最大滑动距离
  var maxMoveLeft = -(cIcon.offsetWidth - container.offsetWidth + maxMoveRight)
  // 设置触发向左反弹的值
  var leftBounce = 0
  // 设置触发向右反弹的值
  var rightBounce = -(cIcon.offsetWidth - container.offsetWidth)
  // 小滚动条最大移动距离
  var sliderMaxmove = progressbar.clientWidth - sliderbar.clientWidth
  cIcon.addEventListener('touchstart', function (e) {
    startX = e.targetTouches[0].pageX
  })
  cIcon.addEventListener('touchmove', function (e) {
    e.preventDefault()
    // 使用手指最后移动到的坐标减去初始移动时手指的坐标计算得出手指移动的距离
    moveX = e.targetTouches[0].pageX - startX
    var endMoveX = centerX + moveX
    if (endMoveX > maxMoveRight) {
      endMoveX = maxMoveRight
    } else if (endMoveX < maxMoveLeft) {
      endMoveX = maxMoveLeft
    }
    cIcon.style.transform = "translateX(" + endMoveX + 'px)'
    // 设置底下小滚动条滚随选项移动
    var sliderBarMove = (endMoveX / 6.5)
    if (endMoveX < 0) {
      sliderBarMove = -(sliderBarMove)
    }
    if (sliderBarMove > sliderMaxmove) {
      sliderBarMove = sliderMaxmove
    }
    sliderbar.style.transform = "translateX(" + sliderBarMove + 'px)'
  })

  cIcon.addEventListener('touchend', function (e) {
    // 获取手指离开屏幕时的距离
    var endX = e.changedTouches[0].pageX - startX
    // 记录每次移动的距离
    centerX = endX + centerX
    if (centerX > leftBounce) {
      centerX = leftBounce
      this.style.transition = "all 0.3"
      this.style.transform = "translateX(" + centerX + 'px)'
      sliderbar.style.transform = "translateX(" + centerX / 6.5 + 'px)'
    } else if (centerX < rightBounce) {
      centerX = rightBounce
      this.style.transition = "all 0.3"
      this.style.transform = "translateX(" + centerX + 'px)'
      var right = -(centerX / 7)
      sliderbar.style.transform = "translateX(" + right + 'px)'
    }
  })

  // 为animate图片实现滑动效果
  var midX = 0
  var startX = 0
  var moveX = 0
  var maxRx = 360
  var maxLx = -(aItems.offsetWidth - animate.offsetWidth + maxRx - 20)
  var lBounce = 0
  var rBounce = -(aItems.offsetWidth - animate.offsetWidth)
  aItems.addEventListener('touchstart', function (e) {
    startX = e.targetTouches[0].pageX
  })
  aItems.addEventListener('touchmove', function (e) {
    moveX = e.targetTouches[0].pageX - startX
    var lastMoveX = moveX + midX
    if (lastMoveX > maxRx) {
      lastMoveX = maxRx
    } else if (lastMoveX < maxLx) {
      lastMoveX = maxLx
    }
    this.style.transform = "translateX(" + lastMoveX + "px)"
  })
  aItems.addEventListener('touchend', function (e) {
    var endX = e.changedTouches[0].pageX - startX
    midX = endX + midX
    if (midX > lBounce) {
      midX = lBounce
      this.style.transition = "all 0.3"
      this.style.transform = "translateX(" + midX + 'px)'
    } else if (midX < rBounce) {
      midX = rBounce
      this.style.transition = "all 0.3"
      this.style.transform = "translateX(" + midX + 'px)'
    }
  })

  // 为景点、酒店等四个热门选项绑定点击事件
  tabBar.addEventListener('click', function (e) {
    // 发送ajax请求数据
    ajaxLocalHot(e)
  })
})