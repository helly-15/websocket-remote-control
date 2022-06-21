import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import {WebSocketServer} from 'ws';

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
        let movePixels = data[1];
        switch (moveDirection) {
            case 'mouse_up':
                robot.moveMouse(mousePos.x, mousePos.y - Number(movePixels));
                break;
            case 'mouse_down':
                robot.moveMouse(mousePos.x, mousePos.y + Number(movePixels));
                break;
            case 'mouse_left':
                robot.moveMouse(mousePos.x - Number(movePixels), mousePos.y);
                break;
            case 'mouse_right':
                robot.moveMouse(mousePos.x + Number(movePixels), mousePos.y);
                break;
            case 'mouse_position':
                ws.send(`mouse_position ${mousePos.x},${mousePos.y}`);
                break;
            case 'draw_circle':
                const x = mousePos.x + (Number(movePixels));
                const y = mousePos.y;
                robot.dragMouse(x, y);
                robot.mouseToggle("down");
                for (let i = 0; i <= Math.PI * 2; i += 0.01) {
                    // Convert polar coordinates to cartesian
                    const x = mousePos.x + (Number(movePixels) * Math.cos(i));
                    const y = mousePos.y + (Number(movePixels) * Math.sin(i));
                    robot.dragMouse(x, y);
                }
                robot.mouseToggle("up");
                break;
            case 'draw_square':

                robot.mouseToggle("down");
                robot.dragMouse(mousePos.x + Number(movePixels), mousePos.y);
                mousePos = robot.getMousePos();
                robot.dragMouse(mousePos.x, mousePos.y - Number(movePixels));
                mousePos = robot.getMousePos();
                robot.dragMouse(mousePos.x - Number(movePixels), mousePos.y);
                mousePos = robot.getMousePos();
                robot.dragMouse(mousePos.x, mousePos.y + Number(movePixels));
                robot.mouseToggle("up");
                break;
            case 'draw_rectangle':
                let movePixelsHeight = data[2];
                console.log('draw_rectangle');

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


