#include <gtk/gtk.h>
#include <gdk/gdkkeysyms.h>
#include "Variable.h"

extern GtkWidget *window;
extern GtkWidget *fixedBar;
extern int record;
extern void gameStart();

void enter_event(GtkWidget *widget, GdkEventButton *event, gpointer pointer){
	printf("\nEnter_event\n");
}

void BeginWindow(){
	GtkWidget *butStart;
	GtkWidget *labScore;
	GtkWidget *eventStart;
	GtkWidget *labelStart;
	
	char bufScore[4];
	
	//butStart = gtk_button_new_with_label("Start");
	sprintf(bufScore,"%d",record);
	labScore = gtk_label_new(bufScore);

	eventStart = gtk_event_box_new();
	gtk_widget_set_events(eventStart, GDK_BUTTON_PRESS_MASK);
		
	labelStart = gtk_label_new("Start");
	gtk_container_add(GTK_CONTAINER(eventStart), labelStart);
	g_signal_connect(eventStart, "enter_notify_event", G_CALLBACK(enter_event), NULL);
	g_signal_connect(eventStart, "button_press_event", G_CALLBACK(gameStart), NULL);

	
	
	//g_signal_connect(butStart,"clicked",G_CALLBACK(gameStart),NULL);
	
	gtk_fixed_put(GTK_FIXED(fixedBar),labScore,7 * SIZE,3 * SIZE);
	gtk_fixed_put(GTK_FIXED(fixedBar),eventStart,7 * SIZE,5 * SIZE);
	
	gtk_widget_show_all(window);
}
