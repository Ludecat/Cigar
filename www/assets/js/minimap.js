 class MiniMap {
  constructor(){
    console.log("creating minimap")
    this.canvas = document.getElementById("canvasMiniMap")
    this.ctx = this.canvas.getContext("2d")
    this.playerCells = []
    this.extendedBorderWidth = 0
    this.extendedBorderHeight = 0

    setInterval(() => {
      console.log(this.playerCells[0]["x"], this.playerCells[0]["y"])
    }, 10000)

  }

  setExtendedBorderWidth(width){
    this.extendedBorderWidth = width
  }

  setExtendedBorderHeight(height){
    this.extendedBorderHeight = height
  }

  // addCell(cell){
  //   console.log(cell)
  // }



  // -- Board size --
  // topLeft: x: -7053, y: -7053
  // bottomLLeft: x: -7052, y: 7052
  // x: 7051, y: 7051
  // x: 7048, y: -7048


  updatePlayerCells(playerCells){
    // this.playerCells = playerCells

    this.extendedBorderWidth = 7052
    this.extendedBorderHeight = 7052

    if(playerCells && playerCells.length > 0){
      this.ctx.beginPath();
      // this.ctx.arc(100, 75, 5, 0, 2 * Math.PI);
      const {x, y} = this.mapCoordinates({x: playerCells[0]["x"], y: playerCells[0]["y"]})
    

      this.ctx.rect(x, y, 10, 10);

      this.ctx.fillStyle = playerCells[0]["color"];
      this.ctx.fill();

    }

    
  }
  mapCoordinates({x, y}){
    //game widht .---  x pos
    //minimap width --- ?
    // console.log(x, y)
    // console.log(this.canvas.width)
    // console.log(this.canvas.height)

    let newCordX = 0
    let newCordY = 0


    if(x < 0) newCordX = this.extendedBorderWidth - Math.abs(x)
    else newCordX = this.extendedBorderWidth + x

    if(x < 0) newCordY = this.extendedBorderHeight - Math.abs(y)
    else newCordY = this.extendedBorderHeight + y
    
    const newX = newCordX / (this.extendedBorderWidth * 2) * this.canvas.width
    const newY = newCordY / (this.extendedBorderHeight * 2) * this.canvas.height
    console.log(newX, newY)
    // console.log("----")

    return {x: newX, y: newY}
  
  }
}

