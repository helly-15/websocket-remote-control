import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import {WebSocketServer} from 'ws';
import {drawRect} from "./src/utils.js";

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


const wss = new WebSocketServer({
    port: 8080
});

wss.on('connection', ws => {
    console.log('connection accepted')
    ws.send('connection settled');

    ws.on('message', async wsData => {
        let mousePos = robot.getMousePos();
        const data = wsData.toString().split(' ');
        let moveDirection = data[0];
        let movePixels = Number(data[1]);
        console.log(moveDirection)
        switch (moveDirection) {
            case 'mouse_up':
                robot.moveMouse(mousePos.x, mousePos.y - movePixels);
                break;
            case 'mouse_down':
                robot.moveMouse(mousePos.x, mousePos.y + movePixels);
                break;
            case 'mouse_left':
                robot.moveMouse(mousePos.x - movePixels, mousePos.y);
                break;
            case 'mouse_right':
                robot.moveMouse(mousePos.x + movePixels, mousePos.y);
                break;
            case 'mouse_position':
                ws.send(`mouse_position ${mousePos.x},${mousePos.y}`);
                break;
            case 'draw_circle':
                const x = mousePos.x + (movePixels);
                const y = mousePos.y;
                robot.dragMouse(x, y);
                robot.mouseToggle("down");
                for (let i = 0; i <= Math.PI * 2; i += 0.01) {
                    const x = mousePos.x + (movePixels * Math.cos(i));
                    const y = mousePos.y + (movePixels * Math.sin(i));
                    robot.dragMouse(x, y);
                }
                robot.mouseToggle("up");
                break;
            case 'draw_square':
                 drawRect(robot, mousePos, movePixels, movePixels)
                break;
            case 'draw_rectangle':
                let movePixelsHeight = Number(data[2]);
                drawRect(robot, mousePos, movePixels,movePixelsHeight)
                break;
            default:
                console.log('error occurred');
        }
    });

});
process.on('SIGINT', () => {
    wss.close();
})
wss.on('close', () => {
    console.log('wss closed')
})


