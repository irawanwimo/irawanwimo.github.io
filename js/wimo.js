var events = new Events();
events.add = function(obj) {
  obj.events = { };
}
events.implement = function(fn) {
  fn.prototype = Object.create(Events.prototype);
}
// console.log(events);
function Events() {
  this.events = { };
}
Events.prototype.on = function(name, fn) {
  var events = this.events[name];
  if (events == undefined) {
    this.events[name] = [ fn ];
    this.emit('event:on', fn);
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
      this.emit('event:on', fn);
    }
  }
  return this;
}
Events.prototype.once = function(name, fn) {
  var events = this.events[name];
  fn.once = true;
  if (!events) {
    this.events[name] = [ fn ];
    this.emit('event:once', fn);
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
      this.emit('event:once', fn);
    }
  }
  return this;
}
Events.prototype.emit = function(name, args) {
  var events = this.events[name];
  if (events) {
    var i = events.length;
    while(i--) {
      if (events[i]) {
        events[i].call(this, args);
        if (events[i].once) {
          delete events[i];
        }
      }
    }
  }
  return this;
}
Events.prototype.unbind = function(name, fn) {
  if (name) {
    var events = this.events[name];
    if (events) {
      if (fn) {
        var i = events.indexOf(fn);
        if (i != -1) {
          delete events[i];
        }
      } else {
        delete this.events[name];
      }
    }
  } else {
    delete this.events;
    this.events = { };
  }
  return this;
}

var userPrefix;

