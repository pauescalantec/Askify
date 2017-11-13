var currentTopic = "";
currentTopicId = "";
var currentUser = "";
var selectedTutor = "";
var currentWidthAnalytics = 0;

$(window).on('resize', function() {
    if($(window).width() < 768){
        $("#analyticsFeed").remove();
        $("#analyticsGrid").html("");
        $("#analyticsGrid").append('<div class="well" id="analyticsFeedAlt" style="width: 100%;"> </div>');
        loadAnalyticsField("#analyticsFeedAlt");
    }

    else {
        $("#analyticsFeedAlt").remove();

        if (!($("#analyticsFeed").length)) {
            // Add analytics feed again
            $("#analyticsGrid").html("");
            $("#analyticsGrid").append('<div class="well" id="analyticsFeed" data-spy="affix" data-offset-top="65"> </div>');
            loadAnalyticsField("#analyticsFeed");
            $("#analyticsFeed").affix({
                offset: {
                    top: 65
                }
            });
        }

        activateAffixListener("#analyticsFeed");
        currentWidthAnalytics = $("#analyticsFeed").width();
    }

});

$(document).ready(function(){
    $(window).resize();

    checkSession();

    // Menu control
    $("#navbarHome li").on("click", function(){
		$(".active").removeClass("active");
        var currentClass = $(this).attr("class");
        var navId = $(this).attr("id");

        // Options is just a dropdown menu
        if (currentClass != "dropdown" && currentClass != "options" && currentClass != "dropdown open" && currentClass != "logout") {
            $(this).addClass("active");

            $(".selectedSection").removeClass("selectedSection").addClass("notSelectedSection");

            $("#" + currentClass + "Section").addClass("selectedSection").removeClass("notSelectedSection").trigger('classChange');
        }
    });

    $("#logoutButton").on("click", function(event){
        var jsonData = {
            "action" : "logOut"
        };
        $.ajax({
            url: "./PHP/AppLayer.php",
            type: "POST",
            data: jsonData,
            dataType: "json",
            success: function(jsonResponse) {
                window.location.replace("inicio.html");
            },
            error: function(errorMessage) {
                alert("Error logging out. Try again later.");
            }
        });
    });

    $('#answersSection').on('classChange', function() {
        $('#answersContent').load('answers.html');
    });

    $('#questionsSection').on('classChange', function() {
        $('#questionsContent').load('questions.html');
    });

    $('#profileSection').on('classChange', function() {
        $('#profileContent').load('profile.html');
    });

    $('#homeSection').on('classChange', function() {
        // Load topics
        loadTopicCards();
        loadRequestCount();
        loadAnalyticsField("#analyticsFeed");
    });

    $("#questionTextArea").hide();
    $("#backToTutors").hide();
    $("#sendQuestionButton").hide();
    $("#chosenTutorButton").show();
    $('#cancelQuestion').prop('disabled', false);
    $('#sendQuestionButton').prop('disabled', false);
    $('#backToTutors').prop('disabled', false);
    $("#sendQuestionButton").text("Send Question");

    $("#chosenTutorButton").on("click", function(){
        chosenTutorButtonClicked();
    });

    $("#backToTutors").on("click", function(){
        backToTutorsButtonClicked();
    });

    $("#sendQuestionButton").on("click", function(){
        sendQuestionButtonClicked();
    });

    $('#chooseTutorModal').on('hidden.bs.modal', function () {
        var selectedTutor = "";
        $('#sendQuestionButton').prop('disabled', false);
        $('#backToTutors').prop('disabled', false);
        $('#cancelQuestion').prop('disabled', false);
        $("#sendQuestionButton").text("Send Question");
        $("#questionText").val("");
        $("#questionTextArea").hide();
        $("#backToTutors").hide();
        $("#sendQuestionButton").hide();
        $("#chooseTutorArea").show();
        $("#chosenTutorButton").show();
    });

    $('#resizer').on( 'change keyup keydown paste cut', 'textarea', function (event){
        $(".alert").alert('close');
        $(this).height(0).height(this.scrollHeight-12);
    }).find( 'textarea' ).change();

    activateAffixListener("#analyticsFeed");

    // Load topics
    loadTopicCards();

    // Load Analytics feed
    loadAnalyticsField("#analyticsFeed");

    // Load request count
    loadRequestCount();
});

