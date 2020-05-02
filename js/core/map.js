import DataBus from '../databus'

const MAP_ROW = 9
const MAP_COLUMN = 16

let databus = new DataBus()
var x, y, Up, Down, Left, Right, move, position

function rnd(start, end) {
    return Math.floor(Math.random() * (end - start) + start)
}

export default class Map {
    constructor() {

    }

    checkUp(X, Y) {
        //return 0: 2 with new;return 1:new;return -1:break;
        Up = Y;
        if (Up - 1 == 0) {

            if (databus.arrMap[Y - 1][X] == 0) databus.arrMap[Y - 1][X] = 1;
            return -1;
        }
        if (databus.arrMap[Up - 1][X] == 3) return -1;
        while (Up - 1 >= 0) {
            Up -= 1;
            if (databus.arrMap[Up][X] == 2) {
                Up += 1;//next time the Y is under the 2
                for (move = Y; move >= Up; move--)
                    if (databus.arrMap[move][X] == 0) {
                        for (move = Y - 1; move >= Up; move--)//将到2的路径归
                            if (databus.arrMap[move][X] == 0) databus.arrMap[move][X] = 1;
                        return 0;//exist 2 and is a new road
                    }
                return -1;//break
            }
            if (databus.arrMap[Up][X] == 3) {
                return -1;
            }
        }

        for (position = Y; position >= 0; position--)//judge whether the road had be made
            if (databus.arrMap[position][X] == 0) {
                return 1
            }
        return -1;
    }

    checkDown(X, Y) {
        Down = Y;
        if (Down + 1 == MAP_ROW - 1) {
            if (databus.arrMap[Down + 1][X] == 0) databus.arrMap[Down + 1][X] = 1;
            return -1;
        }
        if (databus.arrMap[Down + 1][X] == 2) return -1;
        while (Down + 1 < MAP_ROW) {
            Down += 1;
            if (databus.arrMap[Down][X] == 2) {
                Down -= 1;//next time the Y is under the 2
                for (move = Y + 1; move <= Down; move++)
                    if (databus.arrMap[move][X] == 0) {
                        for (move = Y + 1; move <= Down; move++)
                            if (databus.arrMap[move][X] == 0) databus.arrMap[move][X] = 1;
                        return 0;//exist 2 and is a new road
                    }
                return -1;//break
            }
            if (databus.arrMap[Down][X] == 3) {
                return -1;
            }
        }
        for (position = Y; position < MAP_ROW; position++)
            if (databus.arrMap[position][X] == 0) {
                return 1;
            }
        return -1;
    }

    checkLeft(X, Y) {
        Left = X;
        if (Left - 1 == 0) {

            if (databus.arrMap[Y][Left - 1] == 0) databus.arrMap[Y][Left - 1] = 1;
            return -1;
        }
        if (databus.arrMap[Y][Left - 1] == 2) return -1;
        while (Left - 1 >= 0) {

            Left -= 1;
            if (databus.arrMap[Y][Left] == 2) {
                Left += 1;
                for (move = X; move >= Left; move--)
                    if (databus.arrMap[Y][move] == 0) {

                        for (move = X - 1; move >= Left; move--)
                            if (databus.arrMap[Y][move] == 0) databus.arrMap[Y][move] = 1;
                        return 0;
                    }
                return -1;
            }
            if (databus.arrMap[Y][Left] == 3) {
                return -1;
            }
        }
        for (position = X; position >= 0; position--)
            if (databus.arrMap[Y][position] == 0) {
                return 1;
            }
        return -1;
    }

    checkRight(X, Y) {
        Right = X;
        if (Right + 1 == MAP_COLUMN - 1) {

            if (databus.arrMap[Y][Right + 1] != 2) databus.arrMap[Y][Right + 1] = 1;
            return -1;
        }
        if (databus.arrMap[Y][Right + 1] == 2) return -1;
        while (Right + 1 < MAP_COLUMN) {
            Right += 1;
            if (databus.arrMap[Y][Right] == 2) {
                Right -= 1;
                for (move = X + 1; move <= Right; move++)
                    if (databus.arrMap[Y][move] == 0) {
                        for (move = X + 1; move <= Right; move++)
                            if (databus.arrMap[Y][move] == 0) databus.arrMap[Y][move] = 1;
                        return 0;
                    }
                return -1;
            }
            if (databus.arrMap[Y][Right] == 3) {
                return -1;
            }
        }
        for (position = X; position < MAP_COLUMN; position++)
            if (databus.arrMap[Y][position] == 0) {
                return 1;
            }
        return -1;
    }

