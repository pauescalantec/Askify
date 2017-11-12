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
         alert("Sorry, registration was not succecful  " + errorMS.statusText);
       }
     });
   }
