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

    this.teamDictionary = {};
    this.teamCount = 0;

    this.teamColors = this.generateTeamColors(50);

    // this.teamColors = [
    //   "#799f9b",
    //   "#f77c17",
    //   "#938dec",
    //   "#27e03a",
    //   "#eb32f7",
    //   "#161d4a",
    //   "#acd8fb",
    //   "#eef2dc",
    //   "#adc91e",
    //   "#900872",
    //   "#dfeb40",
    //   "#ac5313",
    //   "#58444a",
    //   "#aa3e53",
    //   "#d74164",
    //   "#c8b455",
    //   "#e48762",
    //   "#52ddbb",
    //   "#efdbfe",
    //   "#ffffff",
    // ];
  }

  generateTeamColors(n) {
    const colors = [];
    const hueValues = [0, 60, 90, 168,  194, 30, 210, 42, 235, 70, 280,180, 295, 325, 51, 152]
    const nrOfHues = hueValues.length;
    const lightnessValues = [50, 85, 30, 70, 45]

    const nrOfRounds = Math.ceil(n / nrOfHues);
    for (let i = 0; i < nrOfRounds; i++) {
      for (let j = 0; j < nrOfHues; j++) {
        colors.push(
          this.hslToHex(hueValues[j], 100, lightnessValues[i])  //(i + 1) * (100 / nrOfRounds)
        ); //only 340 hue to avoid having red twice
      }
    }
    console.log(colors)

    // view colors
    // console.log(colors)
    // colors.forEach(color => {
    //   // const body = document.querySelector("body")
    //   const div = document.createElement("div")
    //   div.style.width = "200px"
    //   div.style.height = "5px"
    //   div.style.backgroundColor = color
    //   document.body.appendChild(div)
    // })
    return colors;
  }

  randomNr(min, max) {
    return min + Math.random() * (max - min);
  }

  //src: https://stackoverflow.com/a/44134328
   hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  getColor(h, s, l) {
    // var h = randomNr(1, 360);
    // var s = randomNr(0, 100);
    // var l = randomNr(0, 100);
    return "hsl(" + h + "," + s + "%," + l + "%)";
  }

  // generateTeamColors(n){
  //   const colors = []
  //   let amount = (0xFFFFFF - 0x0)/n

  //   for(let col=0x0;col<=0xFFFFFF;col += amount) {
  //     colors.push("#" + col);
  //   }
  //   console.log(colors)

  //   return colors
  // }

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
    // console.log("-------------------------")
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // console.log(playerCells)
    // console.log(this.nodeId)

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
          // console.log("has team")
          const team = this.getTeamNumber(playerCell);
          // console.log("teeam " + team)
          // console.log("color: " + this.teamColors[team])
          fillColor = this.teamColors[team];
        }
        else{
         fillColor = this.rgbToHexColor(playerCell.color)
        }

        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();

        let strokeColor = "";
        // console.log(this.currentPlayer(playerCell))
        // console.log("*** " + strokeColor)
        // console.log("ffff" + fillColor)
        if (this.currentPlayer(playerCell)) {
          // console.log("this player")
          strokeColor = "#000000";
          // strokeColor = ctx.createLinearGradient(0, 0, 170, 0);
          // gradient.addColorStop("0", "magenta");
          // gradient.addColorStop("0.5" ,"blue");
          // gradient.addColorStop("1.0", "red");
          
          // Fill with gradient
          // ctx.strokeStyle = gradient;
        } else {
          // console.log("other player")
          
          strokeColor = this.getStrokeColor(fillColor);
        }
        // console.log("stroke color: " + strokeColor)
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        
        // `rgb(${playerCell.color.r}, ${playerCell.color.g}, ${playerCell.color.b})`
        
        // ctx.fillStyle = `rgb(${playerCell.color.r}, ${playerCell.color.g}, ${playerCell.color.b})`;
        
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
    if (this.nodeId) {
      return playerCell.nodeId === this.nodeId;
    }
    return false
  }

  getTeamNumber(playerCell) {
    var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
    var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : "";
    if (!this.teamDictionary.hasOwnProperty(skinName)) {
      this.teamDictionary[skinName] = this.teamCount++;
      // console.log(this.teamDictionary);
    }

    return this.teamDictionary[skinName];
  }

  hasTeam(playerCell){
    // if(playerCell.ownerName.split)
    // console.log(playerCell.ownerName.split("]")[0])
      var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
      var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : ""
      if(skinName.length > 0) return true
      return false
  }
  
  // hasSkin(playerCell, skins) {
    //   var teamMatch = playerCell.ownerName.match(/\[(?<TeamTag>.*)\]/);
  //   var skinName = teamMatch != null ? teamMatch.groups["TeamTag"] : "";
  //   if (skinName !== "" && skins.hasOwnProperty(skinName)) return true;
  //   return false;
  // }

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
