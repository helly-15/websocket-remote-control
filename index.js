import Jimp from 'jimp';
import {httpServer} from './src/http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


const wss = new WebSocketServer({
    port: 8080
});

wss.on('connection', ws=>{
    console.log('connection accepted')
    ws.send('connection settled');

    ws.on('message',async wsData => {
        let mousePos = robot.getMousePos();
        const data = wsData.toString().split(' ');
        let moveDirection = data[0];
        let movePixels = data[1];
        switch (moveDirection){
            case 'mouse_up':
                console.log ('mouse up');
                robot.moveMouse(mousePos.x, mousePos.y-Number(movePixels));
                break;
            case 'mouse_down':
                console.log ('mouse down');
                robot.moveMouse(mousePos.x,mousePos.y+ Number(movePixels));
                break;
            case 'mouse_left':
                console.log ('mouse left');
                robot.moveMouse(mousePos.x-Number(movePixels), mousePos.y);
                break;
            case 'mouse_right':
                console.log ('mouse right');
                robot.moveMouse(mousePos.x + Number(movePixels), mousePos.y);
                break;
            default:
                console.log ('error occurred');
        }
    });

});
wss.on('close',()=>{
    console.log('wss closed')
})


