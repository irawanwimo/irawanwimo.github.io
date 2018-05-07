var captionLength = 0;
var caption = '';

$(document).ready(function() {
    setInterval ('cursorAnimation()', 800);
    captionEl = $('#caption');

    setTimeout(function() { testTypingEffect(); }, 8000);
    setTimeout(function() { testErasingEffect(); }, 12000);
    setTimeout(function() { $('#pus-entrance').fadeOut(); }, 13500);
    setTimeout(function() { $('#pus-landing').fadeIn("slow", function() {}); }, 14500);
    setTimeout(function() { $('#mainMenu').fadeIn(); }, 15000);
});

function testTypingEffect() {
    caption = "Precise.Unique.Stable";
    type();
}

function type() {
    captionEl.html(caption.substr(0, captionLength++));
    if(captionLength < caption.length+1) {
        setTimeout('type()', 50);
    } else {
        captionLength = 0;
        caption = '';
    }
}

function testErasingEffect() {
    caption = captionEl.html();
    captionLength = caption.length;
    if (captionLength>0) {
        erase();
    } else {
        $('#caption').html("You didn't write anything to erase, but that's ok!");
        setTimeout('testErasingEffect()', 1000);
    }
}

function erase() {
    captionEl.html(caption.substr(0, captionLength--));
    if(captionLength >= 0) {
        setTimeout('erase()', 50);
    } else {
        captionLength = 0;
        caption = '';
    }
}

function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'fast', 'swing').animate({
        opacity: 1
    }, 'fast', 'swing');
}


$(".toggleMenu").on('click', function(){
  $("#mainMenu").toggleClass('open');
});
