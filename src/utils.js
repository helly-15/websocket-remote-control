export const drawRect = (robot, mousePos, width, height) => {
    robot.mouseToggle("down");
    robot.moveMouseSmooth(mousePos.x + width, mousePos.y)
    robot.moveMouseSmooth(mousePos.x + width, mousePos.y + height);
    robot.moveMouseSmooth(mousePos.x, mousePos.y + height);
    robot.moveMouseSmooth(mousePos.x, mousePos.y);
    robot.mouseToggle("up");
}