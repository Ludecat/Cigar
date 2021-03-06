<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Eat cells smaller than you and don't get eaten by the bigger ones, as an MMO">
    <meta name="keywords" content="agario, agar, io, cell, cells, virus, bacteria, blob, game, games, web game, html5, fun, flash">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <title>LudeCat - Agar</title>

    

    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="192x192" href="favicon-192x192.png">
    <link rel="icon" type="image/png" sizes="256x256" href="favicon-256x256.png">
    <link rel="manifest" href="site.webmanifest">
    <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#ffcc00">
    <meta name="theme-color" content="#ffffff">


    <link href='https://fonts.googleapis.com/css?family=Ubuntu:700' rel='stylesheet' type='text/css'>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/index.css" rel="stylesheet">

    <script src="assets/config/serverconfig.js"></script>
    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="assets/js/log.js"></script>
    <script src="assets/js/vector.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
</head>

<body>
    <div class="modal fade" id="inPageModal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 id="inPageModalTitle" class="modal-title">Failed to Load</h4>
                </div>
                <div id="inPageModalBody" class="modal-body">
                    <p>Failed to load. Please check your connection!</p>
                    <div class="center">
                        <div class="loader"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="overlays">
        <div id="helloDialog">
            <form role="form">
                <div class="form-group">
                    <h2 id="title">Agar</h2>
                </div>

                <div class="form-group">
                    <select id="team-select" class="form-control" required>
                        <option hidden disabled selected value>Select Team</option>
                        <?php
                            $string = file_get_contents("include/teamlist.json");
                            $team_array = json_decode($string, true);

                            foreach($team_array as $team)
                            {
                                echo '<option>'.$team.'</option>';
                            }
                        ?>
                    </select>
                    <input id="nick" class="form-control save" data-box-id="0" placeholder="Nick" maxlength="15" />
                    <br clear="both" />
                </div>

                <div class="form-group">
                    <button type="submit" id="play-btn" onclick="setNick('[' + document.getElementById('team-select').value + '] ' + document.getElementById('nick').value); return false;" class="btn btn-play btn-primary btn-needs-server">Play</button>
                    <br clear="both" />
                </div>

                <div id="settings" class="checkbox">
                    <div class="form-group" id="mainform">
                        <button id="spectate-btn" onclick="spectate(); return false;" style="width: 100%" class="btn btn-warning btn-spectate btn-needs-server">Spectate
                        </button>
                        <br clear="both" />
                    </div>
                    <!-- <div style="margin: 6px;">
                        <label>
                            <input type="checkbox" class="save" data-box-id="1" onchange="setSkins(!$(this).is(':checked'));"> No skins</label>
                        <label>
                            <input type="checkbox" class="save" data-box-id="2" onchange="setNames(!$(this).is(':checked'));"> No names</label>
                        <label>
                            <input type="checkbox" class="save" data-box-id="3" onchange="setDarkTheme($(this).is(':checked'));"> Dark Theme</label>
                        <label>
                            <input type="checkbox" class="save" data-box-id="4" onchange="setColors($(this).is(':checked'));"> No colors</label>
                        <label>
                            <input type="checkbox" class="save" data-box-id="5" onchange="setShowMass($(this).is(':checked'));"> Show mass</label>
                        <label>
                            <input type="checkbox" class="save" data-box-id="6" onchange="setSmooth($(this).is(':checked'));"> Smooth Render</label>
                        <label>
                            <input type="checkbox" class="save" data-box-id="7" onchange="setChatHide($(this).is(':checked'));"> Hide Chat</label>
                    </div> -->
                </div>
            </form>

            <div id="instructions">
                <hr/>
                <center>
                    <span class="text-muted">
                        Move your mouse to control your cell<br/>
                        Press <b>Space</b> to split<br/>
                        Press <b>W</b> to eject some mass<br/>
                    </span>
                </center>
            </div>


            <hr />
            <div id="footer">
                <a href="https://github.com/CigarProject/Cigar" class="text-muted">GitHub/CigarProject</a>
            </div>

        </div>
    </div>

    <div id="countdown" class="hidden js-countdown-container">
        <p class="js-countdown"></p>
    </div>

    <div id="connecting">
        <div style="width: 350px; background-color: #FFFFFF; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;">
            <h2>Connecting</h2>
            <p> If you cannot connect to the servers, check if you have some anti virus or firewall blocking the connection.</p>
        </div>
    </div>

    <canvas id="canvas" width="800" height="600"></canvas>
    <div class="canvasMiniMapContainer">
        <div class="miniMapBackground"></div>
        <div class="miniMapBackgroundOverlay"></div>
        <canvas id="canvasMiniMap" class="canvasMiniMap" width="300" height="300"></canvas>
    </div>
    <div style="font-family:'Ubuntu'">&nbsp;</div>

    <script>const TEAM_LIST = <?= $string = file_get_contents("include/teamlist.json"); ?></script>
    <script src="assets/js/minimap.js"></script>
    <script data-main="assets/config/serverconfig" src="assets/js/main_out.js"></script>
</body>
</html>
