/*eslint-disable */
/*jslint devel: true */
/*global requestAnimationFrame */

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function createSessionResult(profileID, score, skill_point, cb) {
    const created = new Date(),
        submitURL = document.location.origin + '/api/sessions/',
        submitToken = readCookie('nctu-ece-token');
    profileID = profileID || readCookie('nctu-ece-profile-id');
    var http = new XMLHttpRequest();
    const payload = {
        owner: profileID,
        scores: score,
        skill_point:skill_point,
        created: created
    };
    //Send the proper header information along with the request
    http.open("POST", submitURL, true); // async api call
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("Authorization", "Token "+submitToken);
    http.setRequestHeader("Cache-Control", "no-cache");
    http.onreadystatechange = function() {//Call a function when the state changes.
        return ( http.status == 200 || http.status == 201) ? cb(http.responseText, null) :
            cb(null, http.responseText);
    }
    http.send(JSON.stringify(payload)); 
    return;
}

function createSkillPoint(profileID, name, cost, cb) {
    const created = new Date(),
        submitURL = document.location.origin + '/api/sessions/',
        submitToken = readCookie('nctu-ece-token');
    profileID = profileID || readCookie('nctu-ece-profile-id');
    var http = new XMLHttpRequest();
    const payload = {
        owner: profileID,
        cost: cost,
        name: name,
    };
    //Send the proper header information along with the request
    http.open("POST", submitURL, true); // async api call
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("Authorization", "Token "+submitToken);
    http.setRequestHeader("Cache-Control", "no-cache");
    http.onreadystatechange = function() {//Call a function when the state changes.
        return ( http.status == 200 || http.status == 201) ? cb(http.responseText, null) :
            cb(null, http.responseText);
    }
    http.send(JSON.stringify(payload)); 
    return;
}

function createSessionResult(profileID, score, skill_point, cb) {
    const created = new Date(),
        submitURL = document.location.origin + '/api/sessions/',
        submitToken = readCookie('nctu-ece-token');
    profileID = profileID || readCookie('nctu-ece-profile-id');
    var http = new XMLHttpRequest();
    const payload = {
        owner: profileID,
        scores: score,
        skill_point:skill_point,
        created: created
    };
    //Send the proper header information along with the request
    http.open("POST", submitURL, true); // async api call
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("Authorization", "Token "+submitToken);
    http.setRequestHeader("Cache-Control", "no-cache");
    http.onreadystatechange = function() {//Call a function when the state changes.
        return ( http.status == 200 || http.status == 201) ? cb(http.responseText, null) :
            cb(null, http.responseText);
    }
    http.send(JSON.stringify(payload)); 
}

function getProfile(profileID, cb) {
    profileID = profileID || readCookie('nctu-ece-profile-id');
    const created = new Date(),
        submitURL = document.location.origin + '/api/profiles/' + profileID,
        submitToken = readCookie('nctu-ece-token');
    var http = new XMLHttpRequest();
    //Send the proper header information along with the request
    http.open("GET", submitURL, true); // async api call
    http.setRequestHeader("Cache-Control", "no-cache");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(( http.status == 200 || http.status == 201)) {
            cb(http.responseText, null);
        } else {
            cb(null, http.responseText);
        }
    }
    http.send(); 
}

//canvas
var canvas, ctx;

//bullet
var bullets = new Array(0);
var bulletRatio = 1;
var bulletShout = 0;
var bulletWidth = 3;
var bulletHeight = 3;
var bulletAttack = 50;
var bulletPeriod = 8;

var imageURL = '/static/img/ShootingNight/';

//monster
var monsters = new Array(0);
var monsterRatio = 1;
var monsterAppear = 0;
var monsterWidth = 50;
var monsterHeight = 50;
var monsterHealth = 20;
var monster = new Image();
var monsterPeriod = 80;

//rollCall
var rollCallFrequency = 0.2;
var rollCallRatio = 1;
var rollCallTime = 0;
var rollCallX;
var rollCallY;
var rollCallKeepTime = 180;
var rollCallAttack = 15;
var rollCallWidth = 100;
var rollCallHeight = 100;
var rollCall = new Image();

