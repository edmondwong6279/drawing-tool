# Doodle application in canvas
This is a simple drawing application that randomises the brush size and colour every time there is a mouseup or when teh mouse exits the bounds of the canvas layer.

We tried 2 methods, one of which did not work at all and was horrifically slow.

Rendering on two seperate canvases improves performance massively (as per docs).

## Running the application:
Developed using node 16.17.1.

```yarn install```

```yarn build```

```yarn start```

