$(document).ready(function()
{
    // Popover
    $('#registerHere input').hover(
        function(){ $(this).popover('show'); },
        function(){ $(this).popover('hide'); }
    );

    // Validation of inputs

    $("#registerHere").validate({
        rules:{
            user:"required",
            email:{required:true,email: true},
            password:{required:true,minlength: 6},
            password_confirm:{required:true,equalTo: "#password"}
        },

        messages:{
            user:"Entra nom d'usuari",
            email:{
                required:"Entra correu electrònic",
                email:"Entra un correu electrònic vàlid"},
            password:{
                required:"Entra contrasenya",
                minlength:"Ha de contenir mínim 6 caràcters"},
            password_confirm:{
                required:"Entra confirmació de contrasenya",
                equalTo:"La contrasenya i la seva confirmació han de coincidir"}
        },
        errorClass: "help-inline",
        errorElement: "span",
        highlight:function(element, errorClass, validClass)
        {
            $(element).parents('.control-group').addClass('error');
        },
        unhighlight: function(element, errorClass, validClass)
        {
            $(element).parents('.control-group').removeClass('error');
            $(element).parents('.control-group').addClass('success');
        }
    });
/*
    $('#registerHere').submit(function() {
        var ruser= $('#registerHere #user').val();
        var rname= $('#registerHere #name').val();
        var rsurnames= $('#registerHere #surnames').val();
        var remail= $('#registerHere #email').val();
        var rpassword= $('#registerHere #password').val();

        var u= {
            user: ruser,
            name: rname,
            surnames: rsurnames,
            email: remail,
            password: rpassword
        };

        addUser(u);
    });*/
});

function addUser(user) {
    $.ajax({
       url: '/users',
        method: 'post',

        success: function(data) {

        }
    });
}