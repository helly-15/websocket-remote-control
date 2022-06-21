import robot from "robotjs";

export const drawRect = (width, height) => {
    let mousePos = robot.getMousePos();
    robot.mouseToggle("down");
    robot.dragMouse(mousePos.x + width, mousePos.y)
    robot.dragMouse(mousePos.x + width, mousePos.y - height);
    robot.dragMouse(mousePos.x, mousePos.y - height);
    robot.dragMouse(mousePos.x, mousePos.y);
    robot.mouseToggle("up");
}