Pame:Pame.o Move.o RandomMap.o Begin.o
	gcc -g -o Pame `pkg-config --cflags --libs gtk+-3.0` Pame.o Move.o RandomMap.o Begin.o
Pame.o:Pame.c
	gcc -c `pkg-config --cflags --libs gtk+-3.0` Pame.c
Move.o:Move.c
	gcc -c `pkg-config --cflags --libs gtk+-3.0` Move.c
RandomMap.o:RandomMap.c
	gcc -c `pkg-config --cflags --libs gtk+-3.0` RandomMap.c
Begin.o:Begin.c
	gcc -c `pkg-config --cflags --libs gtk+-3.0` Begin.c
clean:
	rm Pame.o Move.o RandomMap.o Begin.o
