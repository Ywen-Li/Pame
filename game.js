import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'
import Home from './js/ui/home.js'
var main

wx.onHide((res) => {
    main.gameOver()
})

wx.onShow((res) => {
    if (main) {
        console.log('onShow')
        main.start()
    } else {
        main = new Main()
    }
})
