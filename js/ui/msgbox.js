import DataBus from '../databus.js'

const IMG_AGAIN = 'images/again.png'
const IMG_CLOSE = 'images/close.png'
const IMG_TRANSPARENT = 'images/transparent.png'

var databus = new DataBus()
var ctx
var isClicked = false

export default class MsgBox {
    constructor() {
        this.imgAgain = new Image()
        this.imgClose = new Image()
        this.imgTransparent = new Image()
        this.imgIcon = new Image()
        this.imgAgain.src = IMG_AGAIN
        this.imgClose.src = IMG_CLOSE
        this.imgTransparent.src = IMG_TRANSPARENT
    }

    gameOverBox(tmpCtx, score, start) {
        let baseW = canvas.width / 2
        let baseH = 0
        let baseHL = (canvas.height * 618) / 1618
        let baseHH = (canvas.height * 1000) / 1618
        let zone = new Array()
        let iconW = 50
        let iconH = 50
        let baseY = 0
        let baseX = 0
        let offsetX = 0
        let offsetY = 0
        let index = 0
        ctx = tmpCtx

        zone[0] = { X: 0, Y: 0, W: baseW, H: baseHL }
        zone[1] = { X: baseW, Y: 0, W: baseW, H: baseHL }
        zone[2] = { X: 0, Y: baseHL, W: baseW, H: baseHH }
        zone[3] = { X: baseW, Y: baseHL, W: baseW, H: baseHH }

        wx.offTouchStart()
        wx.offTouchEnd()

        ctx.drawImage(
            this.imgTransparent,
            0,
            0,
            canvas.width,
            canvas.height
        )

        ///////////blit the ranklist
        let sharedCanvas = wx.getOpenDataContext().canvas
        ctx.drawImage(
            sharedCanvas,
            0,
            0,
            canvas.width / 2,
            canvas.height,
            0,
            0,
            canvas.width / 2,
            canvas.height
        )

        ////////////draw the buttons
        index = 1
        baseX = zone[index].X
        baseY = zone[index].Y
        iconW = databus.WIDTH
        iconH = databus.HEIGHT
        offsetX = (zone[index].W - iconW * 2) / 3
        offsetY = (zone[index].H - iconH) / 2

        ctx.drawImage(
            imgStart,
            baseX + offsetX,
            baseY + offsetY,
            2 * iconW,
            iconH
        )

        /*ctx.drawImage(
          this.imgClose,
          baseX + offsetX * 2 + iconW,
          baseY + offsetY,
          iconW,
          iconH
        )*/

        wx.onTouchEnd(function (e) {
            let tmpX = e.changedTouches[0].clientX;
            let tmpY = e.changedTouches[0].clientY;
            if (tmpX >= baseX + offsetX && tmpX <= baseX + offsetX + 2 * iconW && tmpY >= baseY + offsetY && tmpY <= baseY + offsetY + iconH) {
                wx.offTouchStart()
                wx.offTouchEnd()
                start()
            }
        })

        ////////////draw tips
        /*ctx.font = "18px Arial"
        index = 3
        baseX = zone[index].X
        baseY = zone[index].Y
        baseW = zone[index].W * 1000 / 1618
        baseH = zone[index].H * 1000 / 1618
        offsetX = (zone[index].W - baseW) / 2
        offsetY = (zone[index].H - baseH) / 2
    
        ctx.fillText(
          "tips:回到原点会又是会对快速得分有帮助灵活运用规则可以走的更远！",
          baseX + offsetX,
          baseY + offsetY,
          baseW
        )*/

    }
}