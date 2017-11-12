$("#idWhiteButtLogin").on('click', function(){
  validateLog();
});

function validateLog(){
  //validation of credentials
  var valUsername = $('#usernameInput').val();
  var valPassword = $('#passwordInput').val();

  if( usernameInput != "" && passwordInput != ""){

    var jsonSend = {
      "uName" : valUsername ,
      "uPassword" : valPassword,
      "rememberMe" : $("#rememberMe").is(":checked"),
      "action": "login"
    };

    $.ajax({
      url: "./PHP/AppLayer.php",
      type: "POST",
      data : jsonSend,
      ContentType : "application/json",
      dataType: "json",
      success: function(response){
        window.location.href = "index.html";
      },
      error: function (errorMS){
        alert("Please make sure your credentials are correct " + errorMS.statusText);
      }
    });
  }
  else{
    text = "Please make sure your credentials are correct";
  }
 }
