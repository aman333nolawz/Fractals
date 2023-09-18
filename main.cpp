#include <SFML/Graphics.hpp>
#include <iostream>
#include <string>

int main(int argc, char *argv[]) {
  sf::RenderWindow window(sf::VideoMode(600, 600), "Fractal Renderer");
  sf::Clock clock;
  std::string shaderFile;

  if (argc < 2) {
    std::cout << "Usage: fractals <fractal shader>" << std::endl;
    return EXIT_FAILURE;
  } else {
    shaderFile = argv[1];
  }

  sf::Shader shader;
  if (!shader.loadFromFile(shaderFile, sf::Shader::Fragment)) {
    return EXIT_FAILURE;
  }

  float zoom = 1.0;
  sf::Vector2f zoomCenter(0.0f, 0.0f);
  shader.setUniform("zoom", zoom);
  shader.setUniform("zoomCenter", zoomCenter);

  while (window.isOpen()) {
    int W = window.getSize().x;
    int H = window.getSize().y;
    sf::Event event;
    while (window.pollEvent(event)) {
      if (event.type == sf::Event::Closed) {
        window.close();
      } else if (event.type == sf::Event::MouseWheelScrolled) {
        if (event.mouseWheelScroll.wheel == sf::Mouse::VerticalWheel) {

          sf::Vector2i mousePos = sf::Mouse::getPosition(window);
          zoomCenter.x +=
              (2.0 / zoom) * (static_cast<float>(mousePos.x) / W - 0.5);
          zoomCenter.y +=
              (2.0 / zoom) * (0.5 - static_cast<float>(mousePos.y) / H);
          if (event.mouseWheelScroll.delta == 1) {
            zoom *= 1.1;
          } else {
            zoom /= 1.1;
          }
        }

        shader.setUniform("zoom", zoom);
        shader.setUniform("zoomCenter", zoomCenter);
      }
    }

    shader.setUniform("resolution", sf::Vector2f(W, H));

    window.clear();
    sf::RectangleShape fullscreenRect(
        sf::Vector2f(window.getSize().x, window.getSize().y));
    window.draw(fullscreenRect, &shader);
    window.display();
  }

  return EXIT_SUCCESS;
}
