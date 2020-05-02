let canvas = wx.getSharedCanvas()
let ctx = canvas.getContext('2d')
var imgIcon = wx.createImage()
let zone = new Array()
let imgRank = new Array()
var myRecord = -1
let index = 0

function getUserCloudStorage() {
    wx.getUserCloudStorage({
        keyList: ['record'],
        success: res => {
            if (res.KVDataList.length > 0) {
                console.log('the value :' + res.KVDataList[0].value)
                myRecord = res.KVDataList[0].value
                return
            }
            console.log('getUserCloudStorage failed')
        },
        fail: res => {
            console.log("get fail!")
        },
        complete: res => {
        }
    })
}

function setUserCloudStorage() {
    wx.setUserCloudStorage({
        KVDataList: [{ key: 'record', value: myRecord + '' }],
        success: (res) => {
            console.log('set user clound storage success!')
        },
        fail: (res) => {
            console.log('set user clound storage fail!')
        }
    })
}

function getUserInfo() {
    wx.getUserInfo({
        openIdList: ['selfOpenId'],
        success: (res) => {
            imgIcon.src = res.data[0].avatarUrl
        },
        fail: (res) => {
            reject(res)
        }
    })
}

function getFriendCloudStorage() {
    wx.getFriendCloudStorage({
        keyList: ['record'],
        success: drawRankList,
        fail: (res) => {
            console.log('getFriendCloudStorage fail')
        }
    })
}

let iconH
let iconW
let baseW
let baseH
let baseX
let baseY
let offsetY
let offsetX
let offsetText = 10

function drawRankList(res) {
    iconH = 30
    iconW = 30
    index = 2
    baseW = zone[index].W * 1000 / 1618
    baseH = zone[index].H * 1000 / 1618
    baseX = (zone[index].W - baseW) / 2
    baseY = zone[index].Y + (zone[index].H - baseH) / 2
    offsetY = (baseH - 3 * iconH) / 4
    offsetX = (baseW - 2 * iconW) / 2

    ctx.font = "15px Arial"
    ctx.fillText(
        '排行榜',
        baseX + offsetX,
        baseY
    )

    res.data.sort((a, b) => {
        return b.KVDataList[0].value - a.KVDataList[0].value
    })
    for (var i = 0; i < res.data.length && i < 3; i++) {
        imgRank[i] = wx.createImage()
        console.log('FriendStorage:' + res.data[i].nickname + ' ' + res.data[i].avatarUrl + ' ' + res.data[i].KVDataList[0].value)
        if (i == res.data.length - 1 || i == 2)
            imgRank[i].onload = function () {
                for (var j = 0; j < res.data.length && j < 3; j++) {
                    ////////////draw the rank list
                    if (1 == j || 2 == j) {
                        baseY = baseY + offsetY + iconH
                    }

                    ctx.drawImage(
                        imgRank[j],
                        baseX + offsetX,
                        baseY + offsetY,
                        iconW,
                        iconH
                    )

                    ctx.fillStyle = 'white'
                    ctx.font = "12px Arial"
                    ctx.fillText(
                        'ID    ：' + res.data[j].nickname,
                        baseX + iconW + offsetX + offsetText,
                        baseY + iconH
                    )

                    ctx.fillText(
                        '得分：' + res.data[j].KVDataList[0].value,
                        baseX + iconW + offsetX + + offsetText,
                        baseY + offsetY + iconH
                    )
                }
            }
        imgRank[i].src = res.data[i].avatarUrl
    }
}

function drawShareCanvas(score) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let baseW = canvas.width / 2
    let baseH = 0
    let baseHL = (canvas.height * 618) / 1618
    let baseHH = (canvas.height * 1000) / 1618
    let baseX = 0
    let baseY = 0
    let iconW = 50
    let iconH = 50
    let offsetX = 0
    let offsetY = 0

    zone[0] = { X: 0, Y: 0, W: baseW, H: baseHL }
    zone[1] = { X: baseW, Y: 0, W: baseW, H: baseHL }
    zone[2] = { X: 0, Y: baseHL, W: baseW, H: baseHH }
    zone[3] = { X: baseW, Y: baseHL, W: baseW, H: baseHH }

    ////////////draw user info
    index = 0
    baseW = zone[index].W * 1000 / 1618
    baseH = zone[index].H * 1000 / 1618
    baseX = (zone[index].W - baseW) / 2
    baseY = (zone[index].H - baseH) / 2

    offsetX = (baseW - 2 * iconW) / 2
    offsetY = (baseH - iconH) / 2

    ctx.drawImage(
        imgIcon,
        baseX + offsetX,
        baseY + offsetY,
        iconW,
        iconH
    )

    ctx.fillStyle = 'white'
    ctx.font = "12px Arial"
    ctx.fillText(
        '得分：' + score,
        baseX + iconW + offsetX + offsetText,
        baseY + iconH
    )

    ctx.fillText(
        '记录：' + myRecord,
        baseX + iconW + offsetX + + offsetText,
        baseY + offsetY + iconH
    )
}

wx.onMessage(data => {
    if (null == data) {
        return
    }

    if (data.key == 'GameOver') {
        if (data.score > myRecord) {
            myRecord = data.score
            setUserCloudStorage()
        }
        getFriendCloudStorage()
        drawShareCanvas(data.score)
    } else if (data.key == 'UserInfo') {
        getUserInfo()
        getUserCloudStorage()
    }

})