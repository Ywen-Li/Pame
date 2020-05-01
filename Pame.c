#include <gtk/gtk.h>
#include <gtk/gtkmain.h>
#include <glib.h>
#include "Variable.h"

extern void BeginWindow();
extern void RandomMap();
extern void init(int, int);
extern void moveUp();
extern void moveDown();
extern void moveLeft();
extern void moveRight();
extern void Refresh();

GtkWidget *window;
GtkWidget *fixed;
GtkWidget *fixedBar;
GtkWidget *man;
GtkWidget *coin;
GtkWidget *score;
GtkWidget *timer;
GtkAccelGroup *gag;

FILE *file;

extern int level, count, finish;
int map[ROW][COLUMN];
int timeNow = 50;
int record = 0;
char buf[4];
char bufPlayer[10];
char bufSoundLost[25];
char bufSoundWin[25];
char bufSoundCoin[25];

guint down;

void configure_event(GtkWindow *window, GdkEvent *event, gpointer data){
	printf("\nConfigure_Event\n");
	int i, j;
	i = event->configure.x;
	j = event->configure.y;
	//gtk_widget_get_size_request(window, i, j);
	printf("%d,%d\n", i, j);
	gtk_widget_show_all(window);
}

void soundGameOver(){
	system("aplay ./Raw/lost.wav");
}

void main_quit(){
	file = fopen("data", "w");
	putc(record, file);
	fclose(file);
	gtk_main_quit();
}

void FreeFixed(){//free the container that contain the game elements
	GList *list = gtk_container_get_children(GTK_CONTAINER(fixedBar));
	for(; list != NULL; list = list->next)
		gtk_widget_destroy(list->data);
}

void gameBack(){
	g_source_remove(down);//free the downtimer
	FreeFixed();
	timeNow =  50;
	finish = 0;
	BeginWindow();
	gtk_widget_hide(man);
	gtk_widget_hide(coin);
}

gboolean downTime(){
	timeNow--;
	sprintf(buf, "%ds", timeNow);
	gtk_label_set_text(GTK_LABEL(timer), buf);
	if(timeNow == 0){
		finish = 1;
		g_thread_new(NULL, (GThreadFunc)soundGameOver, NULL);
		g_source_remove(down);
		GtkWidget *dialog;
		if(level > record){
			record = level;
			char message[30];
			sprintf(message, "New Record:%d!Try Again?", record);
			dialog = gtk_message_dialog_new(window, GTK_DIALOG_DESTROY_WITH_PARENT, GTK_MESSAGE_INFO, GTK_BUTTONS_YES_NO, message);
		}
		else {
			char message[30];
			sprintf(message, "Game Over!You just get:%d\nThe record is:%d!Try Again?", level, record);
			dialog = gtk_message_dialog_new(window, GTK_DIALOG_DESTROY_WITH_PARENT, GTK_MESSAGE_INFO, GTK_BUTTONS_YES_NO, message);
		}
		if(gtk_dialog_run(GTK_DIALOG(dialog)) == GTK_RESPONSE_YES){
			level = 0;
			count = 0;
			timeNow = 50;
			finish = 0;
			down = g_timeout_add(1000,(GSourceFunc)downTime, NULL);
			gtk_label_set_text(GTK_LABEL(score), "0");
			refreshMap();
		}
		else gameBack();
		gtk_widget_destroy(GTK_WIDGET(dialog));
	}
}

void loadMap(){
    GdkPixbuf *bar = gdk_pixbuf_scale_simple(gdk_pixbuf_new_from_file("./Mipmap/bar.png", NULL), SIZE,SIZE, GDK_INTERP_BILINEAR);
    RandomMap();
    for(int i = 0; i < ROW; i++)
	for(int j = 0; j < COLUMN; j++)
	    if(map[i][j] == 2){
	    	if(!(i == 0 && (j == 14 || j == 15))){
				GtkWidget *image = gtk_image_new();
				gtk_image_set_from_pixbuf(GTK_IMAGE(image), bar);
				gtk_fixed_put(GTK_FIXED(fixedBar), image, j * SIZE, i * SIZE);
			}
	    }
	    else if(map[i][j] == 3){
	    	map[i][j] = 1;		
			gtk_fixed_move(GTK_FIXED(fixed), man, j * SIZE, i * SIZE);
			init(j, i);
	    }
	 Refresh();
}

void refreshMap(){
	FreeFixed();
	loadMap();
	gtk_widget_show_all(fixedBar);	
	timeNow += 10;
}

void gameStart(){	
	refreshMap();
	down = g_timeout_add(1000, (GSourceFunc)downTime, NULL);
	gtk_widget_show_all(window);
}

