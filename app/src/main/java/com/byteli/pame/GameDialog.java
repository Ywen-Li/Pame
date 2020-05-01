package com.byteli.pame;

import android.app.ProgressDialog;
import android.content.Context;

/**
 * Created by byte on 11/30/15.
 */
public class GameDialog {
    ProgressDialog gameDialog;
    Context context;

    public GameDialog(Context context){
        this.context = context;
    }

    public void dialogProgress(String message){
        gameDialog = new ProgressDialog(context);
        gameDialog.setTitle(R.string.app_name);
        gameDialog.setMessage(message);
        gameDialog.show();

    }
}
