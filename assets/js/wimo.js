mobile_check = $( window ).width();

if(mobile_check < 769){
    $(document.body).addClass("body_mobile");
    $(document.body).css("overflow", "hidden");
}

$(".slider ol li").on("click", function() {
    $(this).addClass("active").siblings("li").removeClass("active");
    $(".slider ul").animate({
        top: -$(".slider").height() * $(this).index()
    }, 500);
});