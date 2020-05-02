import DataBus from './databus'
import Map from './core/map.js'
import MsgBox from './ui/msgbox.js'
import Guide from './ui/guide.js'
import GraphicContext from './core/graphiccontext.js'
const MAP_ROW = 9
const MAP_COLUMN = 16


const IMG_TRANSPARENT = 'images/transparent.png'
const IMG_SRC_BAR = 'images/bar.png'
const IMG_SRC_MY = 'images/man.png'
const IMG_SRC_SCORE = 'images/lollipop.png'
const IMG_SRC_BG = 'images/background.jpg'
const IMG_CLOSE = 'images/close.png'
const IMG_SRC_START = 'images/start.png'

let ctx = canvas.getContext('2d')
let gc = new GraphicContext(ctx)
let databus = new DataBus()
let msgbox = new MsgBox()
let map = new Map()
let guide = new Guide()
var mscScore
let isGameOver = false//onhide 时状态标志
let isTimeOut = false//时间为零状态标志

var mscWin = new Audio()
var mscOut = new Audio()
var mscLost = new Audio()

const MOVE_UP = 0, MOVE_RIGHT = 1, MOVE_DOWN = 2, MOVE_LEFT = 3
var touchStartX = 0
var touchStartY = 0
var touchEndX = 0
var touchEndY = 0
var myPosX = 0
var myPosY = 0
var myPosInitX = 0
var myPosInitY = 0
var scorePosX = 0
var scorePosY = 0
var myScore = 0
var isScore = false
let instance
var time = 30
var score = 0
var openData
var timeOutID
var fps = 0


