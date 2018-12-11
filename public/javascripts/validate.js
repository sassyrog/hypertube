$(window).on("load", function() {
    $(document).on("click", function() {
        if ($('#errors'))
            $('#errors').remove();
    });
    $('#form').on('input', function() {
        var reg = /^[a-z]+$/i;
        var regU = /^[a-z0-9_]+$/i;
        var regem = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        tex = '';
        var firstname = $('#firstname').val(),
            lastname = $('#lastname').val(),
            username = $('#username').val(),
            email = $('#email').val(),
            p1 = $('#password1').val(),
            p2 = $('#password2').val();

        if (firstname && !firstname.match(reg))
            tex += '- only letters on firstname field<br>';
        if (lastname && !lastname.match(reg))
            tex += '- only letters on lastname field<br>';
        if (username && !username.match(regU))
            tex += '- only numbers, letters and underscore on username field<br>';
        if (email && !email.match(regem))
            tex += '- email should have formart login@domain.ext<br>';
        if (p1 && p1.length < 6)
            tex += '- password too short<br>';
        var level = sMeter(p1, '#strength');
        if (p1 && level < 3)
            tex += '- password too weak: you can do better<br>';
        if (level == 3)
            tex += '- password still weak<br>';
        if (p2 && !(p1 == p2))
            tex += '- passwords don\'t match<br>';
        if (tex) {
            $('#err_msg').css('display', 'block');
        } else {
            $('#err_msg').css('display', 'none');
        }
        $('#err_msg').html(tex);
        if (!tex && firstname && lastname && email && $('#password1').val() && $('#password2').val()) {
            $('#submit').removeClass('disabled');
            $("#submit").removeAttr('disabled');
        } else if (!$('#submit').hasClass('disabled') && (!firstname || !lastname || !email || !$('#password1').val() || !$('#password2').val() || tex))
            $('#submit').addClass('disabled');
    });
});