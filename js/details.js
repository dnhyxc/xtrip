window.addEventListener('load', function () {
  var cityType = document.querySelector('.city-type')
  var cIcon = document.querySelector('.c-icon')
  var container = document.querySelector('.container')
  var progressbar = document.querySelector('.progressbar')
  var sliderbar = document.querySelector('.sliderbar')

  cIcon.style.left = 50 + 'px'
  console.log(cIcon.offsetLeft)
  // 获取url中携带的参数
  var params = location.search
  var result = params.split('=')
  //将转码的参数转码
  var name = decodeURI(result[1], "utf-8");
  var id = name.split('&')
  //将转码的参数转码
  var price = decodeURI(result[2], "utf-8");

  ajax(`id=${id[0]}`)

  function ajax(name) {
    var xhr = new XMLHttpRequest()
    xhr.open('post', "http://localhost:6060/searchName")
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send(name)
    xhr.onload = function () {
      var result = JSON.parse(this.responseText)
      if (result.code === 0) {
        cityType.innerHTML = result.data
      } else {
        console.log(result.msg)
      }
    }
  }

  var goBack = document.querySelector('.goBack')
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
})