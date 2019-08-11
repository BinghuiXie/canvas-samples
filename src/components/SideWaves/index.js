import React from 'react'
import * as dat from 'dat.gui';

const gui = new dat.GUI();

class Canvas extends React.Component {
  constructor (props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.setCanvas = this.setCanvas.bind(this);
  }
  
  animate (canvas, c, wave, strokeColor, fillColor, increment) {
    requestAnimationFrame(() => {this.animate(canvas, c, wave, strokeColor, fillColor, increment)});
    c.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${fillColor.a})`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    c.beginPath();
    c.moveTo(0, canvas.height / 2); // 从屏幕中央开始画
    for (let i = 0; i < canvas.width; i++) {
      // wave.amplitude / i * 100 使正弦波的振幅以一个任意的函数趋势变化，看哪个长得好看
      c.lineTo(i, wave.y + Math.sin(i * wave.length + increment) * wave.amplitude / i * 100); // 一共有 canvas.width 个像素点，这些像素点组成了这一条线，这样这条线上每一个点的坐标都是可以控制的
      // y 方向的坐标在屏幕中央的基础上，以当前像素点的横坐标为基准根据 sin 函数生成一个 y 方向的坐标，这样显示出来的就是正弦波，乘以 wave.amplitude 意思是 在 y 方向的坐标大一些，看得清楚
      // i * wave.length 是为了增大周期，相当于把正弦波横向拉长（想象弹簧被拉长时候的样子）
      // + increment 为了在 x 方向上平移
    }
    // Math.abs(strokeColor.h * Math.sin(increment)) 使颜色不断以一个正弦的趋势变化，且永远是正值
    c.strokeStyle = `hsl(${Math.abs(strokeColor.h * Math.sin(increment))}, ${strokeColor.s}%, ${strokeColor.l}%)`;
    c.stroke();
    // 每次调用 animate 函数，increment 增加，这样看起来就是正弦曲线在平移
    increment += wave.frequency;
  }
  
  setCanvas () {
    const canvas = this.canvas;
    const c = canvas.getContext("2d");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const wave = {
      y: canvas.height / 2,
      length: 0.01, // 欧米伽
      amplitude: 100, // 振幅
      frequency: 0.25
    };
    /* 正弦曲线的颜色参数 */
    const strokeColor = {
      h: 200,
      s: 50,
      l: 50
    };
    /* 背景填充的颜色参数 */
    const fillColor = {
      r: 0,
      g: 0,
      b: 0,
      a: 0.01
    };
    let increment = wave.frequency;
  
    // 通过 dat.gui 这个库，添加 wave 对象的几个属性进来，这样就可以在规定范围内随意的调整三个参数的值
    // waveFolder 和 strokeColorFolder 为每一种对象添加一个文件夹，这样在浏览器里看起来二者有明确的分界
    const waveFolder = gui.addFolder('wave');
    waveFolder.add(wave, 'y', 0, canvas.height);
    waveFolder.add(wave, 'length', -0.01, 0.01);
    waveFolder.add(wave, 'amplitude', -300, 300);
    waveFolder.add(wave, 'frequency', 0, 1);
    // 文件夹默认是展开的
    waveFolder.open();
  
    const strokeColorFolder = gui.addFolder('strokeColor');
    strokeColorFolder.add(strokeColor, 'h', 0, 255);
    strokeColorFolder.add(strokeColor, 's', 0, 100);
    strokeColorFolder.add(strokeColor, 'l', 0, 100);
    strokeColorFolder.open();
    
    const fillColorFolder = gui.addFolder('fillColor');
    fillColorFolder.add(fillColor, 'r', 0, 255);
    fillColorFolder.add(fillColor, 'g', 0, 255);
    fillColorFolder.add(fillColor, 'b', 0, 255);
    fillColorFolder.add(fillColor, 'a', 0, 1);
    fillColorFolder.open();
    this.animate(canvas, c, wave, strokeColor, fillColor, increment);
  }
  
  componentDidMount() {
    this.setCanvas();
  }
  
  render() {
    return (
      <canvas id="canvas" ref={c => this.canvas = c} />
    )
  }
}

export default Canvas