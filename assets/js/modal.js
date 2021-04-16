function testAnim(x) {
    $('.modal .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
};
$('.modal').on('show.bs.modal', function (e) {
  var anim = 'zoomIn';
      testAnim(anim);
})
$('.modal').on('hide.bs.modal', function (e) {
  var anim = 'zoomOut';
      testAnim(anim);
})