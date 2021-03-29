class MiniMap {
  constructor() {
    console.log("creating minimap");
    this.canvas = document.getElementById("canvasMiniMap");
    this.ctx = this.canvas.getContext("2d");
    this.playerCells = [];
    this.gameFieldWidth = null;
    this.gameFieldHeight = null;

  }

  setGameFieldWidth(width) {
    if (this.gameFieldWidth === null) {
      this.gameFieldWidth = Math.abs(width);
      Object.freeze(this.gameFieldWidth);
    }
  }

  setGameFieldHeight(height) {
    if (this.gameFieldHeight === null) {
      this.gameFieldHeight = Math.abs(height);
      Object.freeze(this.gameFieldHeight);
    }
  }


  // -- Board size --
  // topLeft: x: -7053, y: -7053
  // bottomLLeft: x: -7052, y: 7052
  // bottomRight: x: 7051, y: 7051
  // Topleft: x: 7048, y: -7048

  updatePlayerCells(playerCells) {


    if (playerCells && playerCells.length > 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      const { x, y } = this.mapCoordinatesToMiniMap({
        x: playerCells[0]["x"],
        y: playerCells[0]["y"],
      });

      // this.ctx.rect(x, y, 10, 10);
     this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
      this.ctx.fillStyle = playerCells[0]["color"];
      this.ctx.fill();
      this.ctx.stroke();
    }
  }
  mapCoordinatesToMiniMap({ x, y }) {
    //game field width ......  x pos on original game field
    //mini map width ...... ? (x pos on mini map)
    // console.log("original:")
    // console.log(x,y)
    let newCordX = 0;
    let newCordY = 0;
    
    if (x < 0) newCordX = this.gameFieldWidth - Math.abs(x);
    else newCordX = this.gameFieldWidth + x;
    
    if (y < 0) newCordY = this.gameFieldHeight - Math.abs(y);
    else newCordY = this.gameFieldHeight + y;
    // console.log("gameFieldHeight: " + this.gameFieldHeight + "\nnewCordY: " + newCordY)

    const newX = (newCordX / (this.gameFieldWidth * 2)) * this.canvas.width;
    const newY = (newCordY / (this.gameFieldHeight * 2)) * this.canvas.height;
    // console.log("new:")
    // console.log(newX,newY)
    // console.log("---------------")
    return { x: newX, y: newY };
  }
}
