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
        },
        submitHandler: function() {
            console.log('Submiting user');
            $.ajax({
                type: 'POST',
                url: '/users',
                data: $('#registerHere').serialize()
            }).done(function(data){
                if (data.error == undefined) {
                    console.log('SUCCES: ' + data);
                    $.cookie('id_user', data.id)
                    window.location.href= "/";
                } else {
                    alert(data.error);
                    console.log('ERROR: '+ data.error);
                }
            });
        }
    });
});

