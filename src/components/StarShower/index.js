import React from 'react'
import Utli from '../utlis'

const utli= new Utli();
const miniStarNum = 8; // 大球落地产生的小球的数量
const backgroundStarAmount = 150; // 背景星星的数量
const groundHeight = 60; // 地面的高度
let globalCanvas = null;
let stars = [],  // 大的球的存放数组
    miniStars = [], // 小的球的存放数组
    backgroundStars = [],
    ticker = 0,
    randomSpawnRate = 75;

function Star (x = 0, y = 0, radius = 30, color = '#E3EAEF') {
  this.x = x;
  this.y = y;
  this.stepX = utli.randomIntFromRange(-8, 8);
  this.stepY = utli.randomIntFromRange(-4, 4);
  this.radius = radius;
  this.color = color;
  this.c = globalCanvas.getContext('2d');
  this.lostEnergyRadio = 0.9;  // 每次落地后因为会损失一部分能量，变量为剩余能量与之前能量的比值，也就是每一次落地减少当前 10% 的能量
  this.gravity = 1; // 受重力影响的加速度（每次调用函数 animate ，stepY也就是速率都会加 1）
  this.friction = 0.95;
}
Star.prototype.draw = function () {
  // 画星星，决定了星星是什么样子的
  this.c.save();
  this.c.beginPath();
  this.c.arc(this.x, this.y, this.radius,0, Math.PI * 2, false);
  this.c.fillStyle = this.color;
  this.c.shadowColor = `#E3EAEF`;
  this.c.shadowBlur = 25;
  this.c.fill();
  this.c.closePath();
  this.c.restore();
};
Star.prototype.update = function () {
  // 给星星添加动画，改变参数
  // 星星接触底部的时候，反向移动
  if (this.y + this.radius + this.stepY > globalCanvas.height - groundHeight) {
    this.stepY = -this.stepY * this.lostEnergyRadio; // 每次落地损失能量，速率(加速度)减小
    this.shatter();
  } else {
    this.stepY += this.gravity;
  }
  
  if (this.x + this.radius + this.stepX > globalCanvas.width || this.x - this.radius <= 0) {
    this.stepX = -this.stepX * this.friction;
    this.shatter();
  }
  this.x += this.stepX;
  this.y += this.stepY;
  this.draw();
};
Star.prototype.shatter = function () {
  // 大的球落地时要产生 8 个小球，同时大的球自身半径减小
  this.radius -= 3;
  for (let i = 0; i < miniStarNum; i++) {
    // 在大球落地的位置产生小球
    miniStars.push(new MiniStar(this.x, this.y, 2, '#E3EAEF'));
  }
};

function MiniStar(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.stepX = utli.randomIntFromRange(-5, 5);
  this.stepY = utli.randomIntFromRange(-25, 25);
  this.c = globalCanvas.getContext('2d');
  this.lostEnergyRadio = 0.9;
  this.gravity = 0.2;
  this.surviveTime = 100; // 每一个小的球最多能显示的时间
  this.opacity = 1;
}
MiniStar.prototype.draw = function () {
  // 画星星，决定了星星是什么样子的
  // c.save() 和 c.restore() 保证只对这个小的星星起作用
  this.c.save();
  this.c.beginPath();
  this.c.arc(this.x, this.y, this.radius,0, Math.PI * 2, false);
  this.c.fillStyle = `rgba(277, 234, 239, ${this.opacity})`;
  this.c.shadowColor = `#E3EAEF`;
  this.c.shadowBlur = 25;
  this.c.fill();
  this.c.closePath();
  this.c.restore();
};
MiniStar.prototype.update = function () {
  if (this.y + this.radius + this.stepY > globalCanvas.height - groundHeight) {
    this.stepY = -this.stepY * this.lostEnergyRadio; // 每次落地损失能量，速率(加速度)减小
  } else {
    this.stepY += this.gravity;
  }
  this.y += this.stepY;
  this.x += this.stepX;
  this.surviveTime -= 1;
  this.opacity -= 1 / this.surviveTime;
  this.draw();
};

