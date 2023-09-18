build:
	g++ -c main.cpp
	g++ -o fractals main.cpp -lsfml-graphics -lsfml-window -lsfml-system -lGL