function checkSession(){
    var jsonData = {
        "action" : "checkSession"
    };

    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function(jsonResponse) {
            currentUser = jsonResponse.uName;
            // Load topics
            loadUserFullName(currentUser);

        },
        error: function(error) {
            currentUser = "";
            //window.location.replace("inicio.html");
        }
    });
}

function loadRequestCount(){
    $("#requestsCount").text(getRequestNumber() == 0 ? "" : getRequestNumber());
    $("#questionsCount").text(getQuestionsNumber() == 0 ? "" : getQuestionsNumber());
}

function sendQuestionButtonClicked(){
    $(".alert").alert('close');

    if(!$("#questionText").val()){
        setTimeout(function() {
            createDangerAlert("#questionTextArea", "Type your question below", "questionNotTypedAlert");
        }, 300);
    }

    // Question and topic validated
    else {
        var postSuccessful = true;

        if(postSuccessful){
            postQuestionToTutor();
        }

        else {
            setTimeout(function() {
                createDangerAlert("#questionTextArea", "Error connecting to server. Try again later.", "questionNotPostedAlert");
            }, 300);
        }

    }
}

function postQuestionToTutor(){
    var questionTextPost = $("#questionText").val();
    var selectedTutorPost = selectedTutor;
    var selectedTopicPost = currentTopic;
    var selectedTopicIdPost = currentTopicId;

    // After successful posting
    currentTopic = "";
    currentTopicId = "";
    selectedTutor = "";

    // Goodbye modal
    $('#sendQuestionButton').prop('disabled', true);
    $('#backToTutors').prop('disabled', true);
    $('#cancelQuestion').prop('disabled', true);
    $("#sendQuestionButton").text("Sending...");
    $(".alert").alert('close');

    setTimeout(function() {
        $('#chooseTutorModal').modal('toggle');
        $('html, body').stop().animate({
            scrollTop: $("#top").offset().top
        }, 600);
        //$(window).scrollTop(0);

        // Create success alert
        createSuccessAlert("#homeAlertContainer", "You asked a question about <strong>" +  selectedTopicPost + "</strong> to <strong>" + getFullNameFromUsername(selectedTutorPost) + "</strong>", "questionPostedAlert");
    }, 1300);

}

function backToTutorsButtonClicked(){
    var selectedTutor = "";
    $('#cancelQuestion').prop('disabled', false);
    $('#sendQuestionButton').prop('disabled', false);
    $('#backToTutors').prop('disabled', false);
    $("#sendQuestionButton").text("Send Question");
    $("#questionTextArea").hide();
    $("#backToTutors").hide();
    $("#sendQuestionButton").hide();
    $("#chooseTutorArea").show();
    $("#chosenTutorButton").show();
}

