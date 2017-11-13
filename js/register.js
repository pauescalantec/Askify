$("#idWhiteButtRegister").on('click', function(){
  valRegister();
});

function valRegister(){
    var jsonSend = {
        "uName" : $('#usernameInput').val(),
        "uPass" : $('#passwordInput').val(),
        "fName" : $('#fNameInput').val(),
        "lName" : $('#lNameInput').val(),
        "uEmail" : $('#uEmailInput').val(),
        "uMajor" : $('#uMajorInput').val(),
        "uGradYear" : $('#uGradYearInput').val(),
        "action": "register"
     };
     $.ajax({
       url: "./PHP/AppLayer.php",
       type: "POST",
       data : jsonSend,
       ContentType : "application/json",
       dataType: "json",
       success: function(response){
         window.location.href = "login.html";
       },
       error: function (errorMS){
        $(".alert").alert('close');

        $('html, body').stop().animate({
            scrollTop: $("#top").offset().top
        }, 600);
        
        setTimeout(function() {
            createDangerAlert("#registerContainer", "Registration Unsuccessful", "registerInvalidAlert");
        }, 400);
                
       }
     });
   }

   function createDangerAlert(selectorId, alertMessage, alertId){
    $(selectorId).prepend('<div class="alert alert-danger alert-dismissable fade in" id=" ' + alertId + '" style="padding: 15px; margin:10px 10px;"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + alertMessage +'</div>');
  }
  
