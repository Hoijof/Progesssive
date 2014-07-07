function setWidth() {
    $('#mainContainer').css('width', $(window).width() - 20).css('height', $(window).height() - 40);
}

$(document).ready(function() {
    setWidth();
    $(window).resize(function() {
        setWidth();
    });
});