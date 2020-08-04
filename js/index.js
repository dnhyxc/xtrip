window.addEventListener('load', function () {
    var global = document.querySelector('.global')
    var header = document.querySelector('.header')
    var search = document.querySelector('.search')
    var user = document.querySelector('.user')
    var userHeader = user.querySelector('span')
    var allLanguage = document.querySelector('.allLanguage')
    var cover = document.querySelector('.cover')
    var close = document.querySelector('.iconfont')
    var search = document.querySelector('.search')
    // getComputedStyle('元素','伪类')用于获取伪类元素
    window.addEventListener('scroll', function () {
        header.style.background = '#fff'
        userHeader.style.background = 'url(../images/user.png) 0 -78px'
        userHeader.style.backgroundSize = '21px 123px'
        search.style.backgroundColor = '#ececed'
        user.style.color = '#222'
        if (document.documentElement.scrollTop === 0) {
            header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0))'
            userHeader.style.background = 'url(../images/user.png) 0 -36px'
            userHeader.style.backgroundSize = '21px 123px'
            user.style.color = '#fff'
            search.style.backgroundColor = '#fff'
        }
    })
    global.addEventListener('click', function () {
        cover.style.display = 'block'
        allLanguage.style.height = '400px'
    })
    close.addEventListener('click', function () {
        cover.style.display = 'none'
        allLanguage.style.height = '0px'
    })

    search.addEventListener('click', function () {
        location.assign('../html/search.html')
        console.log(searchInp)
    })
})