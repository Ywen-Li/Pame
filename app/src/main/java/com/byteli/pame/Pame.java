package com.byteli.pame;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class Pame extends AppCompatActivity {

    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    TextView Record;
    int record;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pame);

        preferences = getSharedPreferences("WiseCoin", 0);
        editor= preferences.edit();

        Record = (TextView)findViewById(R.id.record);
        record = preferences.getInt("Record",0);
        Record.setText(record + " ");

        Button start = (Button)findViewById(R.id.start);
        start.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Pame.this,Survival.class);
                intent.putExtra("Record",record);
                startActivityForResult(intent, 0);
            }
        });

        Button help = (Button)findViewById(R.id.help);
        help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(Pame.this,Help.class));
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode,int resultCode,Intent data){
        if(resultCode> record) {
            record = resultCode;
            Record.setText(+resultCode + " ");
            editor.putInt("Record", resultCode);
            editor.commit();
        }
    }
}
