window.addEventListener('load', function () {
  var detial = document.querySelector('.detial')
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
        detial.innerHTML = result.data
      } else {
        console.log(result.msg)
      }
    }
  }

  var goBack = document.querySelector('.goBack')
  goBack.addEventListener('click', function () {
    location.assign('../html/search.html')
  })
})