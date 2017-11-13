var currentUserData = {};

$(document).ready(function(){
    loadProfile();

    $("#addTopicsButton").on("click", function(){
        addTopicsClicked();
    });

    $('#addTopicModal').on('hide.bs.modal', function (event) {
        $('#chooseTopicGrid').scrollTop(0);
        loadProfile();
    });

    $('#sendTopicsButton').on('click', function (event) {
        sendTopics();
    });

    $("#searchFieldTopics").keyup(function(event) {
        if (event.keyCode === 13) {
            startAddTopicsSearch();
        }
    });

    $("#startSearchTopics").click(function( event ) {
        startAddTopicsSearch();
    });
});

function startAddTopicsSearch(){
    $(".alert").alert('close');
    $('#sendTopicsButton').prop('disabled', false);
    $("#sendTopicsButton").text("Add Topics");
    $("#topicsGridList").html("");

    var searchField = $("#searchFieldTopics").val();

    var jsonData = {
        "searchField" : searchField,
        "action": "loadSearchRestTopics"
    };

    // PHP login service
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (response){  
            $("#topicsGridList").html("");
            
            for (i = 0; i < (response.length); i++) {
                $("#topicsGridList").append(helperCreateAddTopicHTML(response[i].topicName, "media/" + response[i].topicURL, response[i].topicId));
            }
            
            $("li[name='addTopicItem']").on("click", function() {
                var chosenId = $(this).attr("id");
                $(".alert").alert('close');

                // Another tutor was selected
                if ($("#" + chosenId).hasClass("selected")){
                    //Remove previous tutor selection
                    $("#" + chosenId).removeClass("selected");
                    $("#" + chosenId).css("background-color", "white");
                    $("#" + chosenId).css("color", "black");
                }

                else {
                    setTimeout(function () {
                        $("#" + chosenId).css("background-color", "rgba(52, 152, 219, 0.937)");
                        $("#" + chosenId).addClass("selected");
                        $("#" + chosenId).css("color", "white");
                    }, 50);
                }
            });
        },
        error: function (errorMessage){ 
            if (errorMessage.status == "406"){
                // No results available, populate accordingly
                $("#topicsGridList").html("");
                // Error message
                $("#topicsGridList").append('<p id="noTopics" style="text-align: center; padding-top:10px; color:gray;">No topics to add</p>');  
            }
        }
    });
}

function sendTopics(){
    $(".alert").alert('close');
    var topicsSelected = [];

    // get items selected
    var listItems = $("#topicsGridList li");
    listItems.each(function(idx, li) {
        var item = $(li);
        if(item.hasClass("selected")) {
            topicsSelected.push(item.attr("id"));
        }
    });

    if(topicsSelected.length > 0){
        // ajax call to add topics
        var jsonSendAddTopics = {
            "topicsCount" : topicsSelected.length,
            "topicsList" : topicsSelected,
            "action": "addTopics"
        };

        $.ajax({
            url: "./PHP/AppLayer.php",
            type: "POST",
            data : jsonSendAddTopics,
            ContentType : "application/json",
            dataType: "json",
            success: function(response){
                $('#sendTopicsButton').prop('disabled', true);
                $("#sendTopicsButton").text("Adding...");
    
                setTimeout(function() {
                    $('#addTopicModal').modal('toggle');
                    $('html, body').stop().animate({
                        scrollTop: $("#top").offset().top
                    }, 600);
    
                    // Create success alert
                    createSuccessAlert("#profileAlertContainer", "Successfully added topics to your profile", "addedTopicAlert");
                }, 1300);  
            },
            error: function (errorMS){
                // Error message
                setTimeout(function() {
                    createDangerAlert("#chooseTopicGrid",  "Error connecting to server. Try again later.", "serverErrorAlert");
                    $('#chooseTopicGrid').scrollTop(0);
                }, 300);  
            }
        });

    }

    else {
        setTimeout(function() {
            createDangerAlert("#chooseTopicGrid", "Choose topics to add", "topicsNotChoseAlert");
            $('#chooseTopicGrid').scrollTop(0);
        }, 300);  
    }
}