function createMountainRange(mountainAmount, mountainHeight, color) {
  const c = globalCanvas.getContext('2d');
  for (let i = 0; i < mountainAmount; i++) {
    const mountainWidth = globalCanvas.width / mountainAmount;
    c.beginPath();
    c.moveTo(i * mountainWidth, globalCanvas.height);
    c.lineTo(i * mountainWidth + mountainWidth + 300, globalCanvas.height); // 左边山脚的坐标 (加 300 与浏览器底部空出一段距离)
    c.lineTo(i * mountainWidth + mountainWidth / 2, globalCanvas.height - mountainHeight); // 山顶的坐标, globalCanvas.height - mountainHeight 为实际的山的高度
    c.lineTo(i * mountainWidth - 300, globalCanvas.height); // 右边山脚的坐标
    c.fillStyle = color;
    c.fill();
    c.closePath();
  }
}

class StarShower extends React.Component {
  constructor (props) {
    super(props);
    this.canvas = null;
    this.c = null;
    this.colors = ['#2185c5', '#7ecefd', '#fff6e5', '#ff7f66'];
    this.backgroundGradient = null;
  }
  init () {
    stars = [];
    miniStars = [];
    backgroundStars = [];
    
    for (let i = 0; i < backgroundStarAmount; i++) {
      // 背景的星星
      const x = utli.randomIntFromRange(0, this.canvas.width);
      const y = utli.randomIntFromRange(0, this.canvas.height);
      const radius = utli.randomIntFromRange(1, 3);
      backgroundStars.push(new Star(x , y, radius, 'white'))
    }
  }
  animate () {
    console.log('animate');
    requestAnimationFrame(() => {this.animate()});
    this.c.fillStyle = this.backgroundGradient;
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    backgroundStars.forEach(backgroundStar => {
      backgroundStar.draw();
    });
  
    createMountainRange(1, this.canvas.height - 50, '#384451');
    createMountainRange(2, this.canvas.height - 100, '#2b3843');
    createMountainRange(3, this.canvas.height - 300, '#26333e');
    
    /* 绘制地面 */
    this.c.fillStyle = '#182028';
    // 四个参数：起始的 x ，y坐标，宽度，高度
    this.c.fillRect(0, this.canvas.height - groundHeight, this.canvas.width, groundHeight);
  
    stars.forEach((star, index) => {
      star.update();
      if (star.radius <= 0) {
        stars.splice(index, 1);
      }
    });
    miniStars.forEach((miniStar, index) => {
      miniStar.update();
      if (miniStar.surviveTime === 0) {
        // 如果时间到了就把这个球从数组中移出去，这样就看不到了
        miniStars.splice(index, 1)
      }
    });
    
    /* 每当 ticker 是一个随机产生的整数的倍数的时候，就掉落一颗星星 */
    ticker++;
    if (ticker % randomSpawnRate === 0) {
      const radius = 12;
      const x = utli.randomIntFromRange(radius, this.canvas.width) - radius;
      stars.push(new Star(x, -100,radius, 'white'));
      randomSpawnRate = utli.randomIntFromRange(75, 150);
    }
  }
  componentDidMount() {
    this.canvas = this.star;
    this.c = this.canvas.getContext('2d');
    this.backgroundGradient = this.c.createLinearGradient(0, 0, 0, this.canvas.height);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    globalCanvas = this.canvas;
    this.backgroundGradient.addColorStop(0, '#171e26');
    this.backgroundGradient.addColorStop(1, '#3f586b');
    this.init();
    this.animate();
    
    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      this.init();
    })
  }
  
  render() {
    return (
      <canvas id="starShower" ref={c => this.star = c}/>
    )
  }
}

export default StarShower;