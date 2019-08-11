class Utli {
  randomIntFromRange(min, max) {
    // 在 min ~ max 范围内随机产生一个整数
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  generateRandomColor (colors) {
    // colors 是一个颜色的数组，根据传入的颜色数组随机从中选取一个颜色
    return colors[Math.floor(Math.random() * colors.length)]
  }
  distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
    
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
  }
}

export  default Utli