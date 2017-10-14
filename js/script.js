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
        var $changedTextArea = $('#changed-text');
        var $copyBtn = $('#copy-btn');

        $changedTextArea.val(autoSpace(text));

        if ($changedTextArea.val()) {
            $copyBtn.text('Copy Code');
            $copyBtn.show();
        } else {
            $copyBtn.hide();
        }
    });

    $('#copy-btn').on('click', function() {
        $('#changed-text').select();

        try {
            if (document.execCommand('copy')) {
                $('#copy-btn').text('Copied!');
            }
        } catch (err) {
            alert('Error: Unable to copy');
        }
    });

});

function isScrolledPastView(elem) {
    var docViewTop = $(window).scrollTop();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (elemBottom < docViewTop);
}

function autoSpace(text) {
    var space = '[ \t]*';

    // general rules for common operators
    var ops = ['#', '%'];
    $.each(ops, function(index, val) {
        var regExp = new RegExp(val + space, 'g');
        text = text.replace(regExp, val.slice(-1) + ' ');
    });

    var otherOps = ['\\.', '!', '~', ':'];

    ops = ['\\+', '\\-', '\\*', '\\/', '\\', '&', '\\|', '\\^', '<', '>', '='];
    $.each(ops, function(index, val) {
        var regExp = new RegExp(space + val + space, 'g');
        text = text.replace(regExp, ' ' + val.slice(-1) + ' ');
    });

    ops = ops.concat(otherOps);
    var doubleOps = new Array(Math.pow(ops.length, 2));
    var count = 0;
    for (var i = 0; i < ops.length; i++) {
        for (var j = 0; j < ops.length; j++, count++) {
            doubleOps[count] = new Array(2);
            doubleOps[count][0] = ops[i];
            doubleOps[count][1] = ops[j];
        }
    }
    $.each(doubleOps, function(index, val) {
        if (val[0] === '\\.' && val[1] === '\\.') {
            return;
        }
        var regExp = new RegExp(space + val[0] + space + val[1] + space, 'g');
        text = text.replace(regExp, ' ' + val[0].slice(-1) + val[1].slice(-1) + ' ');
    });

    // special case: positive and negative numbers/variables
    var noSpaceOps = ['\\+', '\\-'];
    $.each(noSpaceOps, function(index, val) {
        var regExp = new RegExp(space + "([" + ops.join('') + "]+)" + space + val + space + "(.*)", 'g');
        text = text.replace(regExp, " $1 " + val.slice(-1) + "$2");
    });

    noSpaceOps = [['\\+', '\\+'], ['\\-', '\\-'], ['\\*', '\\*']];
    $.each(noSpaceOps, function(index, val) {
        var regExp = new RegExp(space + val[0] + space + val[1] + space, 'g');
        text = text.replace(regExp, val[0].slice(-1) + val[1].slice(-1));
    });

    ops = [['<', '=', '>'], ['=', '=', '='], ['\\*', '\\*', '='],
        ['>', '>', '='], ['<', '<', '='], ['&', '&', '='], ['\\|', '\\|', '=']];
    $.each(ops, function(index, val) {
        var regExp = new RegExp(space + val[0] + space + val[1] + space + val[2] + space, 'g');
        text = text.replace(regExp, ' '+ val[0].slice(-1) + val[1].slice(-1) + val[2].slice(-1) + ' ');
    });

    // special case: rational literals
    var regExp = new RegExp("(\\d+)" + space + "\\/" + space + "(\\d+)" + space + "r", 'g');
    text = text.replace(regExp, "$1/$2r");

    // general rules for punctuations
    ops = [',', ';'];
    $.each(ops, function(index, val) {
        var regExp = new RegExp(space + val + space, 'g');
        text = text.replace(regExp, val.slice(-1) + ' ');
    });

    // general rules for brackets
    ops = ['{'];
    $.each(ops, function(index, val) {
        var regExp = new RegExp(val + space, 'g');
        text = text.replace(regExp, val.slice(-1) + ' ');
    });

    ops = ['}'];
    $.each(ops, function(index, val) {
        var regExp = new RegExp(space + val, 'g');
        text = text.replace(regExp, ' ' + val.slice(-1));
    });

    noSpaceOps = ['\\(', '\\['];
    $.each(noSpaceOps, function(index, val) {
        var regExp = new RegExp(val + space, 'g');
        text = text.replace(regExp, val.slice(-1));
    });

    noSpaceOps = ['\\)', '\\]'];
    $.each(noSpaceOps, function(index, val) {
        var regExp = new RegExp(space + val, 'g');
        text = text.replace(regExp, val.slice(-1));
    });

    // special case: interpolated expressions
    regExp = new RegExp("#" + space + "{" + space + "([^} ]*)" + space + "}", 'g');
    text = text.replace(regExp, "#{$1}");

    return text;
}