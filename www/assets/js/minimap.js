class MiniMap {
  constructor(teamColorsDictionary) {
    this.canvas = document.getElementById("canvasMiniMap");
    this.ctx = this.canvas.getContext("2d");
    this.gameFieldWidth = null;
    this.gameFieldHeight = null;
    this.nodeId = null;
    this.ownerId = null

    // // skin images route
    // this.SKIN_URL = "./skins/";
    this.teamColorsDictionary = teamColorsDictionary
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

  //playerCell:
  // {
  // nodeId,
  // ownerId,
  // ownerName,
  // skin,
  // color,
  // positionX,
  // positionY,
  // team,
  // size,
  // }

  updateOtherPlayers(playerCells, skins) {

    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (playerCells && playerCells.length > 0) {

      playerCells.forEach((playerCell) => {
        
        ctx.beginPath();
        const size = 2 + playerCell.size * 0.05;
        
        const { x, y } = this.mapCoordinatesToMiniMap({
          x: playerCell.positionX,
          y: playerCell.positionY,
        });
        
        let fillColor = "";
        
        if (this.hasTeam(playerCell, skins)) {

          fillColor = this.getTeamColor(playerCell);
        }
        else{
         fillColor = this.rgbToHexColor(playerCell.color)
        }


        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();

        let strokeColor = "";
        if (this.currentPlayer(playerCell)) {
          if(!this.ownerId) this.ownerId = playerCell.ownerId
          strokeColor = "#000000";
        } else {
          
          strokeColor = this.getStrokeColor(fillColor);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
      
      });
    }
  }

  currentPlayer(playerCell) {
    if(this.ownerId){
      return playerCell.ownerId === this.ownerId

    }
    if (this.nodeId) {
      return playerCell.nodeId === this.nodeId;
    }
    return false
  }

  getTeamColor(playerCell) {
    var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
    var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : "";
    if (!this.teamColorsDictionary.hasOwnProperty(skinName)) {
      return null
    }

    return this.teamColorsDictionary[skinName];
  }

  hasTeam(playerCell){
      var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
      var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : ""
      if(skinName.length > 0) return true
      return false
  }
  

  // // get skin image tag - if needed on mini map
  // getSkin(playerCell, skins) {
  //   var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
  //   var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : "";

  //   if (skinName != "") {
  //     if (!skins.hasOwnProperty(skinName)) {
  //       skins[skinName] = new Image();
  //       skins[skinName].src = this.SKIN_URL + skinName + ".png";
  //     }
  //     if (0 != skins[skinName].width && skins[skinName].complete) {
  //       return skins[skinName];
  //     }
  //   }
  //   return null;
  // }

  toHexColor(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHexColor(color) {
    return (
      "#" +
      this.toHexColor(color.r) +
      this.toHexColor(color.g) +
      this.toHexColor(color.b)
    );
  }

  getStrokeColor(hexColor) {
    // const hexColor = this.rgbToHexColor(color);
    var r = (~~(parseInt(hexColor.substr(1, 2), 16) * 0.9)).toString(16),
      g = (~~(parseInt(hexColor.substr(3, 2), 16) * 0.9)).toString(16),
      b = (~~(parseInt(hexColor.substr(5, 2), 16) * 0.9)).toString(16);
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;
    return "#" + r + g + b;
  }

  mapCoordinatesToMiniMap({ x, y }) {
    //game field width ......  x pos on original game field
    //mini map width ...... ? (x pos on mini map)

    let newCordX = 0;
    let newCordY = 0;

    if (x < 0) newCordX = this.gameFieldWidth - Math.abs(x);
    else newCordX = this.gameFieldWidth + x;

    if (y < 0) newCordY = this.gameFieldHeight - Math.abs(y);
    else newCordY = this.gameFieldHeight + y;

    const newX = (newCordX / (this.gameFieldWidth * 2)) * this.canvas.width;
    const newY = (newCordY / (this.gameFieldHeight * 2)) * this.canvas.height;

    return { x: newX, y: newY };
  }
}
