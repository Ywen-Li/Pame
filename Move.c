#include <gtk/gtk.h>
#include <time.h>
#include "Variable.h"

int finish = 0;
int sizeX, sizeY;
int manX, manY;
int initX, initY;
int coinX, coinY;
int level = 0;
int count = 0;
char buf[4];

extern void refreshMap();

extern int map[ROW][COLUMN];
extern GtkWidget *man;
extern GtkWidget *coin;
extern GtkWidget *fixed;
extern GtkWidget *score;
extern char bufSoundLost[25], bufSoundWin[25], bufSoundCoin[25];

void soundLost(){
	//system(bufSoundLost);
}
void soundWin(){
	//system(bufSoundWin);
}
void soundCoin(){
	//system(bufSoundCoin);
}

void lost(){
	g_thread_new(NULL, (GThreadFunc)soundLost, NULL);
    manX = initX; manY = initY;
    gtk_fixed_move(GTK_FIXED(fixed), man, manX * SIZE, manY * SIZE);
}

void win(){
    count++;
    if(count == 5){
		count = 0;
		level++;
		sprintf(buf, "%d", level);
		gtk_label_set_text(GTK_LABEL(score), buf);
		g_thread_new(NULL, (GThreadFunc)soundWin, NULL);
		refreshMap();
    }
    else{
    	g_thread_new(NULL, (GThreadFunc)soundCoin, NULL);
		map[manY][manX] = 1;
		Refresh();
    }
}

void Refresh(){
    for (; ; ) {
		coinY = rand() % 8;
		coinX = rand() % 15;
		if (map[coinY][coinX] == 1 && (coinX != manX || coinY != manY)) 
			if(coinY != initY || coinX != initX)break;
    }
    gtk_fixed_move(GTK_FIXED(fixed), coin, coinX * SIZE, coinY * SIZE);
    map[coinY][coinX] = 3;
}
void init(int X,int Y){
	srand(time(0));
	manX = X;
	manY = Y;
	initX = X;
	initY = Y;
}

void moveUp(){
    while (finish == 0 ) {
		if (manY - 1 >= 0) {
			if (map[manY - 1][manX] == 2) {
				gtk_fixed_move(GTK_FIXED(fixed), man, manX * SIZE, manY * SIZE);
				break;
			}
			else if(map[manY - 1][manX] == 3){
				manY--;
				win();
			}
			else manY--;
		} else{
			lost();
			break;
		}
    }
}
void moveDown(){
    while (finish == 0) {
		if (manY + 1 < ROW) {
			if (map[manY + 1][manX] == 2) {
				gtk_fixed_move(GTK_FIXED(fixed), man, manX * SIZE, manY * SIZE);
				break;
			}
			else if(map[manY + 1][manX] == 3){
				manY++;
				win();
			}
			else manY++;
		} else{
			lost();
			break;
		}
    }
}
void moveLeft(){
    while(finish == 0) {
		if (manX - 1 >= 0) {
			if(map[manY][manX-1] == 2){
				gtk_fixed_move(GTK_FIXED(fixed), man, manX * SIZE, manY * SIZE);
				break;
			}
			else if(map[manY][manX-1] == 3){
				manX--;
				win();
			}
			else manX--;
		}
		else{
			lost();
			break;
		}
    }
}
void moveRight(){
    while(finish == 0) {
		if (manX + 1 < COLUMN) {
			if(map[manY][manX+1] == 2){
				gtk_fixed_move(GTK_FIXED(fixed), man, manX * SIZE, manY * SIZE);
				break;
			}
			else if(map[manY][manX+1] == 3){
				manX++;
				win();
			}
			else manX++;
		}
		else {
			lost();
			break;
		}
    }
}
