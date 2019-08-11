import React from 'react'

const gravity = 1;
const friction = 0.35; // 代表球每一次接触浏览器底部损失的能量（每一次接触损失原来的百分之一）
let ballArray;
const colors = [
  '#2185c5',
  '#7ecefd',
  '#fff6e5',
  '#ff7f66'
];

class Ball{
  // 画圆函数，属性为起始坐标，半径和颜色
  constructor (x, y, stepX, stepY, radius, color, c, canvas) {
    this.x = x;
    this.y = y;
    this.stepX = stepX;
    this.stepY = stepY;
    this.radius = radius;
    this.color = color;
    this.c = c;
    this.canvas = canvas;
  }
  draw () {
    // 画圆
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c.fillStyle = this.color;
    this.c.stroke();
    this.c.fill();
    this.c.closePath();
    this.update();
  }
  update() {
    // 每一次动画更新圆的参数
    if (this.y + this.radius + this.stepY > this.canvas.height) {
      // 球每次碰到浏览的底部（地面）会损失一部分能量导致球不能反弹会原来的高度，所以每一次接触浏览器底部，stepY 反向的同时减小 stepY， 这样上升的高度就变小了
      this.stepY = -this.stepY * (1 - friction);
      this.stepX = this.stepX * 0.992;
    } else {
      // 球在重力的作用下下落速度越来越快，也就是 stepY（每一次调用 animate 函数绘制球时球在 y 轴上平移的距离）变大，这样每一次调用 animate 函数平移距离变大，看起来就是下落速度变快了
      this.stepY += gravity;
    }
    if (this.x + this.radius + this.stepX > this.canvas.width || this.x - this.radius <= 0) {
      this.stepX = -this.stepX;
    }
    this.x += this.stepX;
    this.y += this.stepY;
  }
}

class Gravity extends React.Component {
  constructor(props){
    super(props);
  }
  initCanvas () {
    ballArray = []; // 每次调用 init 的时候清空一下 ballArray，否则里面的数据会越来越多
    const canvas = this.gravity;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const c = canvas.getContext('2d');
    for (let i = 0; i < 100; i++) {
      const radius = this.randomIntFromRange(8, 20);
      const x = this.randomIntFromRange(radius, canvas.width - radius);
      const y = this.randomIntFromRange(radius, canvas.height - 2 * radius);
      const stepX = this.randomIntFromRange(-3, 3);
      const stepY = this.randomIntFromRange(-2, 2);
      const color = this.generateRandomColor(colors);
      ballArray.push(new Ball(x, y, stepX, stepY, radius, color, c, canvas))
    }
    this.animate(canvas);
  }
  animate (canvas) {
    console.log('animate called');
    const c = canvas.getContext('2d');
    requestAnimationFrame(() => {this.animate(canvas)});
    c.clearRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < ballArray.length; i++) {
      ballArray[i].draw();
    }
  }
  randomIntFromRange(min, max) {
    // 在 min ~ max 范围内随机产生一个整数
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  generateRandomColor (colors) {
    // colors 是一个颜色的数组，根据传入的颜色数组随机从中选取一个颜色
    return colors[Math.floor(Math.random() * colors.length)]
  }
  restartCanvas () {
    this.initCanvas();
  }
  componentDidMount() {
    this.initCanvas();
  }
  
  render() {
    return (
      <canvas id="gravity" ref={c => this.gravity = c} onClick={() => {this.restartCanvas()}}/>
    )
  }
}

export default Gravity