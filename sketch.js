function setup() {
  phase = "start";
  colorMode(RGB);
  X = 1133;
  Y = 744;
  t = 0;
  cnv = createCanvas(X, Y);
  loadimg();
  loadsound();
  
  //
  setup_fst_hbd();
  setup_fst_cloud();
  setup_fst_wood();
  setup_fst_dice();
  
  setup_ast_logic();
  setup_ast_comet();
  setup_ast_star();
  setup_ast_meteor();
  ast_time = t;
  
  setup_hbd();
  setup_hbd_meteor();
  setup_hbd_star();
  
  //
  //let fsButton = createButton("全螢幕");
  //fsButton.position(20, 20);
  //fsButton.mousePressed(toggleFullscreen);
  let c = cnv.elt; // get the raw HTML canvas element
  c.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
  c.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
}

function draw(){
  t++;
  if (phase == "start"){
    call_start();
  }
  
  if (phase == "fst"){
    enviroment_fst_background();
    call_fst();
  } if (phase == "fst_ing"){
    enviroment_fst_background();
    call_fst_ing();
  }
  
  if (phase == "ast_begin"){
    call_ast_begin();
  } if (phase == "ast"){
    call_ast();
  } if (phase == "ast_end"){
    call_ast_end();
  } if (phase == "ast_die"){
    call_ast_die();
  }
  
  if (phase == "hbd_begin"){
    enviroment_hbd_background();
    fill(0, 0, 20, 30);
    tint(0, 0, 70, 10);
    rect(0, 0, X, Y);
    noTint();
    call_hbd_begin();
  } if (phase == "hbd_ing"){
    enviroment_hbd_background();
    call_hbd_ing();
  } if (phase == "hbd_end_pre"){
    enviroment_hbd_background();
    call_hbd_endpre();
  } if (phase == "hbd_end"){
    enviroment_hbd_background();
    call_hbd_end();
  }
}

function loadimg(){
  //fst_img_tree = loadImage("assets/fst_tree1.png");
  fst_img_cloud = [];
  fst_img_cloud.push(loadImage("assets/fst_cloud1.png"));
  fst_img_cloud.push(loadImage("assets/fst_cloud2.png"));
  fst_img_cloud.push(loadImage("assets/fst_cloud3.png"));
  
  fst_img_tree_1b = loadImage("assets/fst_tree_1b.png");
  fst_img_tree_1t = loadImage("assets/fst_tree_1t.png");
  fst_img_tree_2b = loadImage("assets/fst_tree_2b.png");
  fst_img_tree_2t = loadImage("assets/fst_tree_2t.png");
  fst_img_fire_on = loadImage("assets/fst_fire_on.png");
  fst_img_fire_off = loadImage("assets/fst_fire_off.png");
  fst_img_wood = loadImage("assets/fst_wood.png");
  
  ast_img_planet1 = loadImage("assets/ast_planet1.png");
  ast_img_planet2 = loadImage("assets/ast_planet2.png");
  ast_img_planet3 = loadImage("assets/ast_planet3.png");
  ast_img_planet4 = loadImage("assets/ast_planet4.png");
  ast_img_planet5 = loadImage("assets/ast_planet5.png");
  ast_img_comet1 = loadImage("assets/ast_comet1_t2.png");
  ast_img_comet2 = loadImage("assets/ast_comet2_t2.png");
  ast_img_comet3 = loadImage("assets/ast_comet3_t2.png");
  ast_img_comet4 = loadImage("assets/ast_comet4_t2.png");
  ast_img_hp = loadImage("assets/ast_hp.png");
  torch_img = loadImage("assets/torch.png");
  
  hbd_img_background_front = loadImage("assets/hbd_background_front.png");
  hbd_img_bggift = loadImage("assets/hbd_bggift.png");
  hbd_img_whitecatproject = loadImage("assets/hbd_whitecatproject.png");
  hbd_img_polarbear = loadImage("assets/hbd_polarbear.png");
  hbd_img_cake = loadImage("assets/hbd_cake.png");
  hbd_img_gift = loadImage("assets/hbd_gift.png");
  hbd_img_spirit = loadImage("assets/hbd_spirit.png");
  hbd_img_rabbit = loadImage("assets/hbd_rabbit.png");
  hbd_img_redspirit = loadImage("assets/hbd_redspirit.png");
  hbd_img_magic = loadImage("assets/hbd_magic.png");
}

function loadsound(){
  hbd_sound_firework = loadSound("assets/hbd_firework_new.mp3");
}

function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
}

//
//
//
//
//

function touchStarted() {
  if (phase == "start"){
    if (mouseX > X/2-60 && mouseX < X/2+60 &&
        mouseY > 460 && mouseY < 600) {
      phase = "fst";
      toggleFullscreen();
    }
  }
  if (phase == "fst"){
    if (fst_dice_ing == 1){
        let fst_dice_distance = dist(mouseX, mouseY, fst_dice.x, fst_dice.y);
      if (fst_dice_distance < fst_dice.size/2 && !fst_dice.isRolling) {
        fst_dice.isRolling = true;
        fst_dice.rollTime = 0;
      }
    } else{
      for (let i of fst_wood) {
        let d = dist(mouseX, mouseY, i.x, i.y);
        if (!i.overfire && d < i.r) {
          i.picked = true;
          break;
        }
      }
    }
  }
  if (phase == "fst_ing"){
    if (mouseX > X/2-60 && mouseX < X/2+60 &&
        mouseY > 460 && mouseY < 600) {
      //console.log("Button clicked!");
      fst_next++;
      fst_timerrr = 0;
    }
  }
  //
  if (phase == "ast_begin"){
    if (mouseX > X/2-60 && mouseX < X/2+60 &&
        mouseY > 460 && mouseY < 600) {
      //console.log("Button clicked!");
      phase = "ast";
    }
  }
  if (phase == "ast"){
    if (dist(mouseX, mouseY, ast_joyX, ast_joyY) < ast_joySize) {
      ast_moving = true;
    }
  }
}

function touchMoved() {
  if (phase == "ast"){
    if (ast_moving) {
      let angle = atan2(mouseY - ast_joyY, mouseX - ast_joyX);
      let d = min(dist(mouseX, mouseY, ast_joyX, ast_joyY), ast_joySize);
      ast_knobX = ast_joyX + cos(angle) * d;
      ast_knobY = ast_joyY + sin(angle) * d;
      ast_player_facing = angle;
    }
    return false;
  }
  //
  if (phase == "fst"){
    for (let i of fst_wood) {
      if (i.picked){
        i.x = mouseX;
        i.y = mouseY;
      }
    }
  }
  //
}

function touchEnded() {
  if (phase == "fst"){
    for (let i of fst_wood) {
      if (i.picked) {
        let d = dist(i.x, i.y, fst_fire.x, fst_fire.y);
        if (d < fst_fire.w / 2) {
          i.overfire = true;
          fst_wood_cnt--;
        }
        i.picked = false;
      }
    }
  }
  //
  if (phase == "ast"){
    ast_moving = false;
    ast_knobX = ast_joyX;
    ast_knobY = ast_joyY;
  }
  //
  if (phase == "hbd_begin"){
    if (mouseX > X/2-120 && mouseX < X/2+120 &&
        mouseY > Y/2-70 && mouseY < Y/2+230) {
      t = 0;
      phase = "hbd_ing";
      time = 0;
      maxTime = 12000;
      startTime = millis();
    }
  }
  if (phase == "hbd_end_pre"){
    if (mouseX > X/2-60 && mouseX < X/2+60 &&
        mouseY > 460 && mouseY < 600) {
      phase = "hbd_end";
    }
  }
  if (phase == "hbd_end"){
    launchRocket(mouseX, height, random(-12, -16));
    if (mouseX > X/2-120 && mouseX < X/2+120 &&
        mouseY > Y/2-70 && mouseY < Y/2+230) {
      hbd_showquote = !hbd_showquote;
    }
  }
}

