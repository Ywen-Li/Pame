#include <gtk/gtk.h>
#include <stdlib.h>
#include <time.h>
#include "Variable.h"

int x, y, Up, Down, Left, Right, move, position, intCount = 0;
extern int map[ROW][COLUMN];

//the map element:0->empty;2->bar;1->road;3->man
void createY(int X, int Y);

int checkUp(int X, int Y){
    //return 0: 2 with new;return 1:new;return -1:break;
    int key = 0;//标识check的结果，存在2就为-1；存在3就为1;全新的路径就为0;
    int keyRoad = -1;
    Up = Y;
    if(Up-1 == 0){
		if(map[Y - 1][X] == 0)map[Y - 1][X] = 1;
		return -1;
    }
    if(map[Up-1][X] == 3)return -1;
	
    while(Up-1 >= 0){//判断现在所在的路径上是否存在什么还是新路径
		Up -= 1;
		if(map[Up][X] == 2){
			key = -1;
			Up += 1;//next time the Y is under the 2
			break;
		}
		if(map[Up][X] == 3){
			key = 1;
			break;
		}
    }
	
    if(key == -1){//根据路径的判断结果做出不同的响应
		for(move = Y;move >= Up;move--)
			if(map[move][X] == 0){
				keyRoad = 0;//keyRoad=0表示可以rand 2
				break;
			}
		if(keyRoad == 0){
			for(move = Y-1;move >= Up;move--)//将到2的路径归
			if(map[move][X] == 0)map[move][X] = 1;
			return 0;//exist 2 and is a new road
		}
		else return -1;//break
    }
    else if(key == 1){
		//random.nextInt(Y-y-1)+1+y
		for(move = Y-1;move > Up;move--)if(map[move][X] == 0)map[move][X] = 1;
		return -1;
    }
    else {
		int key1 = -1;
		for(position = Y;position >= 0;position--)//judge whether the road had be made
			if(map[position][X] == 0){
	
			key1 = 0;
			break;
			}
		if(key1 == -1)return -1;
		else return 1;
    }
}

int checkDown(int X,int Y){
    int key = 0;
    int keyRoad = -1;
    Down = Y;
	
    if(Down+1 == ROW-1){
		if(map[Down + 1][X] == 0)map[Down+1][X] = 1;
		return -1;
    }
    if(map[Down+1][X] == 2)return -1;
	
    while(Down+1 < ROW){
		Down += 1;
		if(map[Down][X] == 2){
			key = -1;
			Down -= 1;//next time the Y is under the 2
			break;
		}
		if(map[Down][X] == 3){
			key = 1;
			break;
		}
    }
	
    if(key == -1){
		for(move = Y+1;move <= Down;move++)
			if(map[move][X] == 0){
				keyRoad = 0;
				break;
			}
		if(keyRoad == 0){
			for(move = Y + 1;move <= Down;move++)
			if(map[move][X] == 0)map[move][X] = 1;
			return 0;//exist 2 and is a new road
		}
		else return -1;//break
    }
    else if(key == 1){
		for(move = Y+1;move < Down;move++)
			map[move][X] = 1;
		return -1;
    }
    else {
		int key1 = -1;
		for(position = Y;position < ROW;position++)
			if(map[position][X] == 0){
	
			key1 = 0;
			break;
			}
		if(key1 == -1)return -1;
		else return 1;
    }
}

int checkLeft(int X,int Y){
    int key = 0;
    int keyRoad = -1;
    Left = X;
    if(Left-1 == 0){
		if(map[Y][Left-1] == 0)map[Y][Left-1] = 1;
		return -1;
    }
    if(map[Y][Left - 1] == 2)return -1;
	
    while(Left-1 >= 0){
		Left -= 1;
		if(map[Y][Left] == 2){ 
			key = -1;
			Left += 1;
			break;
		}
		if(map[Y][Left] == 3){
			key = 1;
			break;
		}
    }
	
    if(key == -1){
		for(move = X;move >= Left;move--)
			if(map[Y][move] == 0){
				keyRoad = 0;
				break;
			}
		if(keyRoad == 0){
			for(move = X-1;move >= Left;move--)
			if(map[Y][move] == 0)map[Y][move] = 1;
			return 0;
		}
		else return -1;
    }
    else if(key == 1){
		for(move = X - 1;move > Left;move--)
			map[Y][move] = 1;
		return -1;
    }
    else {
		int key1 = -1;
		for(position = X;position >= 0;position--)
			if(map[Y][position] == 0){
	
			key1 = 0;
			break;
			}
		if(key1 == -1)return -1;
		else return 1;
    }
}

