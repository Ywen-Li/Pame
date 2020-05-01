package com.byteli.pame;

import android.app.Dialog;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.AbsoluteLayout;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Created by byte on 11/30/15.
 */
public class Survival extends AppCompatActivity {
    int record;
    int sizeX,sizeY;
    int manX,manY;
    float x1,x2,y1,y2;
    int map[][] = new int[9][16];
    private CountDownTimer timer;
    long downTimer;
    SoundPool spool;
    int soundcoin,soundlost,soundrefresh,soundrecord;
    AbsoluteLayout container;
    AbsoluteLayout container_man;
    ImageView man,coin;
    TextView time,score;
    Move coreMove;

    Handler handler = new Handler(){
        @Override
        public void handleMessage(Message msg){
            super.handleMessage(msg);
            if(msg.obj.equals("RefreshMap")){
                spool.play(soundrefresh,1,1,0,0,1);
                refreshMap();
                timer.cancel();
                timer = setTimer(downTimer+10000,1000);
                timer.start();
            }
            else if(msg.obj.equals("soundcoin"))spool.play(soundcoin,1,1,0,0,1);
        }
    };

    CountDownTimer setTimer(long start,long per){
        return new CountDownTimer(start,per){
            @Override
            public void onTick(long l){
                time.setText(l/1000+"s");
                downTimer = l;
            }
            @Override
            public void onFinish(){
                if(coreMove.level>record){
                    spool.play(soundrecord,1,1,0,0,1);
                    time.setText(0+"s");
                    messageBox("New Record:"+coreMove.level);
                }
                else {
                    spool.play(soundlost,1,1,0,0,1);
                    time.setText(0+"s");
                    coreMove.finish=true;
                    messageBox("Game Over!");
                }

            }
        };
    }


    static {
        System.loadLibrary("core_map");
    }
    public native void CreateMap(int[][] ints);

    @Override
    protected void onCreate(Bundle saved){
        super.onCreate(saved);
        setContentView(R.layout.mode_survival);

        DisplayMetrics dm = new DisplayMetrics();
        super.getWindowManager().getDefaultDisplay().getMetrics(dm);
        sizeX = dm.widthPixels/16;
        sizeY = dm.heightPixels/9;
        record = getIntent().getIntExtra("Record",0);

        initMap();
        initShowBox();
        initSound();
    }

    //init//////////////////////////////////////////////////////////////////////////////////////////
    void initMap(){
        coin = new ImageView(this);
        coin.setScaleType(ImageView.ScaleType.FIT_XY);
        coin.setImageResource(R.mipmap.coin);
        container = (AbsoluteLayout)findViewById(R.id.container);
        container_man = (AbsoluteLayout)findViewById(R.id.container_man);
        container_man.addView(coin);
        man = new ImageView(this);
        man.setScaleType(ImageView.ScaleType.FIT_XY);
        man.setImageResource(R.mipmap.man);
        container_man.addView(man);
        CreateMap(map);
        getMap();
        coreMove = new Move(this,manX,manY,sizeX,sizeY,man,coin, map,handler);
        coreMove.Refresh();
    }

    void initShowBox(){
        time = new TextView(this);
        score = new TextView(this);
        time.setGravity(Gravity.CENTER);
        score.setGravity(Gravity.CENTER);
        time.setBackgroundColor(getResources().getColor(R.color.background_floating_material_dark));
        score.setBackgroundColor(getResources().getColor(R.color.background_floating_material_dark));
        time.setTextColor(getResources().getColor(R.color.fonts));
        score.setTextColor(getResources().getColor(R.color.fonts));
        score.setText(" " + coreMove.level);
        time.setText("30s");
        container_man.addView(time);
        container_man.addView(score);

        AbsoluteLayout.LayoutParams params= new AbsoluteLayout.LayoutParams(sizeX,sizeY,14*sizeX,0*sizeY);
        score.setLayoutParams(params);
        AbsoluteLayout.LayoutParams params00= new AbsoluteLayout.LayoutParams(sizeX,sizeY,15*sizeX,0*sizeY);
        time.setLayoutParams(params00);

        timer = setTimer(30000, 1000);
        timer.start();
    }