//
//
//
//
//

function call_start(){
  fill(0, 0, 0);
  rect(0, 0, X, Y);
  
  noStroke();
  fill(50, 50, 50, 180);
  rect(100, 100, 1133-200, 744-200, 25);
  fill(100, 200, 250);
  rect(X/2-60, 530, 120, 70, 10);
  
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  
  textSize(60);
  text("小魚登月", X/2, 180);
  
  textSize(30);
  text("即將踏上登月的旅程", X/2, 330);
  
  
  textSize(30);
  text("開始啦!", X/2, 567);
}

//
//
//

function setup_fst_hbd(){
  rockets = [];
  particles = [];
  particles_fire = [];
  time = 0;
  maxTime = 12000; // 12 seconds in milliseconds
  startTime = millis();
}

function setup_fst_dice(){
  fst_dice = {
    x: X/2,
    y: Y/2,
    size: 150,
    value: 1,
    isRolling: false,
    rollTime: 0,
    rollDuration: 120,
    rotation: 0,
    targetRotation: 0
  };
  fst_dice_ing = 0;
  fst_curr_time = 0;
  
  fst_fail = 0;
  fst_next = 0;
  fst_timerrr = 0;
}

function setup_fst_cloud(){
  fst_cloud_X = [];
  fst_cloud_Y = [];
  fst_cloud_vX = [];
  fst_cloud_dist = [];
  fst_cloud_type = [];
  fst_cloud_amp = [];
  fst_cloud_cnt = 0;
  for (let i = 0; i < 8; i++){
    fst_cloud_X.push(random(-200, 1300));
    fst_cloud_Y.push(random(0, 100));
    fst_cloud_vX.push(random(0.3, 0.45));
    if (i % 2 == 1) fst_cloud_vX[i] *= -1;
    fst_cloud_dist.push(255);
    fst_cloud_type.push(int(random(0, 2.99)));
    fst_cloud_amp.push(random(0.7, 1.2));
    fst_cloud_cnt++;
  }
  for (let i = 0; i < 6; i++){
    fst_cloud_X.push(random(-200, 1300));
    fst_cloud_Y.push(random(50, 150));
    fst_cloud_vX.push(random(0.15, 0.3));
    if (i % 2 == 1) fst_cloud_vX[i] *= -1;
    fst_cloud_dist.push(180);
    fst_cloud_type.push(int(random(0, 2.99)));
    fst_cloud_amp.push(random(0.7, 1.2));
    fst_cloud_cnt++;
  }
  for (let i = 0; i < 9; i++){
    fst_cloud_X.push(random(-200, 1300));
    fst_cloud_Y.push(random(100, 190));
    fst_cloud_vX.push(random(0.08, 0.25));
    if (i % 2 == 0) fst_cloud_vX[i] *= -1;
    fst_cloud_dist.push(70);
    fst_cloud_type.push(int(random(0, 2.99)));
    fst_cloud_amp.push(random(0.7, 1.3));
    fst_cloud_cnt++;
  }
}

function setup_fst_wood(){
  fst_wood = [];
  for (let i = 0; i < 5; i++) {
    fst_wood.push({
      x: 0,
      y: 0,
      r: 30,
      picked: false,
      overfire: false
    });
  }
  fst_fire = {x: 570, y: 450, w: 200, h: 200};
  fst_fire_lit = false;
  fst_wood_cnt = 5;
  call_fst_wood_spread();
}
//
//
//

function call_fst(){
  for (let i of fst_wood) {
    if (!i.overfire) {
      //fill(255, 200, 0);
      //ellipse(i.x, i.y, i.r * 2);
      image(fst_img_wood, i.x-i.r*1.2, i.y-i.r*1.2, i.r*2.4, i.r*2.4);
    }
  }
  if (fst_fire_lit){
    image(fst_img_fire_on, fst_fire.x-110, fst_fire.y-100, 220, 200);
  } else{
    image(fst_img_fire_off, fst_fire.x-110, fst_fire.y-110, 220, 220);
  }
  if (fst_wood_cnt == 0){
    fst_wood_cnt = 5;
    fst_dice_ing = 1;
  }
  if (fst_dice_ing == 1){
    call_fst_dice();
  } else if (fst_dice_ing == 2){
    call_fst_dice_done();
  }
}

function call_fst_ing(){
  if (t < 60*6.5){
    image(fst_img_fire_off, fst_fire.x-110, fst_fire.y-110, 220, 220);
    call_hbd_fire();
  } else if (t < 60*11){
    image(fst_img_fire_on, fst_fire.x-110, fst_fire.y-100, 220, 200);
    call_hbd_fire();
  } else if (t < 60*11.5){
    image(fst_img_fire_on, fst_fire.x-110, fst_fire.y-100, 220, 200);
  } else{
    noStroke();
    fill(50, 50, 50, 180);
    rect(100, 100, 1133-200, 744-200, 25);
    fill(100, 200, 250);
    rect(X/2-60, 530, 120, 70, 10);
  
    fill(255);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
  
    if (fst_next == 0){
      textSize(60);
      text("恭喜獲得", X/2, 180);
      textSize(40);
      text("神聖火炬", X/2, 320);
      textSize(40);
      text("繼續", X/2, 567);
      push();
      translate(ast_playerX, ast_playerY);
      rotate(ast_player_facing+PI/2);
      imageMode(CENTER);
      image(torch_img, 0, 0, 80, 80);
      pop();
    } else if (fst_next == 1){
      textSize(60);
      text("中秋烤肉", X/2, 180);
      textSize(40);
      text("現在請想像妳正在烤肉", X/2, 320);
      textSize(40);
      text("繼續", X/2, 567);
      push();
      translate(ast_playerX, ast_playerY);
      rotate(ast_player_facing+PI/2);
      imageMode(CENTER);
      image(torch_img, 0, 0, 80, 80);
      pop();
    }
  }
  if (fst_next == 2){
    fst_timerrr++;
    //image(fst_img_fire_on, fst_fire.x-110, fst_fire.y-100, 220, 200);
    fill(0, 0, 0, fst_timerrr*0.9);
    rect(0, 0, X, Y);
    if (fst_timerrr > 60*5){
      phase = "ast_begin";
    }
  }
}


function call_fst_wood_spread(){
  for (let i = 0; i < 5; i++){
    theta = random(0, 2*PI);
    radius = random(80, 160);
    fst_wood[i].x = 570+radius*cos(theta)*1.5;
    fst_wood[i].y = 450+radius*sin(theta);
  }
  fst_wood_cnt = 5;
}

