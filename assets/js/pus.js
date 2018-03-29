/*------------------------------
  Album Cover Slider
--------------------------------*/
//start added by Chase
var a = document.getElementsByClassName("t_dc");
var cfImg = document.getElementsByClassName("coverflow__image")

var scaleI = 0;
for (scaleI; scaleI < a.length; scaleI++) {
if (scaleI === 3) {
continue;
} else {
// a[scaleI].style.cursor = "default";
a[scaleI].addEventListener("click", prevDef);
}
}

function prevDef(e) {
e.preventDefault();
}

function forScale(coverflowPos) {
for (scaleI = 0; scaleI < a.length; scaleI++) {
// a[scaleI].style.cursor = "default";
a[scaleI].addEventListener("click", prevDef);
}
for (scaleI = 0; scaleI < cfImg.length; scaleI++) {
if (cfImg[scaleI].getAttribute("data-coverflow-index") == coverflowPos) {
cfImg[scaleI].parentElement.style.cursor = "pointer";
cfImg[scaleI].parentElement.removeEventListener("click", prevDef);
}
}
}
//end added by Chase

function setupCoverflow(coverflowContainer) {
var coverflowContainers;

if (typeof coverflowContainer !== "undefined") {
if (Array.isArray(coverflowContainer)) {
coverflowContainers = coverflowContainer;
} else {
coverflowContainers = [coverflowContainer];
}
} else {
coverflowContainers = Array.prototype.slice.apply(document.getElementsByClassName('coverflow'));
}

coverflowContainers.forEach(function(containerElement) {
var coverflow = {};
var prevArrows, nextArrows;

//capture coverflow elements
coverflow.container = containerElement;
coverflow.images = Array.prototype.slice.apply(containerElement.getElementsByClassName('coverflow__image'));
coverflow.position = Math.floor(coverflow.images.length / 2) + 1;

//set indicies on images
coverflow.images.forEach(function(coverflowImage, i) {
coverflowImage.dataset.coverflowIndex = i + 1;
});

//set initial position
coverflow.container.dataset.coverflowPosition = coverflow.position;

//get prev/next arrows
prevArrows = Array.prototype.slice.apply(coverflow.container.getElementsByClassName("prev-arrow"));
nextArrows = Array.prototype.slice.apply(coverflow.container.getElementsByClassName("next-arrow"));

//add event handlers
function setPrevImage() {
coverflow.position = Math.max(1, coverflow.position - 1);
coverflow.container.dataset.coverflowPosition = coverflow.position;
//call the functin forScale added
forScale(coverflow.position);
}

function setNextImage() {
coverflow.position = Math.min(coverflow.images.length, coverflow.position + 1);
coverflow.container.dataset.coverflowPosition = coverflow.position;
//call the function Chase added
forScale(coverflow.position);
}

function jumpToImage(evt) {
coverflow.position = Math.min(coverflow.images.length, Math.max(1, evt.target.dataset.coverflowIndex));
coverflow.container.dataset.coverflowPosition = coverflow.position;
//start added by Chase
setTimeout(function() {
  forScale(coverflow.position);
}, 1);
//end added by Chase
}

// function onKeyPress(evt) {
// switch (evt.which) {
//   case 37: //left arrow
//     setPrevImage();
//     break;
//   case 39: //right arrow
//     setNextImage();
//     break;
// }
// }
prevArrows.forEach(function(prevArrow) {
prevArrow.addEventListener('click', setPrevImage);
});
nextArrows.forEach(function(nextArrow) {
nextArrow.addEventListener('click', setNextImage);
});
coverflow.images.forEach(function(image) {
image.addEventListener('click', jumpToImage);
});
// window.addEventListener('keyup', onKeyPress);
});
}

setupCoverflow();

// var n = 0;
// $(".next-arrow").click(function() {
//   n = n+1;
//   if(n>0){
//     $(".next-arrow").hide();
//   }
// });
//
// $("#cf3").click(function() {
//   n = n+1;
//   if(n>0){
//     $(".next-arrow").hide();
//   }
// });

$(".t_dc").click(function() {
  var c_s = $('.t_attr').attr('data-coverflow-position');
  console.log(c_s+" -----");

  if(c_s == '1'){

    $('.st_t_2').hide();
    $('.st_t_3').hide();

    $('.st_t_1').show();

    // console.log($('.st_kobe').attr('bgcover'));
    img = $('.st_kobe').attr('bgcover');
    $('#bg_store').fadeTo('fast', 0.1, function(){
        $(this).css('background-image', 'url(' + img + ')');
    }).fadeTo('slow', 1);

    $('#prev').text('');
    $('#next').text('Shabu2House ');
    $('#prev').addClass('hidden');

  }else if(c_s == '2'){
    $('.st_t_1').hide();
    $('.st_t_3').hide();

    $('.st_t_2').show();

    img = $('.st_shab').attr('bgcover')
    $('#bg_store').fadeTo('fast', 0.1, function(){
        $(this).css('background-image', 'url(' + img + ')');
    }).fadeTo('slow', 1);

    $('#prev').text(' Kobeshi');
    $('#next').text('Kobeshi Kitchen ');

    $('#next').removeClass('hidden');
    $('#prev').removeClass('hidden');
  }else if(c_s == '3'){
    $('.st_t_2').hide();
    $('.st_t_1').hide();

    $('.st_t_3').show();

    img = $('.st_koki').attr('bgcover');
    $('#bg_store').fadeTo('fast', 0.1, function(){
        $(this).css('background-image', 'url(' + img + ')');
    }).fadeTo('slow', 1);

    $('#prev').text(' Shabu2House');
    $('#next').text('');

    $('#next').addClass('hidden');
  }


});