//shooter
var shooterX = 0;
var shooterRatio = 1;
var shooterWidth = 30;
var shooterHeight = 30;
var shooter = new Image();

//boss
var bossTime = 0;
var bossActing;
var bossRatio = 1;
var bossWidth = 120;
var bossHeight = [120, 120, 120, 120, 120];
var bossX;
var bossY;
var bossHealth;
var bossBaseHealth = 1000;
var bossNumber = Math.floor(Math.random() * 5);
var boss = new Array(5);

//each boss varible

//zhongyong
var question;
var answer = [0, 0, 0];
var right;

//chunmei
var remainingTime = 10;
var time;
var nowTime = 0;
var extraTime;

//wave
var monsterWave = 0;
var bossPerWave = 10;

//speed
var speed = 2;//5

var mouseX = -1;
var mouseY = -1;

var level = 1;
var skillPoint = 0;
var skills = [{subject: "calculas", learned: false, need1: 50, need2: 70, need3: 100},
              {subject: "physical", learned: false, need1: 100, need2: 70, need3: 50}];
var health = 100;

var map = new Image();
var mapLoc = 0;

var frameIndex = 0;

var fontSize_main = "50px Arial";
var fontSize_sub = "32px Arial";
var fontSize_button = "16px Arial";
var fontSize_text = "13px Arial";

/*
    Index Content
      0   Main Page --> Enter Point
      1   Game Page
      2   Skill Page
      3   Game Over
      4   Setting Page
*/

