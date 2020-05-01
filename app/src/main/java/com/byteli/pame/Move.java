package com.byteli.pame;

import android.content.Context;
import android.os.Handler;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.AbsoluteLayout;
import android.widget.ImageView;

import java.util.Random;

/**
 * Created by byte on 11/30/15.
 */
public class Move {
    boolean finish=false;
    int sizeX,sizeY;
    int manX,manY;
    int initX,initY;
    int coinX,coinY;
    int level = 0;
    int count = 0;
    Random random = new Random();
    int[][] map;
    Handler handler;
    ImageView man;
    ImageView coin;
    Animation hiddenAction;

    public Move(Context wisecoin,int manX,int manY,int sizeX,int sizeY,ImageView man,ImageView coin,int[][] map,Handler handler){
        this.manX = manX;
        this.manY = manY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.man = man;
        this.coin = coin;
        this.map = map;
        this.handler = handler;
        initX = manX;
        initY = manY;
        hiddenAction = AnimationUtils.loadAnimation(wisecoin, R.anim.anim_move);

    }
    void lost(){
        manX = initX;manY=initY;
        AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX, sizeY, manX* sizeX,manY*sizeY);
        man.setLayoutParams(params);
    }

    void win(){
        count++;
        if(count == 5){
            count = 0;
            level++;
            handler.sendMessage(handler.obtainMessage(1,"RefreshMap"));
        }
        else{
            handler.sendMessage(handler.obtainMessage(1,"soundcoin"));
            map[manY][manX] = 1;
            Refresh();
        }
    }

    void Refresh(){
        for (; ; ) {
            coinY = random.nextInt(8);
            coinX = random.nextInt(15);
            if (map[coinY][coinX] == 1 &&(coinX!=manX||coinY!=manY)) break;
        }
        /*if(counter<5) {
            info[randomX][randomY] = 2;
            hereview.setImageResource(R.drawable.here);
        }
        else {
            int rewardrandom=random00.nextInt(2);
            switch(rewardrandom){
                case 0:hereview.setImageResource(R.drawable.sendglass);info[randomX][randomY]=3;break;
                case 1:hereview.setImageResource(R.drawable.guest);info[randomX][randomY] = 4;break;
                default:break;
            }
            rewardtime=rewardTimer(4000,1000);rewardtime.start();
            counter=0;
        }*/
        AbsoluteLayout.LayoutParams param = new AbsoluteLayout.LayoutParams(sizeX, sizeY, coinX * sizeX, coinY * sizeY);
        coin.setLayoutParams(param);
        map[coinY][coinX] = 3;
    }

    void moveUp(){
        man.startAnimation(hiddenAction);
        while (!finish ) {
            if (manY - 1 >= 0) {
                if (map[manY - 1][manX] == 2) {
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX, sizeY, manX* sizeX,manY*sizeY);
                    man.setLayoutParams(params);
                    break;
                }
                else if(map[manY - 1][manX] == 3){
                    manY--;
                    win();
                }
                /*else if (info[manX - 1][manY] == 2) {
                    manX = manX - 1;
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeY, sizeX, manY* sizeY,manX*sizeX);
                    manview.setLayoutParams(params);
                    win();
                    break;
                }
                else if (info[manX - 1][manY] == 3) {
                    manX = manX - 1;
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeY, sizeX, manY* sizeY,manX*sizeX);
                    manview.setLayoutParams(params);
                    getSendGlass();
                    break;
                }
                else if (info[manX - 1][manY] == 4) {
                    manX = manX - 1;
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeY, sizeX, manY* sizeY,manX*sizeX);
                    manview.setLayoutParams(params);
                    getGuest();
                    break;
                }*/
                else manY--;
            } else{
                lost();
                break;
            }
        }
    }

    void moveDown(){
        man.startAnimation(hiddenAction);
        while (!finish ) {
            if (manY + 1 <= 8) {
                if (map[manY + 1][manX] == 2) {
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX, sizeY, manX* sizeX,manY*sizeY);
                    man.setLayoutParams(params);
                    break;
                }
                else if(map[manY + 1][manX] == 3){
                    manY++;
                    win();
                }
                else {
                    manY++;
                }
            } else{
                lost();
                break;
            }
        }
    }

    void moveLeft(){
        man.startAnimation(hiddenAction);
        while(!finish) {
            if (manX - 1 >= 0) {
                if(map[manY][manX-1] == 2){
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX, sizeY, manX* sizeX,manY*sizeY);
                    man.setLayoutParams(params);
                    break;
                }
                else if(map[manY][manX-1] == 3){
                    manX--;
                    win();
                }
                else {
                    manX--;
                }
            }
            else{lost();break;}
        }
    }

    void moveRight(){
        man.startAnimation(hiddenAction);
        while(!finish) {
            if (manX + 1 <= 15) {
                if(map[manY][manX+1] == 2){
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX, sizeY, manX* sizeX,manY*sizeY);
                    man.setLayoutParams(params);
                    break;
                }
                else if(map[manY][manX+1] == 3){
                    manX++;
                    win();
                }
                else {
                    manX++;
                }
            }
            else {lost();break;}
        }
    }
}