function chosenTutorButtonClicked(){
    $(".alert").alert('close');

    if (selectedTutor == "") {
        setTimeout(function() {
            createDangerAlert("#chooseTutorGrid", "Choose tutor first", "tutorNotSelectedAlert");
            $('#chooseTutorGrid').scrollTop(0);
        }, 300);
    }

    // Tutor is chosen show next modal
    else {
        setTimeout(function() {

            //ajaxCall to get username full name
            var jsonSend = {
                "username" : selectedTutor,
                "action": "getFullNameFromUsername"
            };
            
            $.ajax({
                url: "./PHP/AppLayer.php",
                type: "POST",
                data : jsonSend,
                ContentType : "application/json",
                dataType: "json",
                success: function(response){
                    // Fade out from tutor list
                    $("#chooseTutorArea").fadeOut( 30, function() {
                        $("#chosenTutorButton").fadeOut( 5, function() {
                            $("#sendQuestionButton").hide().fadeIn(100);
                        });
        
                        $("#modalInstruction").html(currentUser + " asks " + response.fullName + " about <strong>" + currentTopic + " </strong><hr />");
                        $("#questionTextArea").hide().fadeIn(120);
                        $("#backToTutors").hide().fadeIn(100);
                        $(this).hide();
                    });
                },
                error: function (errorMS){
                    // Error message
                    alert(errorMS.responseText);
                }
            });


        }, 100);
    }
}

function createDangerAlert(selectorId, alertMessage, alertId){
    $(selectorId).prepend('<div class="alert alert-danger alert-dismissable fade in" id=" ' + alertId + '"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + alertMessage +'</div>');
}

function createSuccessAlert(selectorId, alertMessage, alertId){
    $(selectorId).prepend('<div class="alert alert-success alert-dismissable fade in" id=" ' + alertId + '"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + alertMessage +'</div>');
}

function loadAnalyticsField(analyticsSelector){
    
    var visitedHTML = helperCreateAnalytics("visitedPanelHeading", "Most Visited Topic", getVisitedTopic());

    var favoriteHTML = helperCreateAnalytics("favoritePanelHeading", "Your Favorite Topic", getFavoriteTopic());

    var highestHTML = helperCreateAnalytics("highestPanelHeading", "Highest Ranked Tutor", getHighestTutor());

    $(analyticsSelector).html("");
    $(analyticsSelector).append(visitedHTML).hide().fadeIn(300);
    $(analyticsSelector).append(favoriteHTML).hide().fadeIn(300);
    $(analyticsSelector).append(highestHTML).hide().fadeIn(300);
}

function activateAffixListener(selectorId){
    $(selectorId).on('affix.bs.affix', function () {
        var $affixElement = $('div[data-spy="affix"]');
        if(currentWidthAnalytics == 0) {
            currentWidthAnalytics = $("#analyticsFeed").width();
        }
        $affixElement.width(currentWidthAnalytics);
   });
}

function loadUserFullName(currentUser){
    // Add to profile section
    $("#navbarItemDropdown").html('<span id="navbarItemProfile" class="glyphicon glyphicon-user"></span> ' + currentUser);
}

function getFavoriteTopic(){
    return "C++";
}

function getHighestTutor(){
    return "Cristina Jimenez";
}

function getFullNameFromUsername(username){
    var userFullName = {
        "paupau" : "Paulina Escalante",
        "patpat" : "Patricio Sanchez",
        "juajua" : "Juan Medellin",
        "javjav" : "Javier Guajardo",
        "monmon" : "Monica Perez"
    };

    return userFullName[username];
}

function getVisitedTopic(){
    return "Python";
}

function getRequestNumber(){
    return 3;
}

function getQuestionsNumber(){
    return 2;
}

function loadTopicCards(){
    // Ajax laod topic cards
    var jsonSend = {"action": "loadTopicIndex"};

    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data : jsonSend,
        ContentType : "application/json",
        dataType: "json",
        success: function(response){
            listTopics = response;

            for (i = 0; i < (listTopics.length); i++) {
                // Instead of 0 iterate through index
                var topicCardHTML = helperCreateCardHTML(listTopics[i]);
                var topicCounterId = "#topic" + (i+1);

                $(topicCounterId).html("");
                $(topicCounterId).prepend(topicCardHTML).hide().fadeIn((i+1)*400);
            }

            $("[name='askQuestionButton']").on("click", function() {
                $(".alert").alert('close');
                var identifierTopicName = $(this).attr("id");
                currentTopic = $("#" + identifierTopicName + "TopicName").text();
                currentTopicId = identifierTopicName;
                triggerAskQuestionModal(currentTopic, currentTopicId);
            });
        },
        error: function (errorMS){
            // Error message
            alert(errorMS.responseText);
        }
    });
}

