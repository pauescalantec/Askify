$("#idWhiteButtLogin").on('click', function(log){
  log.preventDefault();
  validateLog();
});

function validateLog(){
  //validation of credentials
  var valUsername = $('#usernameInput').val();
  var valPassword = $('#passwordInput').val();

  if( usernameInput != "" && passwordInput != ""){

    var jsonSend = {
      "uName" : uName ,
      "uPassword" : uPassword,
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
        window.location.href = "index.php";
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