function call_fst_dice_done(){
  if (t - fst_curr_time <= 240){
    noStroke();
    fill(50, 50, 50, 180);
    rect(100, 100, 1133-200, 744-200, 25);
    push();
    translate(fst_dice.x, fst_dice.y);
    rotate(fst_dice.rotation);
    fill(0, 0, 0, 100);
    rect(-fst_dice.size/2 + 5, -fst_dice.size/2 + 5, fst_dice.size, fst_dice.size, 10);
    fill(255);
    stroke(0);
    strokeWeight(3);
    rect(-fst_dice.size/2, -fst_dice.size/2, fst_dice.size, fst_dice.size, 10);
    fill(0);
    noStroke();
    call_fst_dice_drawDots(fst_dice.value, fst_dice.size);
    pop();
    fill(255);
    textSize(55);
    textAlign(CENTER, CENTER);
    text("有時候運氣也是實力的一部分!", 1133/2, 190);
    if (fst_dice.value == 6){
      text("恭喜! 成功生火", 1133/2, 600);
      fst_fire_lit = true;
      
    } else{
      text("很可惜，火沒被生起來", 1133/2, 590);
      fst_fail++;
    }
  } else{
    if (fst_fire_lit){
      phase = "fst_ing";
      t = 0;
      time = 0;
      maxTime = 12000;
      startTime = millis();
      fst_dice_ing = 0;
      if (fst_dice.value == 6){
        // animation plays after
      }
    } else{
      fst_dice_ing = 0;
      for (let i = 0; i < 5; i++) {
        fst_wood[i].picked = false;
        fst_wood[i].overfire = false;
      }
      fst_wood_cnt = 5;
      call_fst_wood_spread();
    }
  }
}
function call_fst_dice(){
  noStroke();
  fill(50, 50, 50, 180);
  rect(100, 100, 1133-200, 744-200, 25);
  if (fst_dice.isRolling) {
    fst_dice.rollTime++;
    fst_dice.rotation += 0.3;
    if (frameCount % 5 === 0) {
      if (fst_fail >= 2){
        fst_dice.value = 6;
      } else {
        fst_dice.value = floor(random(1, 6.999));
      }
    }
    if (fst_dice.rollTime >= fst_dice.rollDuration) {
      fst_dice.isRolling = false;
      fst_dice.rollTime = 0;
      if (fst_fail >= 2){
        fst_dice.value = 6;
      } else {
        fst_dice.value = floor(random(1, 6.999));
      }
      fst_dice.rotation = 0;
      fst_dice_ing = 2;
      fst_curr_time = t;
    }
  }
  push();
  translate(fst_dice.x, fst_dice.y);
  rotate(fst_dice.rotation);
  fill(0, 0, 0, 100);
  rect(-fst_dice.size/2 + 5, -fst_dice.size/2 + 5, fst_dice.size, fst_dice.size, 10);
  fill(255);
  stroke(0);
  strokeWeight(3);
  rect(-fst_dice.size/2, -fst_dice.size/2, fst_dice.size, fst_dice.size, 10);
  fill(0);
  noStroke();
  call_fst_dice_drawDots(fst_dice.value, fst_dice.size);
  pop();
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("有時候運氣也是實力的一部分!", 1133/2, 190);
}

