var currentUserId = "pecster";
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
        $(".alert").alert('close');
        var topicsSelected = [];

        var listItems = $("#topicsGridList li");
        listItems.each(function(idx, li) {
            var item = $(li);
            if(item.hasClass("selected")) {
                topicsSelected.push(item.attr("id"));
            }
        });

        if(topicsSelected.length > 0){
            var successful = true;

            for (i = 0; i < (topicsSelected.length); i++) {
                // add topics to user topicsSelected[i]
            }

            if(successful) {
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
            }

            else {
                setTimeout(function() {
                    createDangerAlert("#chooseTopicGrid",  "Error connecting to server. Try again later.", "serverErrorAlert");
                    $('#chooseTopicGrid').scrollTop(0);
                }, 300);  
            }
        }

        else {
            setTimeout(function() {
                createDangerAlert("#chooseTopicGrid", "Choose topics to add", "topicsNotChoseAlert");
                $('#chooseTopicGrid').scrollTop(0);
            }, 300);  
        }
    });

});

function addTopicsClicked(){
    loadRestOfTopics();

    setTimeout(function() {
        $('#addTopicModal').modal('toggle');
    }, 100);  
}

function loadRestOfTopics(){
    $(".alert").alert('close');
    $('#sendTopicsButton').prop('disabled', false);
    $("#sendTopicsButton").text("Add Topics");
    $("#topicsGridList").html("");

    var topics = getTopicCards();

    for (i = 0; i < (topics.length); i++) {
        $("#topicsGridList").append(helperCreateAddTopicHTML(topics[i].topicName, topics[i].topicImage, topics[i].topicId));
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
}

function loadProfile(){
    var jsonSend = {
        "username" : currentUserId,
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
        
            var name = response.firstname + " <br> " + response.lastname;
        
            $("#profileName").html(name);
            $("#userImage").append('<img src="media/userImage.jpg" class="media-object">');
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
        "username" : currentUserId,
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
            // Error message
            alert(errorMS.responseText);
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

function getTopicCards(){
    return [{
                topicName: "Python",
                topicId:"python6",
                topicImage:"Media/cardImage6.jpg"},
            {
                topicName: "Web Development",
                topicId:"web2",
                topicImage:"Media/cardImage2.jpg"},
            {
                topicName: "C#",
                topicId:"csharp3",
                topicImage:"Media/cardImage3.jpg"},
            {
                topicName: "PHP",
                topicId:"php4",
                topicImage:"Media/cardImage7.jpg"},
            {
                topicName: "C++",
                topicId:"cpp4",
                topicImage:"Media/cardImage4.jpg"},
            {
                topicName: "Java",
                topicId:"java5",
                topicImage:"Media/cardImage5.jpg"},
            {
                topicName: "UX/UI",
                topicId:"ux1",
                topicImage:"Media/cardImage1.jpg"},
            {
                topicName: "SQL",
                topicId:"sql8",
                topicImage:"Media/cardImage8.jpg"},
            {
                topicName: "React",
                topicId:"react9",
                topicImage:"Media/cardImage9.jpg"}
          ];
}