    createX(X, Y) {
        //////////////////////left
        var returnLeft = this.checkLeft(X, Y)
        if (returnLeft == 0) this.createY(Left, Y)
        else if (returnLeft == 1) {

            var newX = rnd(0, X - 1)//x-1 for the bar not beside with X
            while (newX != 0 && databus.arrMap[Y][newX - 1] != 0) newX = rnd(0, X - 1)
            if (newX == 0) for (move = X - 1; move >= 0; move--)
                databus.arrMap[Y][move] = 1
            else {

                databus.arrMap[Y][newX - 1] = 2
                for (move = X - 1; move > newX - 1; move--)databus.arrMap[Y][move] = 1;
                this.createY(newX, Y);
            }
        }
        /////////////////////right
        var returnRight = this.checkRight(X, Y);
        if (returnRight == 0) this.createY(Right, Y);
        else if (returnRight == 1) {

            //int newX=rand()%(MAP_COLUMN-1-X)+X+1;//以X所在位子为起点重新rand数，在加上X即为X以上的随机数
            var newX = rnd(X + 1, (MAP_COLUMN - 1));
            while (newX != (MAP_COLUMN - 1) && databus.arrMap[Y][newX + 1] != 0) newX = rnd(X + 1, (MAP_COLUMN - 1));
            if (newX == (MAP_COLUMN - 1)) for (move = X + 1; move < MAP_COLUMN; move++)
                databus.arrMap[Y][move] = 1;
            else {

                databus.arrMap[Y][newX + 1] = 2;
                for (move = X + 1; move <= newX; move++)
                    databus.arrMap[Y][move] = 1;
                this.createY(newX, Y);
            }
        }
    }

    createY(X, Y) {
        //////////////////////Up
        var returnUp = this.checkUp(X, Y);
        if (returnUp == 0) this.createX(X, Up);
        else if (returnUp == 1) {

            var newY = rnd(0, Y - 1);
            while (newY != 0 && databus.arrMap[newY - 1][X] != 0) newY = rnd(0, Y - 1);
            if (newY == 0) for (move = Y - 1; move >= 0; move--)
                databus.arrMap[move][X] = 1;
            else {
                databus.arrMap[newY - 1][X] = 2;
                for (move = Y - 1; move > newY - 1; move--)databus.arrMap[move][X] = 1;
                this.createX(X, newY);
            }
        }
        /////////////////////Down
        var returnDown = this.checkDown(X, Y);
        if (returnDown == 0) this.createX(X, Down);
        else if (returnDown == 1) {

            var newY = rnd(Y + 1, (MAP_ROW - 1));//以Y所在位子为起点重新rand数，在加上Y即为Y以上的随机数
            while (newY != (MAP_ROW - 1) && databus.arrMap[newY + 1][X] != 0) newY = rnd(Y + 1, (MAP_ROW - 1));
            if (newY == (MAP_ROW - 1)) for (move = Y + 1; move < MAP_ROW; move++)
                databus.arrMap[move][X] = 1;
            else {

                databus.arrMap[newY + 1][X] = 2;
                for (move = Y + 1; move <= newY; move++)
                    databus.arrMap[move][X] = 1;
                this.createX(X, newY);
            }
        }
    }

    createMap(X, Y) {
        var i, j
        for (i = 0; i < MAP_ROW; i++) {
            databus.arrMap[i] = new Array(MAP_COLUMN)
            for (j = 0; j < MAP_COLUMN; j++)
                databus.arrMap[i][j] = 0
        }

        databus.arrMap[Y][X] = 3
        databus.arrMap[0][0] = 1
        databus.arrMap[0][1] = 1
        this.createY(X, Y)
        this.createX(X, Y)
        console.log("create map finish!")
    }
}