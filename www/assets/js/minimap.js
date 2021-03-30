class MiniMap {
  constructor() {
    this.canvas = document.getElementById("canvasMiniMap");
    this.ctx = this.canvas.getContext("2d");
    // this.playerCells = [];
    this.gameFieldWidth = null;
    this.gameFieldHeight = null;
    this.playerName = null;
    this.nodeId = null;
    this.SKIN_URL = "./skins/";

    this.teamColors = [
      "#799f9b",
      "#f77c17",
      "#938dec",
      "#27e03a",
      "#eb32f7",
      "#161d4a",
      "#acd8fb",
      "#eef2dc",
      "#adc91e",
      "#900872",
      "#dfeb40",
      "#ac5313",
      "#58444a",
      "#aa3e53",
      "#d74164",
      "#c8b455",
      "#e48762",
      "#52ddbb",
      "#efdbfe",
      "#ffffff"
    ];
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

  updateThisPlayerCell(playerCells) {
    // if (playerCells && playerCells.length > 0) {
    //   if(!this.playerId) this.playerId = playerCells[0]["id"]
    //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //   this.ctx.beginPath();
    //   const { x, y } = this.mapCoordinatesToMiniMap({
    //     x: playerCells[0]["x"],
    //     y: playerCells[0]["y"],
    //   });
    //   // this.ctx.rect(x, y, 10, 10);
    //   this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
    //   this.ctx.fillStyle = playerCells[0]["color"];
    //   this.ctx.fill();
    //   this.ctx.stroke();
    // }
  }

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
        console.log(playerCell.team)
        ctx.beginPath();
        const size = 2 + playerCell.size * 0.05;

        const { x, y } = this.mapCoordinatesToMiniMap({
          x: playerCell.positionX,
          y: playerCell.positionY,
        });

        if (this.currentPlayer(playerCell)) {
          ctx.rect(x, y, size * 2, size * 2);
        } else {
          ctx.arc(x, y, size, 0, 2 * Math.PI);
        }

        let fillColor = this.rgbToHexColor(playerCell.color)
        // `rgb(${playerCell.color.r}, ${playerCell.color.g}, ${playerCell.color.b})`

        if(playerCell.team > 0) fillColor = this.teamColors[playerCell.team]

        // ctx.fillStyle = `rgb(${playerCell.color.r}, ${playerCell.color.g}, ${playerCell.color.b})`;
        ctx.fillStyle = fillColor
        ctx.fill();
        ctx.strokeStyle = this.getStrokeColor(fillColor);
        ctx.stroke();

        // const ctx = this.ctx
        // if(this.hasSkin(playerCell, skins)){
        //   this.ctx.clip();
        //   const skinImg = this.getSkin(playerCell, skins);
        //   skinImg.addEventListener('load', function(e) {
        //       ctx.drawImage(this, 0, 0, 200, 300);
        //       ctx.fill() = "red"
        //       ctx.strokeStyle = playerCell.color
        //       ctx.stroke();
        //   }, true);
        // }
        // else{
        // }
      });
    }
  }

  currentPlayer(playerCell) {
    if (this.playerName) {
      return playerCell.nodeId === this.nodeId;
    }
  }

  hasSkin(playerCell, skins) {
    var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
    var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : "";
    if (skinName !== "" && skins.hasOwnProperty(skinName)) return true;
    return false;
  }

  getSkin(playerCell, skins) {
    var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
    var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : "";

    if (skinName != "") {
      if (!skins.hasOwnProperty(skinName)) {
        skins[skinName] = new Image();
        skins[skinName].src = this.SKIN_URL + skinName + ".png";
      }
      if (0 != skins[skinName].width && skins[skinName].complete) {
        return skins[skinName];
      }
    }
    return null;
  }

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