    void initSound(){
        spool = new SoundPool(1, AudioManager.STREAM_MUSIC,0);
        soundcoin = spool.load(this,R.raw.coin,1);
        soundlost = spool.load(this,R.raw.lost,1);
        soundrefresh = spool.load(this,R.raw.win,1);
        soundrecord = spool.load(this,R.raw.record,1);
    }

    //function//////////////////////////////////////////////////////////////////////////////////////
    void refreshMap(){
        CreateMap(map);
        container.removeAllViews();
        getMap();
        coreMove.Refresh();
        score.setText(" " + coreMove.level);
        coreMove.manX = manX;
        coreMove.manY = manY;
        coreMove.initX = manX;
        coreMove.initY = manY;
    }

    void messageBox(String message){
        LayoutInflater inflater=LayoutInflater.from(Survival.this);
        final LinearLayout layout=(LinearLayout)inflater.inflate(R.layout.dialog_lost,null);
        final Dialog dialog = new AlertDialog.Builder(Survival.this).create();
        dialog.show();
        dialog.getWindow().setContentView(layout);
        dialog.setCancelable(false);//设置点击dialog外部是否关闭dialog
        Button again = (Button)layout.findViewById(R.id.again);
        Button quit = (Button)layout.findViewById(R.id.quit);
        TextView Message=(TextView)layout.findViewById(R.id.message);
        Message.setText(message);

        again.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                coreMove.level = 0;
                coreMove.count = 0;
                if (timer != null) timer.cancel();
                refreshMap();
                timer = setTimer(30000, 1000);
                timer.start();
                dialog.dismiss();
            }
        });
        quit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                setResult(coreMove.level);
                finish();

            }
        });
    }

    void getMap(){
        for(int i = 0;i<9;i++)
            for(int j = 0;j<16;j++){
                if(map[i][j] == 2){
                    ImageView view = new ImageView(this);
                    view.setScaleType(ImageView.ScaleType.FIT_XY);
                    view.setImageResource(R.mipmap.bar);
                    container.addView(view);
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX,sizeY,j*sizeX,i*sizeY);
                    view.setLayoutParams(params);
                }
                else if(map[i][j] == 3){
                    manX = j;
                    manY = i;
                    AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX,sizeY,j*sizeX,i*sizeY);
                    man.setLayoutParams(params);
                    map[i][j] = 1;
                }
                    /*else {//use for show the road and empty
                        TextView textView=new TextView(this);
                        textView.setText(" "+coreMap.map[i][j]+" ");
                        textView.setTextColor(getResources().getColor(R.color.fonts));
                        container.addView(textView);
                        AbsoluteLayout.LayoutParams params=new AbsoluteLayout.LayoutParams(sizeX,sizeY,j*sizeX,i*sizeY);
                        textView.setLayoutParams(params);
                    }*/
            }

        /*for(int i=0;i<coreMap.arrayX.size();i++){//use for show the number of the bar
            int X=coreMap.arrayX.get(i);
            int Y=coreMap.arrayY.get(i);
            TextView textView=new TextView(this);
            textView.setText(" "+i+" ");
            textView.setTextColor(getResources().getColor(R.color.fonts));
            container.addView(textView);
            AbsoluteLayout.LayoutParams params=new AbsoluteLayout.LayoutParams(sizeX,sizeY,X*sizeX,Y*sizeY);
            textView.setLayoutParams(params);
        }*/
    }

    //Override//////////////////////////////////////////////////////////////////////////////////////
    @Override
    public void onDestroy(){
        super.onDestroy();
        if(timer != null)timer.cancel();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event){
        if(event.getAction() == MotionEvent.ACTION_DOWN){
            x1 = event.getX();
            y1 = event.getY();
        }
        if(event.getAction() == MotionEvent.ACTION_UP){
            x2 = event.getX();
            y2 = event.getY();
            if (y1 > y2 && (y1 - y2 > Math.abs(x1 - x2)))
            {
                coreMove.moveUp();
            }
            if (y2 > y1 && (y2 - y1 > Math.abs(x1 - x2)))
            {
                coreMove.moveDown();
            }
            if (x1 > x2 && (x1 - x2 > Math.abs(y1 - y2))) {
                coreMove.moveLeft();
            }
            if (x1 < x2 && (x2 - x1 > Math.abs(y1 - y2))) {
                coreMove.moveRight();
            }
        }
        return super.onTouchEvent(event);
    }
}