function createStarRating(userRating){
    var star1 = (userRating >= 1 ? " checked": "");
    var star2 = (userRating >= 2 ? " checked": "");
    var star3 = (userRating >= 3 ? " checked": "");
    var star4 = (userRating >= 4 ? " checked": "");
    var star5 = (userRating >= 5 ? " checked": "");

    var buildStarHTML = '<span class="fa fa-star' + star1 + '"></span> <span class="fa fa-star' + star2 + '"></span> <span class="fa fa-star' + star3 + '"></span> <span class="fa fa-star' + star4 + '"></span> <span class="fa fa-star' + star5 + '"></span>';
    return buildStarHTML;
}

function triggerAskQuestionModal(currentTopic, currentTopicId){
    // Create title instruction
    $("#chooseModalTitle").html("");
    $("#chooseModalTitle").prepend("<p class='introQuestion' id='modalInstruction'>Choose a tutor to ask about <strong>" + currentTopic + " </strong></p>");
    $("#questionText").val("");
    $("#questionText").height('auto');
    selectedTutor = "";

    createTutorList();
}

function createTutorList(){
    // Ajax call to load tutors by topic
    var jsonSendTopicsList = {
        "currentTopic" : currentTopicId,
        "action": "loadTutorByTopic"
    };
    
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data : jsonSendTopicsList,
        ContentType : "application/json",
        dataType: "json",
        success: function(response){
            $('#chooseTutorGrid').html("");
            var listTutors = response;

            // Create tutor list by topic
            var numberTutors = listTutors.length;
            var tutorCounter = 0;

            // 3 tutors per line
            var numberRowsTutors = Math.ceil(numberTutors/3);
            var lastRowNumberTutors = numberTutors%3;

            // Fill in all rows except last one
            for (i = 0; i < (numberRowsTutors-1); i++) {
                var rowId = "tutorRow" + i;
                var rowHTML = createTutorRow(rowId);

                // Append row to container
                $('#chooseTutorGrid').html("");
                $("#chooseTutorGrid").append(rowHTML);

                // Create columns - should be 3
                var rowCol1Id = rowId + "tutorCol1";
                var rowCol2Id = rowId + "tutorCol2";
                var rowCol3Id = rowId + "tutorCol3";

                var columnsJson = {
                    column1HTML: '<div class="col-sm-4" id="' + rowCol1Id + '"></div>',
                    column2HTML: '<div class="col-sm-4" id="' + rowCol2Id + '"></div>',
                    column3HTML: '<div class="col-sm-4" id="' + rowCol3Id + '"></div>'
                };

                // Append columns to row
                $("#" + rowId).append(columnsJson.column1HTML);
                $("#" + rowId).append(columnsJson.column2HTML);
                $("#" + rowId).append(columnsJson.column3HTML);

                // Fill columns with information for tutors
                $("#" + rowCol1Id).html(helperCreateTutorCardHTML(listTutors[tutorCounter]));
                tutorCounter++;
                $("#" + rowCol2Id).html(helperCreateTutorCardHTML(listTutors[tutorCounter]));
                tutorCounter++;
                $("#" + rowCol3Id).html(helperCreateTutorCardHTML(listTutors[tutorCounter]));
                tutorCounter++;
            }

            setTimeout(function () {
                $('#chooseTutorGrid').scrollTop(0);
            }, 200);

            // FIll in last row
            if((lastRowNumberTutors != 0) || (numberTutors == 3)) {
                var lastRowId = "tutorRow" + (numberRowsTutors+1);
                var lastRowHTML = createTutorRow(lastRowId);

                // Append row to container
                $("#chooseTutorGrid").append(lastRowHTML);

                for (i = 1; i <= (lastRowNumberTutors == 0 ? numberTutors : lastRowNumberTutors); i++) {
                    var rowColId = lastRowId + "tutorCol" + i;
                    var columnHTML = '<div class="col-sm-4" id="' + rowColId + '" name="tutorColumn"></div>';

                    // Append columns to row
                    $("#" + lastRowId).append(columnHTML);
                    $("#" + rowColId).html(helperCreateTutorCardHTML(listTutors[tutorCounter]));
                    tutorCounter++;
                }
            }

            $("[name='tutorCard']").on("click", function() {
                $(".alert").alert('close');
                var identifierUsername = $(this).attr("id");

                // Another tutor was selected
                if (selectedTutor != ""){
                    //Remove previous tutor selection
                    $("#" + selectedTutor).removeClass("selected");
                    $("#" + selectedTutor).addClass("unselected");
                    $("#" + selectedTutor).css("background-color", "transparent");
                }

                if (selectedTutor == identifierUsername){
                    $("#" + identifierUsername).css("background-color", "transparent");
                    $("#" + selectedTutor).css("color", "black");
                    $("#" + identifierUsername).removeClass("selected");
                    $("#" + identifierUsername).addClass("unselected");
                    selectedTutor = "";
                }

                else {
                    setTimeout(function () {
                        $("#" + identifierUsername).css("background-color", "rgba(52, 152, 219, 0.937)");
                        // new tutor
                        $("#" + identifierUsername).removeClass("unselected");
                        $("#" + identifierUsername).addClass("selected");
                        selectedTutor = identifierUsername;
                    }, 50);
                }
            });
        },
        error: function (errorMS){
            if (errorMS.status == "406"){
                // No comments available, populate accordingly
                $("#commentSection").html("");  
                $('#commentSection').append('<p id="noComments" style="text-align: center; padding-top:20px; color:gray;">No comments added yet...</p>');    
            }

            else {
                // No tutors found
                alert(errorMS.responseText);
            }
        }
    });
}