function call_fst_dice_drawDots(fst_dice_value, fst_dice_size) {
  let fst_dice_dotSize = fst_dice_size * 0.12;
  let fst_dice_offset = fst_dice_size * 0.25;
  switch(fst_dice_value) {
    case 1:
      ellipse(0, 0, fst_dice_dotSize);
      break;
    case 2:
      ellipse(-fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      break;
    case 3:
      ellipse(-fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(0, 0, fst_dice_dotSize);
      ellipse(fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      break;
    case 4:
      ellipse(-fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(-fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      ellipse(fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      break;
    case 5:
      ellipse(-fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(0, 0, fst_dice_dotSize);
      ellipse(-fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      ellipse(fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      break;
    case 6:
      ellipse(-fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(fst_dice_offset, -fst_dice_offset, fst_dice_dotSize);
      ellipse(-fst_dice_offset, 0, fst_dice_dotSize);
      ellipse(fst_dice_offset, 0, fst_dice_dotSize);
      ellipse(-fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      ellipse(fst_dice_offset, fst_dice_offset, fst_dice_dotSize);
      break;
  }
}

function enviroment_fst_background(){
  enviroment_fst_sky();
  enviroment_fst_ground();
  enviroment_fst_cloud();
  enviroment_fst_tree();
}

function enviroment_fst_sky() {
  for (let i = 0; i < height; i++) {
    let local_inter = map(i, 0, height, 0, 1);
    let local_c = lerpColor(color(135, 206, 250), color(255, 255, 255), local_inter); 
    stroke(local_c);
    line(0, i, width, i);
  }
}

function enviroment_fst_ground() {
  noStroke();
  let local_groundTop = height * 0.4;
  let local_groundBottom = height;
  for (let i = 0; i < (local_groundBottom - local_groundTop); i += 0.5) {
    let local_inter = map(i, 0, local_groundBottom - local_groundTop, 0, 1);
    let local_c = lerpColor(color(120, 240, 120), color(30, 100, 30), local_inter);
    fill(local_c);
    quad(
      0, local_groundTop + i,
      width, local_groundTop + i,
      width, local_groundTop + i + 1,
      0, local_groundTop + i + 1
    );
  }
}

function enviroment_fst_cloud(){
  for (let i = 0; i < fst_cloud_cnt; i++){
    if (fst_cloud_X[i] < -200 || fst_cloud_X[i] > 1300){
      fst_cloud_vX[i] *= -1;
    }
    fst_cloud_X[i] += fst_cloud_vX[i];
    tint(255, fst_cloud_dist[i]);
    image(fst_img_cloud[fst_cloud_type[i]], fst_cloud_X[i], fst_cloud_Y[i], fst_cloud_amp[i] *120, fst_cloud_amp[i] *70);
    noTint();
  }
}

function enviroment_fst_tree(){
  image(fst_img_tree_2b, 860, 272, 60, 60); 
  image(fst_img_tree_2t, 860, 212, 60, 60); 
  image(fst_img_tree_2b, 890, 274, 57, 57); 
  image(fst_img_tree_2t, 890, 217, 57, 57); 
  image(fst_img_tree_2b, 925, 280, 54, 54); 
  image(fst_img_tree_2t, 925, 226, 54, 54); 
  image(fst_img_tree_1b, 978, 285, 48, 48); 
  image(fst_img_tree_1t, 978, 237, 48, 48); 
  image(fst_img_tree_2b, 859, 271, 51, 51); 
  image(fst_img_tree_2t, 859, 220, 51, 51); 
  image(fst_img_tree_2b, 996, 302, 49, 49); 
  image(fst_img_tree_2t, 996, 253, 49, 49); 
  image(fst_img_tree_1b, 1012, 326, 59, 59); 
  image(fst_img_tree_1t, 1012, 267, 59, 59); 
  image(fst_img_tree_1b, 1089, 264, 61, 61); 
  image(fst_img_tree_1t, 1089, 203, 61, 61); 
  image(fst_img_tree_2b, 992, 235, 68, 68); 
  image(fst_img_tree_2t, 992, 167, 68, 68); 
  image(fst_img_tree_1b, 937, 282, 63, 63); 
  image(fst_img_tree_1t, 937, 219, 63, 63); 
  image(fst_img_tree_1b, 901, 268, 65, 65); 
  image(fst_img_tree_1t, 901, 203, 65, 65); 
  image(fst_img_tree_2b, 861, 258, 75, 75); 
  image(fst_img_tree_2t, 861, 183, 75, 75); 
  image(fst_img_tree_1b, 1008, 317, 60, 60); 
  image(fst_img_tree_1t, 1008, 257, 60, 60); 
  image(fst_img_tree_2b, 1091, 241, 76, 76); 
  image(fst_img_tree_2t, 1091, 165, 76, 76); 
  image(fst_img_tree_2b, 22, 272, 49, 49); 
  image(fst_img_tree_2t, 22, 223, 49, 49); 
  image(fst_img_tree_1b, 10, 271, 66, 66); 
  image(fst_img_tree_1t, 10, 205, 66, 66); 
  image(fst_img_tree_1b, 55, 260, 61, 61); 
  image(fst_img_tree_1t, 55, 199, 61, 61); 
  image(fst_img_tree_1b, 130, 267, 67, 67); 
  image(fst_img_tree_1t, 130, 200, 67, 67); 
  image(fst_img_tree_2b, 178, 242, 79, 79); 
  image(fst_img_tree_2t, 178, 163, 79, 79); 
  image(fst_img_tree_2b, 202, 283, 60, 60); 
  image(fst_img_tree_2t, 202, 223, 60, 60);  
  image(fst_img_tree_1b, 255, 259, 56, 56); 
  image(fst_img_tree_1t, 255, 203, 56, 56); 
  image(fst_img_tree_2b, 110, 260, 53, 53); 
  image(fst_img_tree_2t, 110, 207, 53, 53); 
  image(fst_img_tree_2b, 181, 288, 54, 54); 
  image(fst_img_tree_2t, 181, 234, 54, 54); 
  image(fst_img_tree_2b, 91, 266, 67, 67); 
  image(fst_img_tree_2t, 91, 199, 67, 67); 
  image(fst_img_tree_1b, 1, 284, 69, 69); 
  image(fst_img_tree_1t, 1, 215, 69, 69); 
  image(fst_img_tree_1b, 30, 289, 65, 65); 
  image(fst_img_tree_1t, 30, 224, 65, 65); 
  image(fst_img_tree_2b, 70, 276, 78, 78); 
  image(fst_img_tree_2t, 70, 198, 78, 78); 
  image(fst_img_tree_1b, 1110, 271, 58, 58); 
  image(fst_img_tree_1t, 1110, 213, 58, 58); 
  image(fst_img_tree_1b, 1088, 267, 63, 63); 
  image(fst_img_tree_1t, 1088, 204, 63, 63); 
  image(fst_img_tree_1b, 1071, 239, 77, 77); 
  image(fst_img_tree_1t, 1071, 162, 77, 77); 
  image(fst_img_tree_1b, 1046, 255, 58, 58); 
  image(fst_img_tree_1t, 1046, 197, 58, 58); 
  image(fst_img_tree_2b, 1004, 262, 63, 63); 
  image(fst_img_tree_2t, 1004, 199, 63, 63); 
  image(fst_img_tree_2b, 971, 254, 70, 70); 
  image(fst_img_tree_2t, 971, 184, 70, 70); 
  image(fst_img_tree_2b, 921, 263, 60, 60); 
  image(fst_img_tree_2t, 921, 203, 60, 60); 
  image(fst_img_tree_2b, 890, 266, 59, 59); 
  image(fst_img_tree_2t, 890, 207, 59, 59); 
  image(fst_img_tree_1b, 853, 253, 76, 76); 
  image(fst_img_tree_1t, 853, 177, 76, 76); 
  image(fst_img_tree_1b, 820, 260, 54, 54); 
  image(fst_img_tree_1t, 820, 206, 54, 54); 
  image(fst_img_tree_2b, 1109, 323, 73, 73); 
  image(fst_img_tree_2t, 1109, 250, 73, 73); 
  image(fst_img_tree_1b, 1074, 352, 55, 55); 
  image(fst_img_tree_1t, 1074, 297, 55, 55); 
  image(fst_img_tree_1b, 1031, 336, 69, 69); 
  image(fst_img_tree_1t, 1031, 267, 69, 69); 
  image(fst_img_tree_1b, 999, 325, 75, 75); 
  image(fst_img_tree_1t, 999, 250, 75, 75); 
  image(fst_img_tree_1b, 941, 338, 54, 54); 
  image(fst_img_tree_1t, 941, 284, 54, 54); 
  image(fst_img_tree_2b, 896, 327, 64, 64); 
  image(fst_img_tree_2t, 896, 263, 64, 64); 
  image(fst_img_tree_2b, 855, 321, 69, 69); 
  image(fst_img_tree_2t, 855, 252, 69, 69);
  image(fst_img_tree_2b, 921, 358, 51, 51); 
  image(fst_img_tree_2t, 921, 307, 51, 51); 
  image(fst_img_tree_2b, 957, 349, 60, 60); 
  image(fst_img_tree_2t, 957, 289, 60, 60); 
  image(fst_img_tree_1b, 991, 324, 78, 78); 
  image(fst_img_tree_1t, 991, 246, 78, 78); 
  image(fst_img_tree_2b, 1018, 339, 64, 64); 
  image(fst_img_tree_2t, 1018, 275, 64, 64); 
  image(fst_img_tree_1b, 1074, 382, 51, 51); 
  image(fst_img_tree_1t, 1074, 331, 51, 51); 
  image(fst_img_tree_1b, 1102, 382, 76, 76); 
  image(fst_img_tree_1t, 1102, 306, 76, 76); 
  image(fst_img_tree_2b, 1124, 410, 59, 59); 
  image(fst_img_tree_2t, 1124, 351, 59, 59);
  image(fst_img_tree_1b, 983, 377, 60, 60); 
  image(fst_img_tree_1t, 983, 317, 60, 60); 
  image(fst_img_tree_1b, 1014, 371, 63, 63); 
  image(fst_img_tree_1t, 1014, 308, 63, 63); 
  image(fst_img_tree_1b, 1043, 358, 79, 79); 
  image(fst_img_tree_1t, 1043, 279, 79, 79); 
  image(fst_img_tree_2b, 906, 411, 58, 58); 
  image(fst_img_tree_2t, 906, 353, 58, 58); 
  image(fst_img_tree_1b, 939, 412, 70, 70); 
  image(fst_img_tree_1t, 939, 342, 70, 70); 
  image(fst_img_tree_2b, 994, 434, 67, 67); 
  image(fst_img_tree_2t, 994, 367, 67, 67); 
  image(fst_img_tree_2b, 1038, 438, 64, 64); 
  image(fst_img_tree_2t, 1038, 374, 64, 64); 
  image(fst_img_tree_1b, 1106, 436, 77, 77); 
  image(fst_img_tree_1t, 1106, 359, 77, 77); 
  image(fst_img_tree_1b, 1062, 428, 68, 68); 
  image(fst_img_tree_1t, 1062, 360, 68, 68); 
  image(fst_img_tree_2b, -22, 276, 51, 51); 
  image(fst_img_tree_2t, -22, 225, 51, 51); 
  image(fst_img_tree_1b, -27, 292, 64, 64); 
  image(fst_img_tree_1t, -27, 228, 64, 64); 
  image(fst_img_tree_1b, -28, 327, 50, 50); 
  image(fst_img_tree_1t, -28, 277, 50, 50); 
  image(fst_img_tree_2b, 10, 319, 64, 64); 
  image(fst_img_tree_2t, 10, 255, 64, 64); 
  image(fst_img_tree_2b, 39, 326, 50, 50); 
  image(fst_img_tree_2t, 39, 276, 50, 50); 
  image(fst_img_tree_2b, 72, 322, 55, 55); 
  image(fst_img_tree_2t, 72, 267, 55, 55); 
  image(fst_img_tree_1b, 109, 303, 62, 62); 
  image(fst_img_tree_1t, 109, 241, 62, 62); 
  image(fst_img_tree_2b, 136, 296, 69, 69); 
  image(fst_img_tree_2t, 136, 227, 69, 69); 
  image(fst_img_tree_1b, 168, 312, 73, 73); 
  image(fst_img_tree_1t, 168, 239, 73, 73);
  image(fst_img_tree_2b, 119, 298, 77, 77); 
  image(fst_img_tree_2t, 119, 221, 77, 77);
  image(fst_img_tree_2b, 221, 253, 66, 66); 
  image(fst_img_tree_2t, 221, 187, 66, 66); 
  image(fst_img_tree_2b, -20, 337, 76, 76); 
  image(fst_img_tree_2t, -20, 261, 76, 76); 
  image(fst_img_tree_2b, 37, 347, 62, 62); 
  image(fst_img_tree_2t, 37, 285, 62, 62); 
  image(fst_img_tree_2b, 80, 343, 66, 66); 
  image(fst_img_tree_2t, 80, 277, 66, 66); 
  image(fst_img_tree_1b, 162, 359, 70, 70); 
  image(fst_img_tree_1t, 162, 289, 70, 70); 
  image(fst_img_tree_1b, 195, 353, 59, 59); 
  image(fst_img_tree_1t, 195, 294, 59, 59);
  image(fst_img_tree_1b, -25, 418, 62, 62); 
  image(fst_img_tree_1t, -25, 356, 62, 62); 
  image(fst_img_tree_1b, 108, 338, 58, 58); 
  image(fst_img_tree_1t, 108, 280, 58, 58); 
  
}

//
//
//
//
//

function setup_ast_logic(){
  ast_bg_shift = 0;
  ast_end_timer = 0;
}

function setup_ast_comet(){
  ast_playerX = X/2;
  ast_playerY = 430;
  ast_X = [];
  ast_Y = [];
  ast_vX = [];
  ast_vY = [];
  ast_cnt = 0;
  ast_size = [];
  ast_hit = [];
  
  ast_joyX = X/2;
  ast_joyY = 570;
  ast_joySize = 80;
  ast_knobX = ast_joyX;
  ast_knobY = ast_joyY;
  ast_moving = false;
  
  ast_hp = 10;
  ast_player_facing = -PI/2;
  ast_invtime = 120;
}

function setup_ast_meteor(){
  ast_meteor_X = [];
  ast_meteor_Y = [];
  ast_meteor_vX = [];
  ast_meteor_vY = [];
  ast_meteor_eX = [];
  ast_meteor_eY = [];
  ast_meteor_cnt = 0;
  ast_meteor_time = [];
}

function call_ast_die(){
  enviroment_ast_background();
  enviroment_ast_star();
  enviroment_ast_meteor();
  noStroke();
  fill(50, 50, 50, 180);
  rect(100, 100, 1133-200, 744-200, 25);
  fill(100, 200, 250);
  rect(X/2-170, 530, 340, 70, 10);
  
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  
  textSize(60);
  text("墜機啦", X/2, 180);
  
  textSize(30);
  text("嗯對寫這code的說妳要重跑一次這個程式", X/2, 320);
  textSize(30);
  text("下次可能考慮別撞隕石吧", X/2, 420);
  textSize(30);
  text("鍾笛元你真是太貼心啦", X/2, 567);
  
}

function call_ast_end(){
  enviroment_ast_background();
  enviroment_ast_star();
  enviroment_ast_meteor();
  push();
  translate(ast_playerX, ast_playerY);
  rotate(ast_player_facing+PI/2);
  imageMode(CENTER);
  image(torch_img, 0, 0, 64, 64);
  pop();
  
  ast_end_timer++;
  ast_playerY -= 7;
  ast_bg_shift += 2.8;
  
  noStroke();
  fill(0, 0, 0, ast_end_timer*0.9);
  rect(0, 0, X, Y);
  
  if (ast_end_timer > 240){
    phase = "hbd_begin";
    setup_hbd();
  }
}

function call_ast_begin(){
  enviroment_ast_background();
  enviroment_ast_star();
  enviroment_ast_meteor();
  push();
  translate(ast_playerX, ast_playerY);
  rotate(ast_player_facing+PI/2);
  imageMode(CENTER);
  image(torch_img, 0, 0, 80, 80);
  pop();
  
  noStroke();
  fill(50, 50, 50, 180);
  rect(100, 100, 1133-200, 744-200, 25);
  fill(100, 200, 250);
  rect(X/2-60, 530, 120, 70, 10);
  
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  
  textSize(60);
  text("星空旅行", X/2, 180);
  
  textSize(30);
  text("要飛向月球了，請保護好聖火並穿越這些隕石，到達月球表面", X/2, 330);
  
  
  textSize(30);
  text("起飛啦", X/2, 567);
}

function call_ast(){
  enviroment_ast_background();
  enviroment_ast_star();
  enviroment_ast_meteor();
  call_ast_comet();
  call_ast_joycon();
  call_ast_health();
  call_ast_logic();
}

function call_ast_logic(){
  ast_bg_shift += 0.6;
  if (ast_bg_shift >= 1200){
    phase = "ast_end";
  }
}

function call_ast_health(){
  for (let i = 0; i < ast_hp; i++){
    image(ast_img_hp, 50+i*45, 60, 60, 60);
  }
  if (ast_hp < 0.1){
    phase = "ast_die";
  }
}

function call_ast_joycon(){
  noFill();
  stroke(0);
  ellipse(ast_joyX, ast_joyY, ast_joySize*2);
  fill(150);
  noStroke();
  ellipse(ast_knobX, ast_knobY, ast_joySize);
  if (ast_moving) {
    let dx = ast_knobX - ast_joyX;
    let dy = ast_knobY - ast_joyY;
    ast_playerX += dx * 0.085;
    ast_playerY += dy * 0.085;

    ast_playerX = constrain(ast_playerX, 40, X - 40);
    ast_playerY = constrain(ast_playerY, 40, Y - 40);
  }
  push();
  translate(ast_playerX, ast_playerY);
  rotate(ast_player_facing+PI/2);
  imageMode(CENTER);
  image(torch_img, 0, 0, 80, 80);
  pop();
}
function call_ast_comet(){
  ast_invtime--;
  if (t % 10 == 0 && random(0, 10) < 8.5){
    call_ast_createcomet();
  }
  for (let i = 0; i < ast_cnt; i++){
    ast_X[i] += ast_vX[i];
    ast_Y[i] += ast_vY[i];
    if (ast_size[i] == 1) image(ast_img_comet1, ast_X[i]-20, ast_Y[i]-20, 40, 40);
    else if (ast_size[i] == 2) image(ast_img_comet2, ast_X[i]-20, ast_Y[i]-20, 40, 40);
    else if (ast_size[i] == 3) image(ast_img_comet3, ast_X[i]-45, ast_Y[i]-45, 90, 90);
    else if (ast_size[i] == 4) image(ast_img_comet4, ast_X[i]-45, ast_Y[i]-45, 90, 90);
    if (!ast_hit[i] && dist(ast_X[i], ast_Y[i], ast_playerX, ast_playerY) < 20 && ast_invtime < 0){
      ast_hit[i] = 1;
      ast_hp--;
      ast_invtime = 120;
    } else if (!ast_hit[i] && dist(ast_X[i], ast_Y[i], ast_playerX, ast_playerY) < 40 && ast_size[i] > 2){
      ast_hit[i] = 1;
      ast_hp--;
    }
    
    if (ast_Y[0] > Y+200){
      ast_X.shift();
      ast_Y.shift();
      ast_vX.shift();
      ast_vY.shift();
      ast_size.shift();
      ast_cnt--;
    }
  }
}
function call_ast_createcomet(){
  ast_X.push(random(-100, X+100));
  ast_Y.push(-100);
  ast_vX.push(random(-5, 5));
  ast_vY.push(random(1, 10));
  ast_size.push(int(random(1, 4.999)));
  ast_cnt++;
  ast_hit.push(0);
}

function setup_ast_star(){
  ast_star_X = [];
  ast_star_Y = [];
  ast_star_power = [];
  ast_star_time = [];
  ast_star_cnt = 0;
  for (let i = 0; i < 120; i++){
    ast_star_X.push(random(-100, X+100));
    ast_star_Y.push(random(-100, Y+100));
    ast_star_power.push(random(0, 255));
    ast_star_time.push(t-random(0, 120));
    ast_star_cnt++;
  }
}

function enviroment_ast_meteor(){
  stroke(255, 255, 200, 50);
  strokeWeight(0.6);
  if (random(0, 1000) < 30){
    curX = random(-100, X+100);
    curY = random(-100, Y+100);
    ast_meteor_X.push(curX);
    ast_meteor_Y.push(curY);
    ast_meteor_vX.push(random(-2.5, 2.5));
    ast_meteor_vY.push(random(3, 7));
    ast_meteor_eX.push(curX);
    ast_meteor_eY.push(curY);
    ast_meteor_time.push(random(90, 240));
    ast_meteor_cnt++;
  }
  for (let i = 0; i < ast_meteor_cnt; i++){
    if (ast_meteor_time[i] > 0){
      ast_meteor_eX[i] += ast_meteor_vX[i];
      ast_meteor_eY[i] += ast_meteor_vY[i];
      ast_meteor_X[i] += ast_meteor_vX[i]/2;
      ast_meteor_Y[i] += ast_meteor_vY[i]/2;
      line(ast_meteor_X[i], ast_meteor_Y[i], ast_meteor_eX[i], ast_meteor_eY[i]);
    } else if(dist(ast_meteor_X[i], ast_meteor_Y[i], ast_meteor_eX[i], ast_meteor_eY[i]) > 2){
      ast_meteor_X[i] += ast_meteor_vX[i]/2;
      ast_meteor_Y[i] += ast_meteor_vY[i]/2;
      line(ast_meteor_X[i], ast_meteor_Y[i], ast_meteor_eX[i], ast_meteor_eY[i]);
      circle(ast_meteor_eX[i], ast_meteor_eY[i], 2);
    }
    //fill(255, 0, 0);
    //circle(ast_meteor_eX[i], ast_meteor_eY[i], 2);
    //fill(0, 255, 0);
    //circle(ast_meteor_X[i], ast_meteor_Y[i], 2);
    if (ast_meteor_time[0] < -240){
      ast_meteor_X.shift();
      ast_meteor_Y.shift();
      ast_meteor_vX.shift();
      ast_meteor_vY.shift();
      ast_meteor_eX.shift();
      ast_meteor_eY.shift();
      ast_meteor_time.shift();
      ast_meteor_cnt--;
    }
    ast_meteor_time[i]--;
  }
}

function enviroment_ast_star(){
  for (let i = 0; i < ast_star_cnt; i++){
    fill(255, 255, 200, ast_star_power[i]-(t-ast_star_time[i])*2);
    noStroke();
    ellipse(ast_star_X[i], ast_star_Y[i], 3, 3);
    if (ast_star_time[i]+120 < t){
      ast_star_X.shift();
      ast_star_Y.shift();
      ast_star_power.shift();
      ast_star_time.shift();
      ast_star_cnt--;
    }
  }
  if (random(0, 100) < 40){
    ast_star_X.push(random(-100, X+100));
    ast_star_Y.push(random(-100, Y+100));
    ast_star_power.push(random(0, 255));
    ast_star_time.push(t);
    ast_star_cnt++;
  }
}

function enviroment_ast_background(){
  background(15, 10, 40);
  tint(255, 30);
  image(ast_img_planet1, 30, -500+ast_bg_shift, 400, 400);
  tint(255, 30);
  image(ast_img_planet2, 700, -450+(ast_bg_shift*1.2), 400, 400);
  tint(255, 20);
  image(ast_img_planet3, 900, -800+(ast_bg_shift*0.8), 500, 500);
  tint(255, 25);
  image(ast_img_planet4, 250, -950+(ast_bg_shift*0.85), 600, 600);
  tint(255, 20);
  image(ast_img_planet5, -200, -1400+ast_bg_shift, 500, 500);
  noTint();
}

//
//
//
//
//

function setup_hbd(){
  rockets = [];
  particles = [];
  particles_fire = [];
  time = 0;
  maxTime = 12000; // 12 seconds in milliseconds
  startTime = millis();
  hbd_qt_type = [];
  hbd_qt_X = [];
  hbd_qt_Y = [];
  hbd_qt_vY = [];
  hbd_showquote = false;
  hbd_quotes = [
  "可愛", 
  "我好電", 
  "夢回成大", 
  "夢回中秋", 
  "生日快樂", 
  "中秋雙十", 
  "輕輕鬆鬆啊", 
  "柔柔生日快樂", 
  "我相信妳可以的", 
  "謝妤柔生日快樂", 
  "投資理財要趁早", 
  "祝妳學測全15級分", 
  "這句話暖她一整天", 
  "學測比code還難想", 
  "人美心善的校花哪裡找", 
  "我會認真的 我會認真的", 
  "偷偷告訴你妳 他一個禮拜前才開始做這個", 
  "中秋快樂", 
  "成年了欸", 
  "該考駕照了吧", 
  "快去辦信用卡", 
  "學測加油", 
  "哈哈哈", 
  "恭喜通過新手教學", 
  "登月了欸", 
  "18歲生日快樂", 
  "祝妳生日快樂"
  ]
}

/*

謝妤柔恭喜妳找到這個小彩蛋
去跟鍾笛元說"啊國文15級分還不輕輕鬆鬆"
然後許個願
會很靈

*/

function call_hbd_fire(){
  time = millis() - startTime;
  let progress = constrain(time / maxTime, 0, 1);
  
  // Create new particles based on progress
  let particleRate = progress * 12;
  for (let i = 0; i < particleRate; i++) {
    particles_fire.push(new FireParticle(progress));
  }
  
  // Update and display particles
  for (let i = particles_fire.length - 1; i >= 0; i--) {
    particles_fire[i].update();
    particles_fire[i].display();
    
    if (particles_fire[i].isDead()) {
      particles_fire.splice(i, 1);
    }
  }
  
  // Restart animation after completion
  if (time > maxTime + 2000) {
    startTime = millis();
    particles_fire = [];
  }
}

function call_hbd_begin(){
  call_hbd_character();
  image(hbd_img_gift, X/2-140, Y/2-60, 280, 280);
  fill(240, 240, 140, sin(t*0.03)*sin(t*0.03)*10+5);
  tint(240, 240, 140, sin(t*0.03)*sin(t*0.03)*10+5);
  circle(X/2, Y/2+80, 310+sin(t*0.03)*sin(t*0.03)*100);

}

function call_hbd_ing(){
  call_hbd_character();
  //phase = "hbd_end";
  if (t < 60*2){
    fill(0, 0, 0, t*1.7);
    rect(0, 0, X, Y);
  } else if (t < 60*11.5){
    fill(0, 0, 0, min(t*1.7, 210));
    rect(0, 0, X, Y);
    call_hbd_fire();
    if (t > 60*10.2 && random(0, 100) < 80) launchRocket(random(50, width - 50), random(height, 450), random(-6, -9));
  } else if (t < 60*30){
    fill(0, 0, 0, max(0, (60*11.5)-t));
    rect(0, 0, X, Y);
    if (random(0, 100) < 5) launchRocket(random(50, width - 50), height, random(-8, -12));
    hbd_firework();
    call_hbd_word();
  }else{
    phase = "hbd_end_pre";
  }
}

function call_hbd_endpre(){
  call_hbd_character();
  if (random(0, 100) < 5) launchRocket(random(50, width - 50), height, random(-8, -12));
  hbd_firework();
  call_hbd_word();
  noStroke();
  fill(50, 50, 50, 180);
  rect(100, 100, 1133-200, 744-200, 25);
  fill(100, 200, 250);
  rect(X/2-60, 530, 120, 70, 10);
  
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  
  //textSize(60);
  //text("生日快樂!!!", X/2, 180);
  
  textSize(30);
  text("點一下螢幕 可以放煙火", X/2, 330);
  textSize(30);
  text("點一下蛋糕 可以調整彈幕", X/2, 420);
  
  
  textSize(30);
  text("慶祝!!!", X/2, 567);
}

function call_hbd_word(){
  image(hbd_img_cake, X/2-150, Y/2-70, 300, 300);
  fill(255);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  fill(50, 50, 50);
  textSize(61);
  text("生日快樂", X/2-1, 105);
  text("生日快樂", X/2-1, 105);
  text("生日快樂", X/2, 105-1);
  text("生日快樂", X/2, 105+1);
  textSize(60);
  fill(255);
  text("生日快樂", X/2, 105);
  fill(100, 100, 100);
  textSize(101);
  text("謝妤柔", X/2-2, 220);
  text("謝妤柔", X/2+2, 220);
  text("謝妤柔", X/2, 220-2);
  text("謝妤柔", X/2, 220+2);
  fill(255);
  textSize(100);
  text("謝妤柔", X/2, 220);
  fill(200, 150, 150);
  textSize(55);
  text("2025/10/02", X/2-1.5, 650);
  text("2025/10/02", X/2+1.5, 650);
  text("2025/10/02", X/2, 650-1.5);
  text("2025/10/02", X/2, 650+1.5);
  fill(255);
  textSize(55);
  text("2025/10/02", X/2, 650);
}

function call_hbd_end(){
  call_hbd_character();
  if (random(0, 100) < 5) launchRocket(random(50, width - 50), height, random(-8, -12));
  hbd_firework();
  call_hbd_word();
  call_hbd_quotes_loop();
  if (t % 120 == 0 && random(0, 100) < 50 && hbd_showquote){
    call_hbd_quotes_summon();
  }
}

function call_hbd_character(){
  fill(255, 0, 0);
  image(hbd_img_whitecatproject, 890, 410, 190, 190);
  image(hbd_img_spirit, 695, 350, 180, 220);
  image(hbd_img_redspirit, 45, 410, 190, 190);
  image(hbd_img_magic, 230, 320, 230, 250);
}

function call_hbd_quotes_summon(){
  hbd_qt_type.push(int(random(0, 26.999)));
  console.log(int(random(0, 16.999)));
  hbd_qt_X.push(random(100, 800));
  hbd_qt_Y.push(Y);
  hbd_qt_vY.push(random(0.5, 2));
}

function call_hbd_quotes_loop(){
  for (let i = 0; i < hbd_qt_type.length; i++){
    hbd_qtlen = hbd_quotes[hbd_qt_type[i]].length;
    hbd_qt_Y[i] -= hbd_qt_vY[i];
    fill(0, 0, 0, 200);
    rect(hbd_qt_X[i]-hbd_qtlen*10-6.5, hbd_qt_Y[i]-21, hbd_qtlen*20+13, 38, 11);
    fill(255, 255, 255, 255);
    noTint();
    rect(hbd_qt_X[i]-hbd_qtlen*10-5.5, hbd_qt_Y[i]-20, hbd_qtlen*20+11, 36, 10);
    if (hbd_qt_Y[i] < Y/2+20){
      noStroke();
      fill(6, 6, 31, 255);
      rect(hbd_qt_X[i]-hbd_qtlen*10-6.5, hbd_qt_Y[i]+17, hbd_qtlen*20+13, 2);
    }
    fill(0, 0, 0);
    noTint();
    textSize(20);
    text(hbd_quotes[hbd_qt_type[i]], hbd_qt_X[i], hbd_qt_Y[i]);
  }
  if (hbd_qt_Y.length > 1){
    if (hbd_qt_Y[0] < -100){
      hbd_qt_type.shift();
      hbd_qt_X.shift();
      hbd_qt_Y.shift();
      hbd_qt_vY.shift();
    }
  }  
}

function enviroment_hbd_firework(){
  hbd_firework();
  fill(0, 0, 20, 30);
  tint(0, 0, 70, 10);
  rect(0, 0, X, Y);
  noTint();
}

function enviroment_hbd_background(){
  tint(255, 20);
  fill(0, 0, 20, 20);
  rect(0, 0, X, Y);
  noTint();
  
  enviroment_hbd_meteor();
  enviroment_hbd_star();
  image(hbd_img_background_front, 0, 0, X, Y);
}

function setup_hbd_meteor(){
  hbd_meteor_X = [];
  hbd_meteor_Y = [];
  hbd_meteor_vX = [];
  hbd_meteor_vY = [];
  hbd_meteor_eX = [];
  hbd_meteor_eY = [];
  hbd_meteor_cnt = 0;
  hbd_meteor_time = [];
}
function enviroment_hbd_meteor(){
  stroke(255, 255, 170, 60);
  strokeWeight(0.9);
  if (random(0, 1000) < 50){
    curX = random(-100, X+100);
    curY = random(-100, Y+100);
    hbd_meteor_X.push(curX);
    hbd_meteor_Y.push(curY);
    hbd_meteor_vX.push(random(-2.5, 2.5));
    hbd_meteor_vY.push(random(3, 7));
    hbd_meteor_eX.push(curX);
    hbd_meteor_eY.push(curY);
    hbd_meteor_time.push(random(40, 120));
    hbd_meteor_cnt++;
  }
  for (let i = 0; i < hbd_meteor_cnt; i++){
    if (hbd_meteor_time[i] > 0){
      hbd_meteor_eX[i] += hbd_meteor_vX[i];
      hbd_meteor_eY[i] += hbd_meteor_vY[i];
      hbd_meteor_X[i] += hbd_meteor_vX[i]/2;
      hbd_meteor_Y[i] += hbd_meteor_vY[i]/2;
      line(hbd_meteor_X[i], hbd_meteor_Y[i], hbd_meteor_eX[i], hbd_meteor_eY[i]);
    } else if(dist(hbd_meteor_X[i], hbd_meteor_Y[i], hbd_meteor_eX[i], hbd_meteor_eY[i]) > 2){
      hbd_meteor_X[i] += hbd_meteor_vX[i]/2;
      hbd_meteor_Y[i] += hbd_meteor_vY[i]/2;
      line(hbd_meteor_X[i], hbd_meteor_Y[i], hbd_meteor_eX[i], hbd_meteor_eY[i]);
      circle(hbd_meteor_eX[i], hbd_meteor_eY[i], 2);
    }
    if (hbd_meteor_time[0] < -240){
      hbd_meteor_X.shift();
      hbd_meteor_Y.shift();
      hbd_meteor_vX.shift();
      hbd_meteor_vY.shift();
      hbd_meteor_eX.shift();
      hbd_meteor_eY.shift();
      hbd_meteor_time.shift();
      hbd_meteor_cnt--;
    }
    hbd_meteor_time[i]--;
  }
}

function setup_hbd_star(){
  hbd_star_X = [];
  hbd_star_Y = [];
  hbd_star_power = [];
  hbd_star_time = [];
  hbd_star_cnt = 0;
  for (let i = 0; i < 120; i++){
    hbd_star_X.push(random(-100, X+100));
    hbd_star_Y.push(random(-100, Y+100));
    hbd_star_power.push(random(0, 255));
    hbd_star_time.push(t-random(0, 120));
    hbd_star_cnt++;
  }
}
function enviroment_hbd_star(){
  for (let i = 0; i < hbd_star_cnt; i++){
    fill(255, 255, 200, hbd_star_power[i]-(t-hbd_star_time[i])*2);
    noStroke();
    ellipse(hbd_star_X[i], hbd_star_Y[i], 4, 4);
    if (hbd_star_time[i]+120 < t){
      hbd_star_X.shift();
      hbd_star_Y.shift();
      hbd_star_power.shift();
      hbd_star_time.shift();
      hbd_star_cnt--;
    }
  }
  if (random(0, 100) < 40){
    hbd_star_X.push(random(-100, X+100));
    hbd_star_Y.push(random(-100, Y+100));
    hbd_star_power.push(random(0, 255));
    hbd_star_time.push(t);
    hbd_star_cnt++;
  }
}

//
//
//  these are effects that take up alot of space and they are super cool, generated by gpt and claude, big thanks to them, tho some codes above are generated by them as well, mainly about dice, fire particals, firework
//
//

function hbd_firework(){
  noStroke();
  fill(10, 10, 30, 40);

  // occasionally auto-launch a rocket
  if (random(0, 100) < 5) {
    launchRocket(random(50, width - 50), height, random(-8, -12));
  }

  // update & draw rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    let r = rockets[i];
    r.vy += r.gravity;
    r.x += r.vx;
    r.y += r.vy;

    // trail
    r.trail.push({ x: r.x, y: r.y, a: 200 });
    if (r.trail.length > 10) r.trail.shift();

    // draw trail
    for (let t = 0; t < r.trail.length; t++) {
      let tr = r.trail[t];
      fill(r.col[0], r.col[1], r.col[2], tr.a * (t / r.trail.length));
      ellipse(tr.x, tr.y, 3);
    }

    // draw rocket head
    fill(...r.col);
    ellipse(r.x, r.y, 6);

    // explode condition
    if (r.vy > -1 || r.y < height * 0.15) {
      explode(r.x, r.y, r.col);
      rockets.splice(i, 1); // ✅ clears rocket
    }

    // safety: remove if somehow off-screen without exploding
    if (r.y > height + 50) {
      rockets.splice(i, 1);
    }
  }

  // update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= p.air;
    p.vy *= p.air;
    p.life -= p.decay;

    noStroke();
    fill(p.col[0], p.col[1], p.col[2], p.life);
    ellipse(p.x, p.y, p.size);

    // sparkle
    if (random(1) < 0.03) {
      fill(255, 255, 220, p.life);
      ellipse(p.x + random(-2, 2), p.y + random(-2, 2), p.size * 0.25);
    }

    // remove when dead or way offscreen
    if (p.life <= 0 || p.y > height + 50) {
      particles.splice(i, 1); // ✅ clears particle
    }
  }
}

// launch a rocket from (x, y) with initial upward vy
function launchRocket(x, y, initialVy) {
  let col = [random(120, 255), random(120, 255), random(120, 255)]; // bright color
  rockets.push({
    x: x,
    y: y,
    vx: random(-0.7, 0.7),
    vy: initialVy,
    gravity: 0.08,
    col: col,
    trail: []
  });
}

// explode into many particles
function explode(x, y, baseColor) {
  hbd_sound_firework.setVolume(random(0.04, 0.2));
  hbd_sound_firework.play();
  let particleCount = int(random(40, 120));
  for (let i = 0; i < particleCount; i++) {
    let angle = random(TWO_PI);
    let speed = random(1, 6) * (random() < 0.2 ? 0.6 : 1); // some slower, some faster
    let vx = cos(angle) * speed;
    let vy = sin(angle) * speed;
    // small color variance
    let col = [
      constrain(baseColor[0] + random(-30, 30), 100, 255),
      constrain(baseColor[1] + random(-30, 30), 100, 255),
      constrain(baseColor[2] + random(-30, 30), 100, 255)
    ];

    particles.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      gravity: 0.02,
      air: 0.995,
      life: random(200, 255),
      decay: random(1.2, 3.0),
      size: random(2, 6),
      col: col
    });
  }
}

class FireParticle {
  constructor(intensity) {
    // Use gaussian distribution for more natural, rounded spread
    let angle = random(TWO_PI);
    let radius = randomGaussian(0, 60 * intensity);
    radius = abs(radius); // Keep positive
    
    this.x = width / 2 + cos(angle) * radius;
    this.y = height - 185 + sin(angle) * radius * 0.15; // Very flat base
    
    // Much stronger upward velocity
    this.vx = cos(angle) * random(0.2, 0.6) * intensity;
    this.vy = random(-8, -14) * intensity; // Greatly increased upward velocity
    
    this.alpha = 255;
    this.size = random(15, 40) * intensity;
    this.life = random(120, 200) * intensity; // Much longer life for taller flames
    this.maxLife = this.life;
    this.intensity = intensity;
    
    // Color variation (red, orange, yellow)
    this.colorType = random();
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.99; // Less horizontal damping
    this.vy *= 0.98; // Minimal vertical damping to keep rising
    
    // Add some turbulence
    this.x += random(-0.5, 0.5);
    
    this.life -= 1;
    this.alpha = map(this.life, 0, this.maxLife, 0, 255);
    this.size *= 0.97;
  }
  
  display() {
    noStroke();
    let lifeRatio = this.life / this.maxLife;
    
    // Color transitions: yellow -> orange -> red -> dark
    let r, g, b;
    if (this.colorType < 0.3) {
      // Yellow core
      r = 255;
      g = map(lifeRatio, 0, 1, 100, 220);
      b = map(lifeRatio, 0, 1, 0, 50);
    } else if (this.colorType < 0.7) {
      // Orange
      r = 255;
      g = map(lifeRatio, 0, 1, 50, 150);
      b = 0;
    } else {
      // Red
      r = map(lifeRatio, 0, 1, 100, 255);
      g = map(lifeRatio, 0, 1, 0, 50);
      b = 0;
    }
    
    // Multiple glow layers for smoother appearance
    fill(r, g, b, this.alpha * 0.15 * this.intensity);
    ellipse(this.x, this.y, this.size * 2.5);
    
    fill(r, g, b, this.alpha * 0.3 * this.intensity);
    ellipse(this.x, this.y, this.size * 1.8);
    
    fill(r, g, b, this.alpha * 0.6 * this.intensity);
    ellipse(this.x, this.y, this.size * 1.2);
    
    fill(r, g, b, this.alpha * this.intensity);
    ellipse(this.x, this.y, this.size);
  }
  
  isDead() {
    return this.life <= 0;
  }

}


