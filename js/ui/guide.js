import DataBus from '../databus.js'

var databus = new DataBus()
const MAP_ROW = 9
const MAP_COLUMN = 16

export default class Guide {
    constructor() {
    }

    createGuideMap() {
        var i, j
        for (i = 0; i < MAP_ROW; i++) {
            databus.arrMap[i] = new Array(MAP_COLUMN)
            for (j = 0; j < MAP_COLUMN; j++)
                databus.arrMap[i][j] = 0
        }
        databus.arrMap[0][0] = 1
        databus.arrMap[0][1] = 1
        databus.arrMap[2][5] = 2
        databus.arrMap[6][4] = 2
        databus.arrMap[6][7] = 3
    }

    drawGuide(ctx, start) {
        var baseX = 11 * databus.WIDTH
        var baseY = 0
        ctx.drawImage(imgTransparent, baseX, baseY, 5 * databus.WIDTH, 9 * databus.HEIGHT)

        ctx.fillStyle = "#ffffff"
        ctx.font = "18px Arial"

        var tmp = 2
        ctx.fillText('新手指导', baseX + databus.WIDTH / 2, baseY + tmp * databus.HEIGHT)
        tmp += 3

        ctx.font = "12px Arial"

        ctx.fillText('1.上下左右滑屏控制移动', baseX + databus.WIDTH / 2, baseY + tmp * databus.HEIGHT / 2)
        tmp++
        ctx.fillText('2.人物直线运动，遇到障碍停下', baseX + databus.WIDTH / 2, baseY + tmp * databus.HEIGHT / 2)
        tmp++
        ctx.fillText('3.没有障碍出界，回到初始位置', baseX + databus.WIDTH / 2, baseY + tmp * databus.HEIGHT / 2)
        tmp++
        ctx.fillText('4.遇到棒棒糖得分', baseX + databus.WIDTH / 2, baseY + tmp * databus.HEIGHT / 2)
        tmp++
        ctx.fillText('5.游戏地图随机生成', baseX + databus.WIDTH / 2, baseY + tmp * databus.HEIGHT / 2)
        tmp++
        ctx.fillText('6.5个棒棒糖得一分，时间+5s', baseX + databus.WIDTH / 2, baseY + tmp * databus.HEIGHT / 2)

        tmp += 3

        baseX = baseX + databus.WIDTH
        baseY = baseY + tmp * databus.HEIGHT / 2
        ctx.drawImage(imgStart, baseX, baseY, 2 * databus.WIDTH, databus.HEIGHT)

        canvas.removeEventListener('touchend')
        canvas.addEventListener('touchend', (res) => {
            let tmpX = res.changedTouches[0].clientX;
            let tmpY = res.changedTouches[0].clientY;
            if (!isFirst) {
                return
            }
            if (tmpX >= baseX && tmpX <= baseX + 2 * databus.WIDTH && tmpY >= baseY && tmpY <= baseY + databus.HEIGHT) {
                wx.offTouchEnd()
                wx.offTouchStart()
                isFirst = false
                console.log('guide box')
                canvas.removeEventListener('touchend')
                start()
            }
        })

    }
}