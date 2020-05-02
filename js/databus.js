let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
    constructor() {
        if (instance)
            return instance

        instance = this

        this.reset()
    }

    reset() {
        this.score = 0
        this.arrMap = new Array()
        this.gameOver = false
        this.scorePos = []
        this.scorePosC = 0
        this.MAP_ROW = 9
        this.MAP_COLUMN = 16
        this.WIDTH = 0
        this.HEIGHT = 0
        this.OFFSETX = 0
        this.OFFSETY = 0
        this.playerName = ''
        this.playerIcon = ''
        this.record = 0
    }
}
