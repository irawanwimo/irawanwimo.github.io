mobile_check = $( window ).width();

if(mobile_check < 769){
    console.log(mobile_check)
    $(document.body).addClass("body_mobile");
    $(document.body).css("overflow", "hidden");

    $('.boxarea').addClass("max-h-400");
}else{
    console.log(mobile_check)
    $('.cont-box').addClass("margin-t-70");
    $('.boxarea').addClass("max-h-500");
}

$(".slider ol li").on("click", function() {
    $(this).addClass("active").siblings("li").removeClass("active");
    $(".slider ul").animate({
        top: -$(".slider").height() * $(this).index()
    }, 500);
});