var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  userPrefix = {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();

function bindEvent(element, type, handler) {
  // var element = $( "#wrapper" );

  if(element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element["on" + type] = handler;
  }
}

function Viewport(data) {
  events.add(this);

  var self = this;
  this.element = data.element;
  this.fps = data.fps;
  this.sensivity = data.sensivity;
  this.sensivityFade = data.sensivityFade;
  this.touchSensivity = data.touchSensivity;
  this.speed = data.speed;

  this.lastX = 0;
  this.lastY = 0;
  this.mouseX = 0;
  this.mouseY = 0;
  this.distanceX = 0;
  this.distanceY = 0;
  this.positionX = 1122;
  this.positionY = 136;
  this.torqueX = 0;
  this.torqueY = 0;

  this.down = false;
  this.upsideDown = false;

  this.previousPositionX = 0;
  this.previousPositionY = 0;

  this.currentSide = 0;
  this.calculatedSide = 0;


  $( ".cube" ).mousedown(function() {
    self.down = true;
  });

  bindEvent(document, 'mouseup', function() {
    self.down = false;
  });

  bindEvent(document, 'keyup', function() {
    self.down = false;
  });

  bindEvent(document, 'mousemove', function(e) {
    self.mouseX = e.pageX;
    self.mouseY = e.pageY;
  });

  $( ".cube" ).on('touchstart', function(e) {

    self.down = true;
    e.touches ? e = e.touches[0] : null;
    self.mouseX = e.pageX / self.touchSensivity;
    self.mouseY = e.pageY / self.touchSensivity;
    self.lastX  = self.mouseX;
    self.lastY  = self.mouseY;
  });

  bindEvent(document, 'touchmove', function(e) {
    if(e.preventDefault) {
      e.preventDefault();
    }

    if(e.touches.length == 1) {

      e.touches ? e = e.touches[0] : null;

      self.mouseX = e.pageX / self.touchSensivity;
      self.mouseY = e.pageY / self.touchSensivity;

    }
  });

  bindEvent(document, 'touchend', function(e) {
    self.down = false;
  });

  setInterval(this.animate.bind(this), this.fps);

}
events.implement(Viewport);
Viewport.prototype.animate = function() {

  this.distanceX = (this.mouseX - this.lastX);
  this.distanceY = (this.mouseY - this.lastY);

  this.lastX = this.mouseX;
  this.lastY = this.mouseY;

  if(this.down) {
    this.torqueX = this.torqueX * this.sensivityFade + (this.distanceX * this.speed - this.torqueX) * this.sensivity;
    this.torqueY = this.torqueY * this.sensivityFade + (this.distanceY * this.speed - this.torqueY) * this.sensivity;
  }

  if(Math.abs(this.torqueX) > 1.0 || Math.abs(this.torqueY) > 1.0) {
    if(!this.down) {
      this.torqueX *= this.sensivityFade;
      this.torqueY *= this.sensivityFade;
    }

    this.positionY -= this.torqueY;

    if(this.positionY > 360) {
      this.positionY -= 360;
    } else if(this.positionY < 0) {
      this.positionY += 360;
    }

    if(this.positionY > 90 && this.positionY < 270) {
      this.positionX -= this.torqueX;

      if(!this.upsideDown) {
        this.upsideDown = true;
        this.emit('upsideDown', { upsideDown: this.upsideDown });
      }

    } else {

      this.positionX += this.torqueX;

      if(this.upsideDown) {
        this.upsideDown = false;
        this.emit('upsideDown', { upsideDown: this.upsideDown });
      }
    }

    if(this.positionX > 360) {
      this.positionX -= 360;
    } else if(this.positionX < 0) {
      this.positionX += 360;
    }

    if(!(this.positionY >= 46 && this.positionY <= 130) && !(this.positionY >= 220 && this.positionY <= 308)) {
      if(this.upsideDown) {
        if(this.positionX >= 42 && this.positionX <= 130) {
          this.calculatedSide = 3;
        } else if(this.positionX >= 131 && this.positionX <= 223) {
          this.calculatedSide = 2;
        } else if(this.positionX >= 224 && this.positionX <= 314) {
          this.calculatedSide = 5;
        } else {
          this.calculatedSide = 4;
        }
      } else {
        if(this.positionX >= 42 && this.positionX <= 130) {
          this.calculatedSide = 5;
        } else if(this.positionX >= 131 && this.positionX <= 223) {
          this.calculatedSide = 4;
        } else if(this.positionX >= 224 && this.positionX <= 314) {
          this.calculatedSide = 3;
        } else {
          this.calculatedSide = 2;
        }
      }
    } else {
      if(this.positionY >= 46 && this.positionY <= 130) {
        this.calculatedSide = 6;
      }

      if(this.positionY >= 220 && this.positionY <= 308) {
        this.calculatedSide = 1;
      }
    }

    if(this.calculatedSide !== this.currentSide) {
      this.currentSide = this.calculatedSide;
      this.emit('sideChange');
    }

  }

  this.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + this.positionY + 'deg) rotateY(' + this.positionX + 'deg)';

  if(this.positionY != this.previousPositionY || this.positionX != this.previousPositionX) {
    this.previousPositionY = this.positionY;
    this.previousPositionX = this.positionX;

    this.emit('rotate');

  }

}
var viewport = new Viewport({
  element: document.getElementsByClassName('cube')[0],
  fps: 30,
  sensivity: .08,
  sensivityFade: .93,
  speed: 1.8,
  touchSensivity: 1.5
});

function Cube(data) {
  var self = this;

  this.element = data.element;
  this.sides = this.element.getElementsByClassName('side');

  this.viewport = data.viewport;
  this.viewport.on('rotate', function() {
    self.rotateSides();
  });
  this.viewport.on('upsideDown', function(obj) {
    self.upsideDown(obj);
  });
  this.viewport.on('sideChange', function() {
    self.sideChange();
  });
}
Cube.prototype.rotateSides = function() {
  var viewport = this.viewport;
  if(viewport.positionY > 90 && viewport.positionY < 270) {
    this.sides[0].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + (viewport.positionX + viewport.torqueX) + 'deg)';
    this.sides[5].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + -(viewport.positionX + 180 + viewport.torqueX) + 'deg)';
  } else {
    this.sides[0].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + (viewport.positionX - viewport.torqueX) + 'deg)';
    this.sides[5].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + -(viewport.positionX + 180 - viewport.torqueX) + 'deg)';
  }
}
Cube.prototype.upsideDown = function(obj) {

  var deg = (obj.upsideDown == true) ? '180deg' : '0deg';
  var i = 5;

  while(i > 0 && --i) {
    this.sides[i].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + deg + ')';
  }

}
Cube.prototype.sideChange = function() {

  for(var i = 0; i < this.sides.length; ++i) {
    this.sides[i].getElementsByClassName('cube-image')[0].className = 'cube-image';
  }

  this.sides[this.viewport.currentSide - 1].getElementsByClassName('cube-image')[0].className = 'cube-image active';
  if(this.viewport.currentSide == 1){
    //credits
    $("#credits").show();

    $("#prologue").hide();
    $("#prologue2").hide();
    $("#educ").hide();
    $("#exper").hide();
    $("#skill").hide();
    $("#prof").hide();

  }else if(this.viewport.currentSide == 2){
    //edu
    $("#educ").show();

    $("#prologue").hide();
    $("#credits").hide();
    $("#prologue2").hide();
    $("#exper").hide();
    $("#skill").hide();
    $("#prof").hide();

  }else if(this.viewport.currentSide == 3){
    //exper
    $("#exper").show();

    $("#prologue").hide();
    $("#credits").hide();
    $("#educ").hide();
    $("#prologue2").hide();
    $("#skill").hide();
    $("#prof").hide();

  }else if(this.viewport.currentSide == 4){
    //prof
    $("#prof").show();

    $("#prologue").hide();
    $("#credits").hide();
    $("#educ").hide();
    $("#exper").hide();
    $("#skill").hide();
    $("#prologue2").hide();

  }else if(this.viewport.currentSide == 5){
    //skill
    $("#skill").show();

    $("#prologue").hide();
    $("#credits").hide();
    $("#educ").hide();
    $("#exper").hide();
    $("#prologue2").hide();
    $("#prof").hide();

  }else if(this.viewport.currentSide == 6){
    //prologue2
    $("#prologue").show();

    // $("#prologue").hide();
    $("#credits").hide();
    $("#educ").hide();
    $("#exper").hide();
    $("#skill").hide();
    $("#prof").hide();
  }

}

new Cube({
  viewport: viewport,
  element: document.getElementsByClassName('cube')[0]
});

var cipher = function() {
  function e(a, d, b) {
    var c, f, g, h;
    b == a.length ? k.animationComplete = !0 : (g = d.innerHTML, h = Math.floor(21 * Math.random() + 5), c = 32 === a[b] ? 32 : a[b] - h, f = setInterval(function() {
      d.innerHTML = g + String.fromCharCode(c);
      c == a[b] ? (clearInterval(f), c = 32, b++, setTimeout(function() {
        e(a, d, b);
      }, 10)) : c++;
    }, 7));
  }
  var k = {};
  return k = {animationComplete:!1, text:function(a) {
    this.animationComplete = !1;
    a = document.getElementById(a);
    for (var d = a.innerHTML, b = [], c = 0;c < d.length;c++) {
      b.push(d.charCodeAt(c));
    }
    a.innerHTML = "";
    e(b, a, 0);
  }};
}();

function op1(){
  $( '.op1' ).fadeIn( 'slow' );
  cipher.text( 'op' );
}

function op2(){
  $( '.op2' ).fadeIn( 'slow' );
  cipher.text( 'op2' );
}

function op3(){
  $( '.op3' ).fadeIn( 'slow' );
  cipher.text( 'op3' );
}

function op4(){
  $( '.op4' ).fadeIn( 'slow' );
  cipher.text( 'op4' );
}

function op5(){
  $( '.op5' ).fadeIn( 'slow' );
  cipher.text( 'op5' );
}

function op6(){
  $('#op5').hide();
  $( '.op6' ).fadeIn( 'slow' );
  cipher.text( 'op6' );
}

function op7(){
  $( '.op7' ).fadeIn( 'slow' );
  cipher.text( 'op7' );
  // $('#op7').removeClass("vishid").delay(9000).queue(function(){
  //   $('#op7').fadeOut( "slow", function() {}).dequeue();
  // });
  $('#op7').removeClass("vishid")
}

function op2ent(){
  $('.op1').hide();
  op2();
}

function op3ent(){
  $('.op2').hide();
  op3();
}

function op4ent(){
  $('.op3').hide();
  op4();
}

op1();
setTimeout(op2ent, 3000)
setTimeout(op3ent, 8000)
setTimeout(op4ent, 12000)

function play(){
  var audio = document.getElementById("bgm");
  // audio.play();
}

function moveProgressBar() {
  play();
  $('.progress-wrap').show();
  var getPercent = ($('.progress-wrap').data('progress-percent') / 100);
  var getProgressWrapWidth = $('.progress-wrap').width();
  var progressTotal = getPercent * getProgressWrapWidth;
  var animationLength = 6500;

  $('.progress-bar').stop().animate({
      left: progressTotal
  }, animationLength);
}

function loaderfade(){
  $('#scene').show();
  $( "#wim-load" ).fadeOut( "slow", function() {});
  $( "#op4" ).fadeOut( "slow", function() {});
  $( "#bestexp" ).fadeOut( "slow", function() {});
}

function animation(){
  $('#wrapper').addClass("animated six-s flipInX").delay(7000).queue(function(){
    $('#whatis').addClass("animated six-s fadeIn");
  });
}


setTimeout(moveProgressBar, 10000);
setTimeout(loaderfade, 17000);
setTimeout(animation, 18000);
setTimeout(op5, 23000);
setTimeout(op6, 26000);

//PROLOGUE SEQUENCES ------------------------------------------------
var proseq = 0;
$("#probtn").click(function(){
  if(proseq == 0){
    $('#prohide1').fadeTo(500, 0, function(){
      $("#prohide1").addClass("fade");
    });
    $('#prohide2').fadeTo(800, 0, function(){
      $("#prohide2").addClass("fade");
    });
    proseq++;
  }
  else if(proseq == 1){
    $("#prohead1").fadeOut( "slow", function() {});
    $("#prohead2").fadeIn( "slow", function() {});
    proseq++;
  }
});

$("#probtn2").click(function(){
  if(proseq == 0){
    $('#prohide3').fadeTo(500, 0, function(){
      $("#prohide3").addClass("fade");
    });
    $('#prohide4').fadeTo(800, 0, function(){
      $("#prohide4").addClass("fade");
    });
    proseq++;
  }
  else if(proseq == 1){
    $("#prohead3").fadeOut( "slow", function() {});
    $("#prohead4").fadeIn( "slow", function() {});
    proseq++;
  }
});
//PROLOGUE SEQUENCES ------------------------------------------------
