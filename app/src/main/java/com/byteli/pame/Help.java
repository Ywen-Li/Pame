package com.byteli.pame;

import android.content.DialogInterface;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.MotionEvent;
import android.widget.AbsoluteLayout;
import android.widget.ImageView;
import android.widget.TextView;

/**
 * Created by byte on 11/30/15.
 */
public class Help extends AppCompatActivity {
    AbsoluteLayout container;
    Move coreMove;
    int sizeX, sizeY;
    ImageView man;
    ImageView coin;
    int[][] map = new int[9][16];
    int[][] array = {{8, 1}, {3, 4}, {14, 4}, {13, 7}};
    float x1, x2, y1, y2;
    boolean moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
    boolean finish = false, step = false;
    SoundPool spool;
    int soundwarn, soundcoin;

    Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (msg.obj.equals("soundcoin")) spool.play(soundcoin, 1, 1, 0, 0, 1);
            else messageBox(msg.obj.toString());
        }
    };

    @Override
    protected void onCreate(Bundle save) {
        super.onCreate(save);
        setContentView(R.layout.mode_help);
        DisplayMetrics dm = new DisplayMetrics();
        super.getWindowManager().getDefaultDisplay().getMetrics(dm);
        sizeX = dm.widthPixels / 16;
        sizeY = dm.heightPixels / 9;

        imageViewLayout();
        showBoxLayout();
        initSound();

        coreMove = new Move(this, 8, 4, sizeX, sizeY, man, coin, map, handler);
        messageBox(getResources().getString(R.string.help_message0));
        moveUp = true;
    }

    void imageViewLayout() {
        for (int i = 0; i < 9; i++)
            for (int j = 0; j < 16; j++) map[i][j] = 1;

        int x, y;
        container = (AbsoluteLayout) findViewById(R.id.container);
        for (int i = 0; i < 4; i++) {
            x = array[i][0];
            y = array[i][1];
            ImageView view00 = new ImageView(this);
            view00.setScaleType(ImageView.ScaleType.FIT_XY);
            view00.setImageResource(R.mipmap.bar);
            container.addView(view00);
            AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX, sizeY, x * sizeX, y * sizeY);
            view00.setLayoutParams(params);
            map[y][x] = 2;
        }

        man = new ImageView(this);
        man.setScaleType(ImageView.ScaleType.FIT_XY);
        man.setImageResource(R.mipmap.man);
        container.addView(man);
        AbsoluteLayout.LayoutParams params00 = new AbsoluteLayout.LayoutParams(sizeX, sizeY, 8 * sizeX, 4 * sizeY);
        man.setLayoutParams(params00);

        coin = new ImageView(this);
        coin.setScaleType(ImageView.ScaleType.FIT_XY);
        coin.setImageResource(R.mipmap.coin);
        container.addView(coin);
        AbsoluteLayout.LayoutParams params01 = new AbsoluteLayout.LayoutParams(sizeX, sizeY, 11 * sizeX, 6 * sizeY);
        coin.setLayoutParams(params01);
        map[6][11] = 3;

    }

    void showBoxLayout() {
        TextView time = new TextView(this);
        TextView score = new TextView(this);
        time.setGravity(Gravity.CENTER);
        score.setGravity(Gravity.CENTER);
        time.setBackgroundColor(getResources().getColor(R.color.background_floating_material_dark));
        score.setBackgroundColor(getResources().getColor(R.color.background_floating_material_dark));
        time.setTextColor(getResources().getColor(R.color.fonts));
        score.setTextColor(getResources().getColor(R.color.fonts));
        score.setText("Score");
        time.setText("Time");
        container.addView(time);
        container.addView(score);

        AbsoluteLayout.LayoutParams params = new AbsoluteLayout.LayoutParams(sizeX, sizeY, 14 * sizeX, 0 * sizeY);
        score.setLayoutParams(params);
        AbsoluteLayout.LayoutParams params00 = new AbsoluteLayout.LayoutParams(sizeX, sizeY, 15 * sizeX, 0 * sizeY);
        time.setLayoutParams(params00);
    }

    void initSound() {
        spool = new SoundPool(1, AudioManager.STREAM_MUSIC, 0);
        soundcoin = spool.load(this, R.raw.coin, 1);
        soundwarn = spool.load(this, R.raw.warn, 1);
    }

    void messageBox(String message) {
        //LayoutInflater inflater = LayoutInflater.from(Help.this);
        //final LinearLayout layout = (LinearLayout)inflater.inflate(R.layout.dialog_help,null);
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        final AlertDialog.Builder dialog = new AlertDialog.Builder(this).setTitle(R.string.dlg_tips).setCancelable(false).setMessage(message)
                .setPositiveButton(R.string.btn_ok, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (finish) Help.this.finish();
                    }
                });
        dialog.create().show();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            x1 = event.getX();
            y1 = event.getY();
        }
        if (event.getAction() == MotionEvent.ACTION_UP) {
            x2 = event.getX();
            y2 = event.getY();
            if (y1 > y2 && (y1 - y2 > Math.abs(x1 - x2))) {
                if (moveUp) {
                    coreMove.moveUp();
                    moveUp = false;
                    moveLeft = true;
                    handler.sendMessage(handler.obtainMessage(1, getResources().getString(R.string.help_message1)));
                } else spool.play(soundwarn, 1, 1, 0, 0, 1);
            }
            if (y2 > y1 && (y2 - y1 > Math.abs(x1 - x2))) {
                if (moveDown) {
                    coreMove.moveDown();
                    moveDown = false;
                    moveLeft = true;
                    handler.sendMessage(handler.obtainMessage(1, getResources().getString(R.string.help_message4)));
                } else spool.play(soundwarn, 1, 1, 0, 0, 1);
            }
            if (x1 > x2 && (x1 - x2 > Math.abs(y1 - y2))) {
                if (moveLeft) {
                    coreMove.moveLeft();
                    moveLeft = false;
                    moveRight = true;
                    if (step) {
                        finish = true;
                        handler.sendMessage(handler.obtainMessage(1, getResources().getString(R.string.help_message5)));
                    } else {
                        step = true;
                        handler.sendMessage(handler.obtainMessage(1, getResources().getString(R.string.help_message2)));
                    }
                } else spool.play(soundwarn, 1, 1, 0, 0, 1);
            }
            if (x1 < x2 && (x2 - x1 > Math.abs(y1 - y2))) {
                if (moveRight) {
                    coreMove.moveRight();
                    moveRight = false;
                    moveDown = true;
                    handler.sendMessage(handler.obtainMessage(1, getResources().getString(R.string.help_message3)));
                } else spool.play(soundwarn, 1, 1, 0, 0, 1);
            }
        }
        return super.onTouchEvent(event);
    }
}