int checkRight(int X,int Y){
    int key = 0;
    int keyRoad = -1;
    Right = X;
    if(Right + 1 == COLUMN - 1){
		if(map[Y][Right + 1] != 2)map[Y][Right + 1] = 1;
		return -1;
    }
    if(map[Y][Right+1] == 2)return -1;
	
    while(Right+1 < COLUMN){
		Right += 1;
		if(map[Y][Right] == 2){
			key = -1;
			Right -= 1;
			break;
		}
		if(map[Y][Right] == 3){
			key = 1;
			break;
		}
    }
	
    if(key == -1){
		for(move = X+1;move <= Right;move++)
			if(map[Y][move] == 0){
				keyRoad = 0;
				break;
			}
		if(keyRoad == 0){
			for(move = X+1;move <= Right;move++)
			if(map[Y][move] == 0)map[Y][move] = 1;
			return 0;
		}
		else return -1;
    }
    else if(key == 1){
		for(move = X+1;move < Right;move++)map[Y][move] = 1;
		return -1;
    }
    else {
		int key1 = -1;
		for(position = X;position < COLUMN;position++)
			if(map[Y][position] == 0){
				key1 = 0;
				break;
			}
		if(key1 == -1)return -1;
		else return 1;
    }
}

void createX(int X,int Y){
    //////////////////////left
    int returnLeft = checkLeft(X,Y);
    if(returnLeft == 0)createY(Left,Y);
    else if(returnLeft == 1){
		int newX = rand()%(X-1);//x-1 for the bar not beside with X
		while(newX != 0 && map[Y][newX-1] != 0)newX = rand()%(X-1);
		if(newX == 0)for(move = X-1;move >= 0;move--)map[Y][move] = 1;
		else{
			map[Y][newX-1] = 2;
			intCount++;
			//arrayY.add(Y);
			//arrayX.add(newX-1);
			for(move = X-1;move > newX-1;move--)map[Y][move] = 1;
			createY(newX,Y);
		}
    }
    /////////////////////right
    int returnRight = checkRight(X,Y);
    if(returnRight == 0)createY(Right,Y);
    else if(returnRight == 1){
		//int newX=rand()%(column-1-X)+X+1;//以X所在位子为起点重新rand数，在加上X即为X以上的随机数
		int newX = rand()%(COLUMN-2-X)+X+1;
		while(newX != (COLUMN-1) && map[Y][newX+1] != 0)newX = rand()%(COLUMN-2-X)+X+1;
		if(newX == (COLUMN-1))for(move = X+1;move < COLUMN;move++)map[Y][move] = 1;
		else {
			map[Y][newX+1] = 2;
			intCount++;
			for(move = X+1;move <= newX;move++)
			map[Y][move] = 1;
			createY(newX,Y);
		}
    }
}

void createY(int X,int Y){
    //////////////////////Up
    int returnUp = checkUp(X, Y);
    if(returnUp == 0)createX(X, Up);
    else if(returnUp == 1){
		int newY = rand()%(Y-1);
		while(newY != 0 && map[newY-1][X] != 0)newY = rand()%(Y-1);
		if(newY == 0)for(move = Y-1;move >= 0;move--)map[move][X] = 1;
		else{
			map[newY-1][X] = 2;
			intCount++;
			//arrayY.add(newY-1);
			//arrayX.add(X);
			for(move = Y-1;move > newY-1;move--)map[move][X] = 1;
			createX(X, newY);
		}
    }
    /////////////////////Down
    int returnDown = checkDown(X, Y);
    if(returnDown == 0)createX(X, Down);
    else if(returnDown == 1){
		int newY = rand() % (ROW - 2 - Y) + Y + 1;//以Y所在位子为起点重新rand数，在加上Y即为Y以上的随机数
		while(newY != (ROW - 1) && map[newY + 1][X] != 0)newY = rand() % (ROW - 2 - Y) + Y + 1;
		if(newY == (ROW - 1))for(move = Y + 1;move < ROW;move++)map[move][X] = 1;
		else {
			map[newY + 1][X] = 2;
			intCount++;
			for(move = Y + 1;move <= newY;move++)
			map[move][X] = 1;
			createX(X, newY);
		}
    }
}

void initMap(){
	for(int i = 0;i < ROW;i++)
		for(int j = 0;j < COLUMN;j++)map[i][j] = 0;
		
	x = rand() % (COLUMN - 3) + 1;
    y = rand() % (ROW - 3) + 1;
	
    map[y][x] = 3;
    map[0][15] = 2;
    map[0][14] = 2;
}

void RandomMap(){
    srand(time(0));
	intCount = 0;
	while(intCount < 5){
		intCount = 0;
		initMap();
    	createY(x,y);
    	createX(x,y);
	}
}