function helperCreateTutorCardHTML(tutorDataJson){
    var tutorCardHTML = '<div class="card" name="tutorCard" id="' + tutorDataJson.username + '"> <div class="card-body"> <img class="card-img-top" name="tutorImage" src="' + 'media/' + tutorDataJson.uURL + '" alt=""> <h5 class="card-title" name="tutorNameHeading"> '+ tutorDataJson.firstName + " " + tutorDataJson.lastName + '</h5> <p name="starRating">' + createStarRating(tutorDataJson.uRating) + '</p>  <p name="numberRating">(' + tutorDataJson.uRating + '/5.0)</p><p class="card-text" name="tutorCardDescription">' + tutorDataJson.major  + '</p></div></div>';
    return tutorCardHTML;
}

function createTutorRow(rowId){
    var buildRowHTML = '<div class="row equal" id="' + rowId + '" name="tutorRow">';
    return buildRowHTML;
}

function helperCreateCardHTML(topicData){
    var buildHTML = '<div class="well"> <div class="card"> <div class="card-body"> <img class="card-img-top" src="' + "media/" + topicData.topicImage + '" alt=""> <h4 class="card-title" id="'+ topicData.topicId +'TopicName">' + topicData.topicName + '</h4> <p class="card-text">' + topicData.topicDescription + '</p> <button id="' + topicData.topicId + '" class="flat-butt flat-info-butt flat-inner-butt flat-info-inner-butt" data-toggle="modal" name="askQuestionButton" data-target="#chooseTutorModal">Ask Question</button> </div> </div> </div>';
    return buildHTML;
}

function helperCreateAnalytics(idField, titleField, dataField){
    var analyticsHTML = '<div id="' + idField + '" class="well" name="analyticsWells"> <h4>' + titleField + '</h4><p class="analyticsDataField">' + dataField + '</p> </div>';
    return analyticsHTML;
}
