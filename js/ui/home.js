import DataBus from '../databus.js'
import Main from '../main.js'
import '../variable.js'

var databus = new DataBus()
//var main = new Main()

let ctx = canvas.getContext('2d')
var instance

export default class Home {
    constructor() {
        instance = this
        imgMy.src = IMG_SRC_MY
        imgBar.src = IMG_SRC_BAR
        imgBG.src = IMG_SRC_BG
        imgScore.src = IMG_SRC_SCORE
        imgTransparent.onload = function () {
            main.drawBG()
            ctx.drawImage(imgTransparent, 0, 0, canvas.width, canvas.height)
            instance.drawHome()
        }
        imgTransparent.src = IMG_TRANSPARENT
    }

    drawHome() {
        var baseW = (canvas.width * 1000) / 1618
        var baseH = (canvas.height * 1000) / 1618
        var baseX = (canvas.width - baseW) / 2
        var baseY = (canvas.height - baseH) / 2
        ctx.fillStyle = 'white'
        ctx.fillFont = '18px Arial'
        ctx.fillText('路径挑战', baseX, baseY + 20, baseW)
    }


}