void KeyBoard(){//deploy the keyboard operate
	gag = gtk_accel_group_new();
	//up
	GClosure *up = g_cclosure_new(G_CALLBACK(moveUp), NULL, NULL);
	gtk_accel_group_connect(gag,GDK_KEY_w, (GdkModifierType)0, GTK_ACCEL_VISIBLE,  up);
	//down
	GClosure *down = g_cclosure_new(G_CALLBACK(moveDown), NULL, NULL);
	gtk_accel_group_connect(gag,GDK_KEY_s, (GdkModifierType)0, GTK_ACCEL_VISIBLE, down);
	//left
	GClosure *left = g_cclosure_new(G_CALLBACK(moveLeft), NULL, NULL);
	gtk_accel_group_connect(gag, GDK_KEY_a, (GdkModifierType)0, GTK_ACCEL_VISIBLE, left);
	//right
	GClosure *right = g_cclosure_new(G_CALLBACK(moveRight), NULL, NULL);
	gtk_accel_group_connect(gag,GDK_KEY_d, (GdkModifierType)0, GTK_ACCEL_VISIBLE, right);
	//back
	GClosure *back = g_cclosure_new(G_CALLBACK(gameBack), NULL, NULL);
	gtk_accel_group_connect(gag,GDK_KEY_b, (GdkModifierType)0, GTK_ACCEL_VISIBLE, back);
	//quit
	GClosure *quit = g_cclosure_new(G_CALLBACK(main_quit), NULL, NULL);
	gtk_accel_group_connect(gag,GDK_KEY_q, (GdkModifierType)0, GTK_ACCEL_VISIBLE, quit);
	
	gtk_window_add_accel_group(GTK_WINDOW(window), gag);
}

void MainFixed(){//deploy the main container
	fixed = gtk_fixed_new();
	fixedBar = gtk_fixed_new();
	gtk_container_add(GTK_CONTAINER(window), fixed);
	
	GtkWidget *image = gtk_image_new();
	gtk_image_set_from_pixbuf(GTK_IMAGE(image), gdk_pixbuf_scale_simple(gdk_pixbuf_new_from_file("./Mipmap/background.jpg", NULL), 16 * SIZE,9 * SIZE, GDK_INTERP_BILINEAR));
	coin = gtk_image_new();
	gtk_image_set_from_pixbuf(GTK_IMAGE(coin), gdk_pixbuf_scale_simple(gdk_pixbuf_new_from_file("./Mipmap/coin.png", NULL), SIZE, SIZE, GDK_INTERP_BILINEAR));
	man = gtk_image_new();
	gtk_image_set_from_pixbuf(GTK_IMAGE(man), gdk_pixbuf_scale_simple(gdk_pixbuf_new_from_file("./Mipmap/man.png", NULL), SIZE, SIZE, GDK_INTERP_BILINEAR));
	
	GtkWidget *scoreBox = gtk_event_box_new();
	GtkWidget *timerBox = gtk_event_box_new();
	GdkColor color;
	color.red = 0x002a;
	color.green = 0x008b;
	color.blue = 0x00be;
	gtk_widget_modify_bg(scoreBox, GTK_STATE_NORMAL, &color);
	gtk_widget_modify_bg(timerBox, GTK_STATE_NORMAL, &color);
	score = gtk_label_new("0");
	timer = gtk_label_new("0");
	gtk_container_add(GTK_CONTAINER(scoreBox), score);
	gtk_container_add(GTK_CONTAINER(timerBox), timer);
	gtk_widget_set_size_request(score, SIZE, SIZE);
	gtk_widget_set_size_request(timer, SIZE, SIZE);
	
	gtk_fixed_put(GTK_FIXED(fixed), image, 0, 0);
	gtk_fixed_put(GTK_FIXED(fixed), man, 0, 0);
	gtk_fixed_put(GTK_FIXED(fixed), coin, 0, 0);
	gtk_fixed_put(GTK_FIXED(fixed), scoreBox, 14 * SIZE, 0);
	gtk_fixed_put(GTK_FIXED(fixed), timerBox, 15 * SIZE, 0);
	gtk_fixed_put(GTK_FIXED(fixed), fixedBar, 0, 0);
}

int main(int argc, char *argv[]){
	gtk_init(&argc, &argv);
	
	file = fopen("data","r");
	record = getc(file);
	fclose(file);
	
	window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
	gtk_window_set_position(GTK_WINDOW(window), GTK_WIN_POS_CENTER);
	gtk_container_set_border_width(GTK_CONTAINER(window), 5);
	gtk_window_set_title(GTK_WINDOW(window), "Pame");
	gtk_widget_add_events(GTK_WIDGET(window), GDK_CONFIGURE);
	//gtk_window_set_default_size(GTK_WINDOW(window), 16 * SIZE, 9 * SIZE);
	gtk_widget_set_size_request(window, 16 * SIZE, 9 * SIZE);
	gtk_widget_set_app_paintable(window, TRUE);
	gtk_widget_realize(window);
	g_signal_connect(G_OBJECT(window), "destroy", G_CALLBACK(main_quit), NULL);
	//g_signal_connect(G_OBJECT(window), "configure-event", G_CALLBACK(configure_event), NULL);
	
	KeyBoard();
	MainFixed();

	BeginWindow();
	gtk_widget_hide(man);
	gtk_widget_hide(coin);
	
	//define the sound variable
	sprintf(bufSoundLost, "%s", "mpv ./Raw/out.wav");
	sprintf(bufSoundWin, "%s", "mpv ./Raw/win.wav");
	sprintf(bufSoundCoin, "%s", "mpv ./Raw/coin.wav");

	gtk_main();
	return 0;
}


