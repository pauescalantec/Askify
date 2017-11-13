$("#idWhiteButtLogin").on('click', function(){
  validateLog();
});

getCookieData();

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
        $(".alert").alert('close');

        setTimeout(function() {
            createDangerAlert("#login", "Invalid credentials, try again", "loginInvalidAlert");
        }, 300);
        
      }
    });
  }
  else{
    text = "Please make sure your credentials are correct";
  }
 }

 function createDangerAlert(selectorId, alertMessage, alertId){
  $(selectorId).prepend('<div class="alert alert-danger alert-dismissable fade in" id=" ' + alertId + '" style="padding: 15px; margin:10px 10px"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + alertMessage +'</div>');
}

function getCookieData(){
  var jsonData = { 
      "action" : "getCookie"
  };
  // PHP cookie service
  $.ajax({
      url: "./PHP/AppLayer.php",
      type: "POST",
      data: jsonData,
      dataType: "json",
      success: function (jsonResponse){
          $("#usernameInput").val(jsonResponse.savedUser);    
      }
  });
}