function touchMoveHandler(e) {
    "use strict";
    var relativeX = e.changedTouches[0].clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        shooterX = relativeX - shooterWidth / 2;
    }
}
function mouseMoveHandler(e) {
    "use strict";
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        shooterX = relativeX - shooterWidth / 2;
    }
}
function mouseClickHandler(e) {
    "use strict";
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
}
function empty() {
    "use strict";
}
function clickEvent(x, y, width, height, ifDoWhat, elseDoWhat) {
    "use strict";
    if (mouseX < x + width && mouseX >= x && mouseY < y + height && mouseY >= y) {
        ifDoWhat();
    } else if (typeof (elseDoWhat) !== "undefined") {
        elseDoWhat();
    }
}
function initial_boss() {
    "use strict";
    switch (bossNumber) {
    case 0:
    case "科宏":
        break;
    case 1:
    case "蔡媽":
        //prototype (a + b) mod c + d  1 < a,b,c,d < 10 c > 2
        var a = Math.floor(Math.random() * 8 + 2),
            b = Math.floor(Math.random() * 8 + 2),
            c = Math.floor(Math.random() * 7 + 3),
            d = Math.floor(Math.random() * 8 + 2),
            bias = Math.floor(Math.random() * (c - 1)) + 1;
        right = Math.floor(Math.random() * 3);
        question = "(" + a + " + " + b + ") mod " + c + " + " + d + " =";
        answer[right] = (a + b) % c + d;
        answer[(right + 1) % 3] = (a + b + bias) % c + d;
        answer[(right + 2) % 3] = (a + b - bias) % c + d;
        break;
    case 2:
    case "春美":
        nowTime = 0;
        time = Date.now();
        extraTime = Math.floor(Math.random() * 10 + 5);
        break;
    case 3:
    case "宏翰":
        break;
    case 4:
    case "紋濱":
        break;
    default:
        console.log("Error allocate boss");
        break;
    }
}
function game_start() {
    "use strict";
    health = 100;
    frameIndex = 1;
    bullets = [];
    monsters = [];
    monsterWave = 0;
    bossTime = 0;
    initial_boss();
    level = 1;
}
function fill_rect(x, y, width, height, color) {
    "use strict";
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
function boss_attack(bullet, bulletIndex) {
    "use strict";
    switch (bossNumber) {
    case 0:
    case "科宏":
        break;
    case 1:
    case "蔡媽":
        return true;
    case 2:
    case "春美":
        if (nowTime < remainingTime + extraTime && bossTime > 280) {
            bullets.splice(bulletIndex, 1);
            return true;
        }
        break;
    case 3:
    case "宏翰":
        break;
    case 4:
    case "紋濱":
        break;
    default:
        console.log("Error allocate boss");
        break;
    }
}
function draw_kehong() {
    "use strict";
    var bossActing = bossTime % 560 - 280;
}
function draw_zhongyong() {
    "use strict";
    ctx.font = fontSize_sub;
    var index;
    ctx.fillText(question,
         canvas.width / 2 - ctx.measureText(question).width / 2,
         canvas.height / 20);
    function add() {
        bossHealth += level * 5;
        initial_boss();
    }
    function subtract() {
        bossHealth -= bulletAttack * 2;
        initial_boss();
    }
    for (index = 0; index < 3; index += 1) {
        fill_rect((index * 6 + 1) * canvas.width / 19,
                  canvas.height / 2,
                  canvas.width * 5 / 19,
                  canvas.height / 10,
                  "#FFF");
        ctx.fillStyle = "#000";
        ctx.fillText(answer[index],
                     (index * 6 + 3.5) * canvas.width / 19 - ctx.measureText(answer[index]).width / 2,
                     canvas.height * 11 / 20);
        if (index === right) {
            clickEvent((index * 6 + 1) * canvas.width / 19,
                  canvas.height / 2,
                  canvas.width * 5 / 19,
                  canvas.height / 10,
                  subtract);
            
        } else {
            clickEvent((index * 6 + 1) * canvas.width / 19,
                  canvas.height / 2,
                  canvas.width * 5 / 19,
                  canvas.height / 10,
                  add);
        }
        
    }
}
function draw_chunmei() {
    "use strict";
    ctx.font = fontSize_sub;
    if (nowTime < remainingTime + extraTime) {
        ctx.fillText("Remaining Time of class: " + (remainingTime - nowTime),
             canvas.width / 2 - ctx.measureText("Remaining Time of class: " + (remainingTime - nowTime)).width / 2,
             canvas.height / 20);
    } else if (nowTime < remainingTime + extraTime + 10) {
        ctx.fillText("Take a break: " + (remainingTime + extraTime + 10 - nowTime),
             canvas.width / 2 - ctx.measureText("Take a break: " + (remainingTime + extraTime + 10 - nowTime)).width / 2,
             canvas.height / 20);
    } else {
        initial_boss(2);
    }
    if (Date.now() - time > 1000) {
        nowTime += 1;
        time = Date.now();
    }
}
function draw_honghan() {
    "use strict";
    
}
function draw_wenbin() {
    "use strict";
    
}
function draw_boss(name) {
    "use strict";
    if (bossTime < 20) {
        bossTime += 1;
        return;
    }
    if (bossTime < 140) {
        bossX = canvas.width / 2 - bossWidth / 2;
        bossY = -bossHeight[bossNumber];
        fill_rect(0, canvas.height / 10, canvas.width, 100, "#F00");
        ctx.fillStyle = "#FFF";
        ctx.font = fontSize_main;
        ctx.fillText("WARNING !!",
                     canvas.width / 2 - ctx.measureText("WARNING !!").width / 2,
                     canvas.height / 10 + parseInt(fontSize_main, 8) / 2 + 50);
        bossHealth = level * bossBaseHealth;
    } else if (bossTime < 280) {//Boss Coming
        bossX = canvas.width / 2 - bossWidth / 2;
        bossY = bossTime * 2 - 280 - bossHeight[bossNumber];
        bossHealth = level * bossBaseHealth;
    } else {//Boss Combating
        bossX = canvas.width / 2 -
                bossWidth / 2 +
                Math.floor(canvas.width * Math.sin((bossTime % 560 - 280) * Math.PI / 280) / 4);
        switch (name) {
        case 0:
        case "科宏":
            draw_kehong();
            break;
        case 1:
        case "蔡媽":
            draw_zhongyong();
            break;
        case 2:
        case "春美":
            draw_chunmei();
            break;
        case 3:
        case "宏翰":
            draw_honghan();
            break;
        case 4:
        case "紋濱":
            draw_wenbin();
            break;
        default:
            console.log("Error allocate boss");
            draw_kehong();
            break;
        }
        /*
        var bossActing = bossTime % 280;
        switch (Math.floor(bossActing / 70)) {
        case 0:
            bossX = (canvas.width - bossWidth + bossActing) / 2;
            if (bossActing > 40) {
                fill_rect(bossX + bossWidth / 2 - 20,
                          bossY + bossHeight[bossNumber],
                          40,
                          canvas.height - bossY - bossHeight[bossNumber],
                          "#000");
                if (bossActing % 4 === 0 &&
                        shooterX < bossX + bossWidth / 2 + 15 &&
                        shooterX + shooterWidth > bossX + bossWidth / 2 - 15) {
                    health -= level;
                }
            }
            break;
        case 1:
        case 2:
            bossX = (canvas.width - bossWidth + 140 - bossActing) / 2;
            if (bossActing > 180) {
                fill_rect(bossX + bossWidth / 2 - 20,
                          bossY + bossHeight[bossNumber],
                          40,
                          canvas.height - bossY - bossHeight[bossNumber],
                          "#000");
                if (bossActing % 4 === 0 &&
                        shooterX < bossX + bossWidth / 2 + 15 &&
                        shooterX + shooterWidth > bossX + bossWidth / 2 - 15) {
                    health -= level;
                }
            }
            break;
        case 3:
            bossX = (canvas.width - bossWidth - 280 + bossActing) / 2;
            break;
        default:
            bossX = (canvas.width - bossWidth) / 2;
            break;
        }
        */
        fill_rect(bossX,
              bossY + bossHeight[bossNumber],
              bossWidth * bossHealth / level / bossBaseHealth,
              10,
              "#0F0");
    }
    ctx.drawImage(boss[bossNumber], bossX, bossY, bossWidth, bossHeight[bossNumber]);
    bossTime += 1;
    if (bossHealth <= 0) {
        bossTime = -1;
        level += 1;
        skillPoint += Math.floor(Math.random() * 10 * level);
    }
}
function draw_monsters() {
    "use strict";
    monsterAppear = (monsterAppear + 1) % monsterPeriod;
    if (rollCallTime > 0) {
        clickEvent(rollCallX,
                   rollCallY,
                   rollCallWidth,
                   rollCallHeight,
                   function () {
                rollCallTime = 0;
                skillPoint += 5;
            },
                   function () {
                ctx.drawImage(rollCall,
                                    rollCallX,
                                    rollCallY,
                                      rollCallWidth,
                                      rollCallHeight);
                rollCallTime -= 1;
                if (rollCallTime === 0) {
                    health -= rollCallAttack;
                }
            });
    }
    if (bossTime < 0 && monsterAppear === 0) {
        var index;
        if (rollCallTime <= 0 &&
                Math.random() < rollCallFrequency) {
            rollCallX = Math.floor(Math.random() * (canvas.width - rollCallWidth));
            rollCallY = Math.floor(Math.random() * canvas.height / 3) + 30;
            rollCallTime = rollCallKeepTime;
        }
        for (index = 0; index < 5; index += 1) {
            monsters.push({x: canvas.width / 5 * index,
                           y: 0,
                           health: level * monsterHealth});
        }
        monsterWave += 1;
        if (monsterWave % bossPerWave === 0) {
            bossTime = 0;
            bossNumber = Math.floor(Math.random() * 5);
        }
    }
    monsters.forEach(function (item, index) {
        item.y += speed;
        if (item.y >= canvas.height) {
            monsters.splice(index, 1);
            health -= 10;
        } else {
            ctx.drawImage(monster,
                          item.x,
                          item.y,
                          monsterWidth,
                          monsterHeight);
        }
    });
}
function successed_attack(bullet, bulletIndex) {
    "use strict";
    if (bossTime >= 0) {
        if (bullet.x - bossX < bossWidth &&
                bullet.x - bossX > -bulletWidth &&
                bullet.y - bossY < bossHeight[bossNumber] &&
                bullet.y - bossY > -bulletHeight) {
            bossHealth -= bulletAttack;
            bullets.splice(bulletIndex, 1);
            return true;
        }
        if (bossTime > 280) {
            return boss_attack(bullet, bulletIndex);
        }
    }
    monsters.forEach(function (item, index) {
        if (bullet.x - item.x < monsterWidth &&
                bullet.x - item.x > -bulletWidth &&
                bullet.y - item.y < monsterHeight &&
                bullet.y - item.y > -bulletHeight) {
            item.health -= bulletAttack;
            if (item.health <= 0) {
                monsters.splice(index, 1);
                skillPoint += 1;
            }
            bullets.splice(bulletIndex, 1);
            return true;
        }
    });
}
function draw_bullets() {
    "use strict";
    bulletShout = (bulletShout + 1) % bulletPeriod;
    if (bulletShout === 0) {
        bullets.push({x: shooterX + shooterWidth / 2,
                      y: canvas.height - shooterHeight - bulletHeight});
    }
    bullets.forEach(function (item, index) {
        item.y -= speed;
        if (successed_attack(item, index) || (item.y <= 0)) {
            bullets.splice(index, 1);
        } else {
            ctx.beginPath();
            ctx.arc(item.x, item.y, bulletWidth, 0, Math.PI * 2, true);
            ctx.fillStyle = "#CC3";
            ctx.fill();
            ctx.closePath();
        }
    });
}
function draw_detail() {
    "use strict";
    ctx.font = fontSize_text;
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score:" + skillPoint, canvas.width / 40, canvas.height / 40);
    ctx.fillText("Health:" + health, canvas.width / 40, canvas.height * 39 / 40);
}
function draw_map() {
    "use strict";
    if (mapLoc < map.height - canvas.height) {
        ctx.drawImage(map, 0, mapLoc, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        if (frameIndex === 1) {//game playing
            mapLoc += 1;
        }
    } else if (mapLoc < map.height) {
        ctx.drawImage(map, 0, mapLoc, canvas.width, map.height - mapLoc, 0, 0, canvas.width, map.height - mapLoc);
        ctx.drawImage(map, 0, 0, canvas.width, canvas.height + mapLoc, 0, map.height - mapLoc, canvas.width, canvas.height + mapLoc);
        mapLoc = (mapLoc + 1) % map.height;
    }
}
function draw() {
    "use strict";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_map();
    switch (frameIndex) {
    case 0: //Main Page --> Enter Point
        fill_rect(canvas.width / 4,
                  canvas.height / 3,
                  canvas.width / 2,
                  canvas.width / 6,
                  "#088");
        fill_rect(canvas.width / 4,
                  canvas.height * 2 / 3,
                  canvas.width / 2,
                  canvas.width / 6,
                  "#088");
        ctx.fillStyle = "#FFF";
        ctx.font = fontSize_main;
        ctx.fillText("ShootingNight",
                     canvas.width / 2 - ctx.measureText("ShootingNight").width / 2,
                     canvas.height / 6);
        ctx.font = fontSize_sub;
        ctx.fillText("START",
                     canvas.width / 2 - ctx.measureText("START").width / 2,
                     canvas.height * 5 / 12 - parseInt("32px Arial", 8) / 2);
        ctx.fillText("UPGRADE",
                     canvas.width / 2 - ctx.measureText("UPGRADE").width / 2,
                     canvas.height * 3 / 4 - parseInt("32px Arial", 8) / 2);
        clickEvent(canvas.width / 4,
                   canvas.height / 3,
                   canvas.width / 2,
                   canvas.width / 6,
                   function () {game_start(); });
        clickEvent(canvas.width / 4,
                   canvas.height * 2 / 3,
                   canvas.width / 2,
                   canvas.width / 6,
                   function () {frameIndex = 2; });
        break;
    case 1://Game Page
        ctx.drawImage(shooter,
                      shooterX,
                      canvas.height - shooterHeight,
                      shooterWidth,
                      shooterHeight);
        draw_bullets();
        draw_monsters();
        if (bossTime >= 0) {
            draw_boss(bossNumber);
        }
        draw_detail();
        if (health <= 0) {
            frameIndex = 3;
            mapLoc = 0;
        }
        break;
    case 2://Skill Page
        fill_rect(8, canvas.height - 48, 90, 40, "#088");
        fill_rect(canvas.width - 98, canvas.height - 48, 90, 40, "#088");
        ctx.font = fontSize_button;
        ctx.fillStyle = "#FFF";
        ctx.fillText("  Score1: " + skillPoint[0] +
                     "  Score2: " + skillPoint[1] +
                     "  Score3: " + skillPoint[2], 8, 20);
        ctx.fillText("BACK", 30, canvas.height - 20);
        ctx.fillText("START", canvas.width - 77, canvas.height - 20);
        skills.forEach(function (item, index) {
            fill_rect(canvas.width - 48, 50 + index * 60, 40, 40, "#800");
            clickEvent(canvas.width - 48, 50 + index * 60, 40, 40, function () {if (!item.learned &&
                    item.need1 <= skillPoint[0] &&
                    item.need2 <= skillPoint[1] &&
                    item.need3 <= skillPoint[2]) {
                item.learned = true;
                skillPoint[0] -= item.need1;
                skillPoint[1] -= item.need2;
                skillPoint[2] -= item.need3;
            } }, function () {});
            ctx.fillText(item.subject, 8, 80 + index * 60);
            if (!item.learned) {
                fill_rect(canvas.width - 48, 50 + index * 60, 40, 40, "#088");
                ctx.fillText("Score1: " + item.need1, 78, 80 + index * 60);
                ctx.fillText("Score2: " + item.need2, 178, 80 + index * 60);
                ctx.fillText("Score3: " + item.need3, 278, 80 + index * 60);
            }
        });
        clickEvent(8, canvas.height - 48, 90, 40, function () {frameIndex = 0; });
        clickEvent(canvas.width - 98, canvas.height - 48, 90, 40, function () {game_start(); });
        break;
    case 3://Game Over
        fill_rect(canvas.width / 4,
                  canvas.height / 3,
                  canvas.width / 2,
                  canvas.width / 6,
                  "#088");
        fill_rect(canvas.width / 4,
                  canvas.height * 2 / 3,
                  canvas.width / 2,
                  canvas.width / 6,
                  "#088");
        ctx.fillStyle = "#FFF";
        ctx.font = fontSize_main;
        ctx.fillText("GAME OVER",
                     canvas.width / 2 - ctx.measureText("GAME OVER").width / 2,
                     canvas.height / 6);
        ctx.font = fontSize_sub;
        ctx.fillText("RESTART",
                     canvas.width / 2 - ctx.measureText("RESTART").width / 2,
                     canvas.height * 5 / 12 - parseInt("32px Arial", 8) / 2);
        ctx.fillText("UPGRADE",
                     canvas.width / 2 - ctx.measureText("UPGRADE").width / 2,
                     canvas.height * 3 / 4 - parseInt("32px Arial", 8) / 10);
        clickEvent(canvas.width / 4,
                   canvas.height / 3,
                   canvas.width / 2,
                   canvas.width / 6,
                   function () {game_start(); });
        clickEvent(canvas.width / 4,
                   canvas.height * 2 / 3,
                   canvas.width / 2,
                   canvas.width / 6,
                   function () {frameIndex = 2; });
        break;
    case 4://Setting Page
        fill_rect(8, canvas.height - 48, 90, 40, "#088");
        fill_rect(canvas.width - 98, canvas.height - 48, 90, 40, "#088");
        ctx.font = fontSize_button;
        ctx.fillStyle = "#FFF";
        ctx.fillText("BACK", 30, canvas.height - 20);
        ctx.fillText("START", canvas.width - 77, canvas.height - 20);
        clickEvent(canvas.width / 2 - 90, 200, 180, 80, function () {game_start(); }, function () {});
        clickEvent(canvas.width / 2 - 90, 400, 180, 80, function () {frameIndex = 2; }, function () {});
        break;
    default:
        //console.log("WTF!!");
        break;
    }
    requestAnimationFrame(draw);
    mouseX = -1;
    mouseY = -1;
}
function resizeGame() {
    "use strict";
    var widthToHeight = 2 / 3,
        newWidth = window.innerWidth,
        newHeight = window.innerHeight,
        newWidthToHeight = newWidth / newHeight,
        i;
    if (newWidthToHeight > widthToHeight) {
        canvas.width = newHeight * widthToHeight;
        canvas.height = newHeight;
    } else {
        canvas.width = newWidth;
        canvas.height = newWidth / widthToHeight;
    }
    canvas.style.marginTop = (newHeight - canvas.height) / 2 + 'px';
    canvas.style.marginBottom = (newHeight - canvas.height) / 2 + 'px';
    canvas.style.marginLeft = (newWidth - canvas.width) / 2 + 'px';
    canvas.style.marginRight = (newWidth - canvas.width) / 2 + 'px';
    monsterWidth = canvas.width / 5.5;
    if (monster.width !== 0) {
        monsterHeight = monsterWidth * monster.height / monster.width;
    } else {
        monsterHeight = monsterWidth * monsterRatio;
    }
    shooterWidth = canvas.width / 5.5;
    if (shooter.width !== 0) {
        shooterHeight = shooterWidth * shooter.height / shooter.width;
    } else {
        shooterHeight = shooterWidth * shooterRatio;
    }
    bulletWidth = canvas.width / 60;
    bulletHeight = bulletWidth;
    rollCallWidth = canvas.width / 5;
    if (rollCall.width !== 0) {
        rollCallHeight = rollCallWidth * rollCall.height / rollCall.width;
    } else {
        rollCallHeight = rollCallWidth * rollCallRatio;
    }
    bossWidth = canvas.width / 3;
    for (i = 0; i < 5; i += 1) {
        if (boss[i].width) {
            bossHeight[i] = bossWidth * boss[i].height / boss[i].width;
        } else {
            bossHeight[i] = bossWidth * bossRatio;
        }
    }
    speed = canvas.height / 80;
    mapLoc = 0;
}
function load() {
    "use strict";
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    shooter.src = imageURL+ "shooter.png";
    monster.src = imageURL+ "monster.png";
    rollCall.src = imageURL + "rollcall.png";
    map.src = imageURL+ "map2.jpg";
    var i = 0;
    for (i = 0; i < 5; i += 1) {
        boss[i] = new Image();
        boss[i].src = imageURL + "boss" + i + ".png";
    }
    window.addEventListener('resize', resizeGame, false);
    window.addEventListener('orientationchange', resizeGame, false);
    canvas.addEventListener("mousemove", mouseMoveHandler, false);
    canvas.addEventListener("click", mouseClickHandler, false);
    canvas.addEventListener("touchmove", touchMoveHandler, false);
}
window.onload = function () {
    "use strict";

    console.log('nctu-ece-token', readCookie('nctu-ece-token'));
    console.log('nctu-ece-id', readCookie('nctu-ece-id'));
    console.log('nctu-ece-profile-id', readCookie('nctu-ece-profile-id'));
    createSessionResult(readCookie('nctu-ece-profile-id'), 1000, 100, (res, err)=>{
        if (res)
            console.log('SUCESS', res);
        if (err)
            console.log('ERROR', err);
    })

    getProfile(readCookie('nctu-ece-profile-id'), (res, err)=>{
        if (res)
            console.log('SUCESS', res);
        if (err)
            console.log('ERROR', err);
        
    });
    load();
    resizeGame();
    draw();
};