function rnd(start, end) {
    return Math.floor(Math.random() * (end - start) + start)
}

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        instance = this
        this.aniId = 0
        if (canvas.width < canvas.height) {
            canvas.width = canvas.width ^ canvas.height
            canvas.height = canvas.width ^ canvas.height
            canvas.width = canvas.width ^ canvas.height
        }
        if (canvas.width / canvas.height > 16 / 9) {
            databus.HEIGHT = canvas.height / databus.MAP_ROW
            databus.WIDTH = databus.HEIGHT
            databus.OFFSETX = (canvas.width - (databus.WIDTH * databus.MAP_COLUMN)) / 2

        } else {
            databus.HEIGHT = databus.WIDTH = canvas.width / databus.MAP_COLUMN
            databus.OFFSETY = (canvas.height - (databus.HEIGHT * databus.MAP_ROW)) / 2
        }

        mscScore = wx.createInnerAudioContext()
        mscScore.src = 'audio/coin.mp3'
        mscWin.src = 'audio/win.mp3'
        mscOut.src = 'audio/out.mp3'
        mscLost.src = 'audio/lost.mp3'


        openData = wx.getOpenDataContext()
        openData.postMessage({ key: 'UserInfo' })

        this.loadImage()
        guide.createGuideMap()
        myPosInitX = myPosX = 7
        myPosInitY = myPosY = 6
        scorePosX = 9
        scorePosY = 3
        console.log('constructor')
        this.initTouchEvent()

        this.bindLoop = this.loop.bind(this)
        window.cancelAnimationFrame(this.aniId)
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }

    loadImage() {
        imgBG.src = IMG_SRC_BG
        imgMy.src = IMG_SRC_MY
        imgBar.src = IMG_SRC_BAR
        imgBG.src = IMG_SRC_BG
        imgTransparent.src = IMG_TRANSPARENT
        imgClose.src = IMG_CLOSE
        imgStart.src = IMG_SRC_START
        imgScore.src = IMG_SRC_SCORE
    }

    start() {
        //Text draw init
        console.log('start the game')
        ctx.fillStyle = "#000000"
        ctx.font = "18px Arial"

        time = 30
        score = 0
        this.initVariables()

        myPosX = myPosInitX = rnd(1, (databus.MAP_COLUMN - 3) + 1)
        myPosY = myPosInitY = rnd(1, (databus.MAP_ROW - 3) + 1)
        map.createMap(myPosInitX, myPosInitY)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.parseMap()
        this.ScoreRand()
        this.initTouchEvent()
    }

    initVariables() {
        fps = 0
        myScore = 0
        isGameOver = false
        isTimeOut = false
    }

    initTouchEvent() {
        wx.onTouchStart(function (e) {
            touchStartX = e.touches[0].clientX
            touchStartY = e.touches[0].clientY
        })

        wx.onTouchEnd(function (e) {
            let tmpX = e.changedTouches[0].clientX;
            let tmpY = e.changedTouches[0].clientY;
            if (tmpY - touchStartY < 0 && Math.abs(tmpY - touchStartY) > Math.abs(tmpX - touchStartX)) {
                instance.MoveFunc(myPosX, myPosY, MOVE_UP)
                return;
            }
            if (tmpY - touchStartY > 0 && tmpY - touchStartY > Math.abs(tmpX - touchStartX)) {
                instance.MoveFunc(myPosX, myPosY, MOVE_DOWN)
                return;
            }
            if (tmpX - touchStartX < 0 && Math.abs(tmpX - touchStartX) > Math.abs(tmpY - touchStartY)) {
                instance.MoveFunc(myPosX, myPosY, MOVE_LEFT)
                return;
            }
            if (tmpX - touchStartX > 0 && tmpX - touchStartX > Math.abs(tmpY - touchStartY)) {
                instance.MoveFunc(myPosX, myPosY, MOVE_RIGHT)
                return;
            }
        })
    }

    gameOver() {
        clearTimeout(timeOutID)
        wx.offTouchEnd()
        wx.offTouchStart()
    }

    refreshTime() {
        gc.drawText(0, 0, databus.WIDTH, databus.HEIGHT, time + 's', null)
    }

    refreshScore() {
        gc.drawText(databus.WIDTH, 0, databus.WIDTH, databus.HEIGHT, score, null)
    }

    restart() {
        time += 5
        score += 1

        this.initVariables()

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.drawBG()
        myPosInitX = myPosX = scorePosX
        myPosInitY = myPosY = scorePosY
        map.createMap(scorePosX, scorePosY);
        this.parseMap()
        this.ScoreRand()
    }

    drawBG() {
        this.drawImage(imgBG, 0, 0, databus.WIDTH * databus.MAP_COLUMN, databus.HEIGHT * databus.MAP_ROW)
    }

    drawImage(imgBar, X, Y, W, H) {
        ctx.drawImage(
            imgBar,
            X + databus.OFFSETX,
            Y + databus.OFFSETY,
            W,
            H
        )
    }

    blitImage(imgBar, X1, Y1, W1, H1, X2, Y2, W2, H2) {
        ctx.drawImage(
            imgBar,
            X1,
            Y1,
            W1,
            H1,
            X2 + databus.OFFSETX,
            Y2 + databus.OFFSETY,
            W2,
            H2
        )
    }

    ScoreRand() {
        this.isScore = false
        let arr = new Array(2)
        while (1) {
            let x = rnd(0, databus.scorePosC - 1)
            arr = databus.scorePos[x]
            if ((arr[0] != myPosX || arr[1] != myPosY) && (arr[0] != scorePosX || arr[1] != scorePosY)) {
                break
            }
        }

        scorePosX = arr[0]
        scorePosY = arr[1]
    }

    drawScore() {
        this.drawImage(
            imgScore,
            scorePosX * databus.WIDTH,
            scorePosY * databus.HEIGHT,
            databus.WIDTH,
            databus.HEIGHT
        )
    }

    parseMap() {
        databus.scorePosC = 0
        databus.scorePos = []
        for (var i = 0; i < databus.MAP_ROW; i++)
            for (var j = 0; j < databus.MAP_COLUMN; j++) {
                if (1 == databus.arrMap[i][j]) {
                    if (i == 0 || j == 0 || i == databus.MAP_ROW - 1 || j == databus.MAP_COLUMN)
                        continue
                    let arrTmp = new Array(2)
                    arrTmp[0] = j
                    arrTmp[1] = i
                    databus.scorePos.push(arrTmp)
                    databus.scorePosC++;
                    continue
                }
            }
    }

    drawMap() {
        for (var i = 0; i < databus.MAP_ROW; i++)
            for (var j = 0; j < databus.MAP_COLUMN; j++) {

                if (0 == databus.arrMap[i][j] || 3 == databus.arrMap[i][j] || 1 == databus.arrMap[i][j])
                    continue

                ctx.drawImage(
                    imgBar,
                    j * databus.WIDTH + databus.OFFSETX,
                    i * databus.HEIGHT + databus.OFFSETY,
                    databus.WIDTH,
                    databus.HEIGHT
                )
            }
    }

    drawMySelf(X, Y) {
        this.drawImage(
            imgMy,
            X * databus.WIDTH,
            Y * databus.HEIGHT,
            databus.WIDTH,
            databus.HEIGHT
        )
        myPosY = Y;
        myPosX = X;
    }

    GetScore() {
        myScore++
        if (5 == myScore && !isFirst) {
            mscWin.play()
            this.restart()
            return
        }
        mscScore.stop()
        mscScore.play()
        this.ScoreRand()
    }

    MoveFunc(X, Y, Z) {
        let i = 0
        let j = 0

        switch (Z) {
            case MOVE_UP:
                i = Y
                for (; i >= 0; i--) {
                    if (i == scorePosY && X == scorePosX) {
                        this.isScore = true
                    }
                    if (databus.arrMap[i][X] == 2) {
                        break;
                    }
                }
                if (i < 0) {
                    mscOut.currentime = 0
                    mscOut.play()
                    myPosX = myPosInitX
                    myPosY = myPosInitY
                } else {
                    myPosX = X
                    myPosY = i + 1
                }

                if (this.isScore) {
                    this.GetScore()
                }

                break;
            case MOVE_RIGHT:
                j = X;
                for (; j < databus.MAP_COLUMN; j++) {
                    if (Y == scorePosY && j == scorePosX) {
                        this.isScore = true
                    }
                    if (databus.arrMap[Y][j] == 2) {
                        break;
                    }
                }
                if (j == databus.MAP_COLUMN) {
                    mscOut.currentime = 0
                    mscOut.play()
                    myPosX = myPosInitX
                    myPosY = myPosInitY
                } else {
                    myPosX = j - 1
                    myPosY = Y
                }

                if (this.isScore) {
                    this.GetScore()
                }
                break;
            case MOVE_DOWN:
                i = Y;
                for (; i < databus.MAP_ROW; i++) {
                    if (i == scorePosY && X == scorePosX) {
                        this.isScore = true
                    }
                    if (databus.arrMap[i][X] == 2) {
                        break;
                    }
                }
                if (i == databus.MAP_ROW) {
                    mscOut.currentime = 0
                    mscOut.play()
                    myPosX = myPosInitX
                    myPosY = myPosInitY
                } else {
                    myPosX = X
                    myPosY = i - 1
                }

                if (this.isScore) {
                    this.GetScore()
                }
                break;
            case MOVE_LEFT:
                j = X;
                for (; j >= 0; j--) {
                    if (Y == scorePosY && j == scorePosX) {
                        this.isScore = true
                    }
                    if (databus.arrMap[Y][j] == 2) {
                        break;
                    }
                }
                if (j < 0) {
                    mscOut.currentime = 0
                    mscOut.play()
                    myPosX = myPosInitX
                    myPosY = myPosInitY
                } else {
                    myPosX = j + 1
                    myPosY = Y
                }

                if (this.isScore) {
                    this.GetScore()
                }

                break
        }
    }

    loop() {
        fps += 1;
        if (fps == 60 && !isTimeOut) {
            fps = 0;
            time -= 1;
        }

        if (time == 0 && !isTimeOut) {
            wx.postMessage({ key: 'GameOver', score: score })
            mscLost.play()
            msgbox.gameOverBox(ctx, score, this.start.bind(this))
            isTimeOut = true
        }

        this.drawBG()
        if (isFirst) {
            guide.drawGuide(ctx, this.start.bind(this))
        }
        this.drawMap()
        this.drawMySelf(myPosX, myPosY)
        this.drawScore()
        this.refreshTime()
        this.refreshScore()

        if (isTimeOut) {
            msgbox.gameOverBox(ctx, score, this.start.bind(this))
        }

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )

    }
}
