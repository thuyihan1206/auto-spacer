$(function () {

    $('.up-button').on('click', function () {
        var target = $('#top');
        $('html, body').animate({
            scrollTop: target.offset().top
        }, 500);
    });

    $(window).on('scroll', function () {
        var btn = $('.up-button');
        if (isScrolledPastView('#top') && btn.is(':hidden')) {
            btn.fadeIn();
        } else if (!isScrolledPastView('#top') && btn.is(':visible')) {
            btn.fadeOut();
        }
    });

    $('#change-btn').on('click', function() {
        var text = $('#original-text').val();
        $('#changed-text').val(autoSpace(text));
    });

});

function isScrolledPastView(elem) {
    var docViewTop = $(window).scrollTop();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (elemBottom < docViewTop);
}

function autoSpace(text) {
    return text;
}