function addTopicsClicked(){
    loadRestOfTopics();

    setTimeout(function() {
        $('#addTopicModal').modal('toggle');
    }, 100);  
}

function loadRestOfTopics(){
    $(".alert").alert('close');
    $("#searchFieldTopics").val("");
    $('#sendTopicsButton').prop('disabled', false);
    $("#sendTopicsButton").text("Add Topics");
    $("#topicsGridList").html("");

    var jsonLoadRestTopics = {
        "action": "loadRestTopics"
      };

    // Call to server to laod topics
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data : jsonLoadRestTopics,
        ContentType : "application/json",
        dataType: "json",
        success: function(response){
            $("#topicsGridList").html("");

            for (i = 0; i < (response.length); i++) {
                $("#topicsGridList").append(helperCreateAddTopicHTML(response[i].topicName, "media/" + response[i].topicURL, response[i].topicId));
            }
            
            $("li[name='addTopicItem']").on("click", function() {
                var chosenId = $(this).attr("id");
                $(".alert").alert('close');

                // Another tutor was selected
                if ($("#" + chosenId).hasClass("selected")){
                    //Remove previous tutor selection
                    $("#" + chosenId).removeClass("selected");
                    $("#" + chosenId).css("background-color", "white");
                    $("#" + chosenId).css("color", "black");
                }

                else {
                    setTimeout(function () {
                        $("#" + chosenId).css("background-color", "rgba(52, 152, 219, 0.937)");
                        $("#" + chosenId).addClass("selected");
                        $("#" + chosenId).css("color", "white");
                    }, 50);
                }
            });
        },
        error: function (errorMS){
            $("#topicsGridList").html("");
            // Error message
            $("#topicsGridList").append('<p id="noTopics" style="text-align: center; padding-top:10px; color:gray;">No topics to add</p>');
        }
    });
}

function loadProfile(){
    var jsonSend = {
        "action": "loadProfile"
      };

    // Call to server to laod profile
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data : jsonSend,
        ContentType : "application/json",
        dataType: "json",
        success: function(response){
            // Load profile
            currentUserData = response;
            $("#userImage").html("");
            $("#userRating").html("");
        
            var name = response.firstname + " <br> " + response.lastname;
        
            $("#profileName").html(name);
            $("#userImage").append('<img src="' +  "media/" + response.uURL + '" class="media-object">');
            $("#userRating").html(createStarRating(response.uRating));
            $("#username").text(response.username);
            $("#email").text(response.email);
            $("#major").text(response.major);
            $("#gradYear").text(response.gradYear);
        },
        error: function (errorMS){
            // Error message
            alert(errorMS.responseText);
        }
    });

    var jsonSendTopics = {
        "action": "loadTopics"
      };

    // Call to server to laod topics
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data : jsonSendTopics,
        ContentType : "application/json",
        dataType: "json",
        success: function(response){
            // Load profile
            $("#topicsList").html("");

            // Load topics
            for (i = 0; i < (response.length); i++) {
                $("#topicsList").append(helperCreateTopicHTML(response[i].topicName, "media/" + response[i].topicURL, response[i].topicId));
            }
        },
        error: function (errorMS){
            $("#topicsList").html("");
            // Error message
            $("#topicsList").append('<p id="noTopics" style="text-align: center; padding-top:15px; color:gray;">No topics associated with profile yet</p>');
            
        }
    });
}

function helperCreateTopicHTML(topicName, topicURL, topicId){
    var buildHTML = '<li class="list-group-item" id="' + topicId + '"> <div class="media"> <div class="media-left media-middle"> <img src="' + topicURL + '" class="media-object topic" style="width:60px"> </div> <div class="media-body"> <h4 class="media-heading topic">' + topicName + '</h4> </div> </div> </li>';
    return buildHTML;
}

function helperCreateAddTopicHTML(topicName, topicURL, topicId){
    var buildHTML = '<li class="list-group-item" name="addTopicItem" id="' + topicId + '"> <div class="media"> <div class="media-left media-middle"> <img src="' + topicURL + '" class="media-object topic" style="width:60px"> </div> <div class="media-body"> <h4 class="media-heading topic">' + topicName + '</h4> </div> </div> </li>';
    return buildHTML;
}