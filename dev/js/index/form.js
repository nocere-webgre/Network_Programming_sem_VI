$(document).ready(function() {

    if($('.index').length > 0) {
        buttonPlay.click(function () {
            validForm(steps);
        });

        $('#start-game').on('keyup keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) {
                validForm(steps);
                e.preventDefault();
                return false;

            }
        });
    }
});

function validForm(steps) {
    if (steps.name.val().length > 0) {
        steps.first.hide();
        steps.second.show();
    }
    else {
        steps.name.addClass('shake');

        setTimeout(function () {
            steps.name.removeClass('shake');
        }, 500)
    }
}

