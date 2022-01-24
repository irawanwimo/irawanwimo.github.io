mobile_check = $( window ).width();

if(mobile_check < 769){
    console.log(mobile_check)
    $(document.body).addClass("body_mobile");
    $(document.body).css("overflow-x", "hidden");
}else{
    console.log(mobile_check)
}


