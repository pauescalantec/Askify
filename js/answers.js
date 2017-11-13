var currentQuestionToAnswer = "";
var currentUserToAnswer = "";
var currentTopicToAnswer = "";
var currentAnswerToModify = "";
var currentUserToModifyAnswerTo = "";
var currentTopicToModifyAnswerTo = "";

var requestsResults = [];
var previousResults = [];

$(document).ready(function(){
    // Load topics
    setTimeout(function() {
        loadAnswerRequests();
    }, 100);

    $('#resizerAnswer').on( 'change keyup keydown paste cut', 'textarea', function (event){
        $(".alert").alert('close');
        $(this).height(0).height(this.scrollHeight-12);
    }).find( 'textarea' ).change();

    $('#resizerModifyAnswer').on( 'change keyup keydown paste cut', 'textarea', function (event){
        $(".alert").alert('close');
        $(this).height(0).height(this.scrollHeight-12);
    }).find( 'textarea' ).change();

    $("#sendAnswerButton").on("click", function(){
        sendAnswerButtonClicked();
    });

    $("#saveModifyAnswerButton").on("click", function(){
        saveModifyAnswerButtonClicked();
    });
});

function saveModifyAnswerButtonClicked() {
    $(".alert").alert('close');

    if(!$("#modifyAnswerText").val()){
        setTimeout(function() {
            createDangerAlert("#modifyAnswerTextArea", "Answer can not be empty", "answerEmptyAlert");
        }, 300);
    }

    else if ($("#modifyAnswerText").val() == getAnswerFromId(currentAnswerToModify)){
        setTimeout(function() {
            createDangerAlert("#modifyAnswerTextArea", "No changes made to answer", "answerNotModifiedAlert");
        }, 300);
    }

    else {

        // Ajax to update

        var jsonSend = {
            "questionId" : currentAnswerToModify,
            "answerText" : $("#modifyAnswerText").val(),
            "action": "updateAnswer"
        };
        
        $.ajax({
            url: "./PHP/AppLayer.php",
            type: "POST",
            data : jsonSend,
            ContentType : "application/json",
            dataType: "json",
            success: function(response){
                postModifiedAnswer();
            },
            error: function (errorMS){
                // Error message
                setTimeout(function() {
                    createDangerAlert("#modifyAnswerTextArea", "Error connecting to server. Try again later.", "answerNotPostModifiedAlert");
                }, 300);
            }
        });
    }
}

function sendAnswerButtonClicked() {
    $(".alert").alert('close');

    if(!$("#answerText").val()){
        setTimeout(function() {
            createDangerAlert("#answerTextArea", "Type your answer below", "answerNotTypedAlert");
        }, 300);
    }

    else {
        // ajax call to send answer
        var jsonSend = {
            "questionId" : currentQuestionToAnswer,
            "answerText" : $("#answerText").val(),
            "action": "sendAnswer"
        };
        
        $.ajax({
            url: "./PHP/AppLayer.php",
            type: "POST",
            data : jsonSend,
            ContentType : "application/json",
            dataType: "json",
            success: function(response){
                postAnswer();
            },
            error: function (errorMS){
                // Error message
                setTimeout(function() {
                    createDangerAlert("#answerTextArea", "Error connecting to server. Try again later.", "answerNotPostedAlert");
                }, 300);
            }
        });
    }
}

function postAnswer(){
    var helperTopic = currentTopicToAnswer;
    var answerTextPost = $("#answerText").val();

    $('#cancelAnswer').prop('disabled', true);
    $('#sendAnswerButton').prop('disabled', true);
    $("#sendAnswerButton").text("Sending...");
    $(".alert").alert('close');

    currentTopicToAnswer = "";

    setTimeout(function() {
        $('#answerQuestionModal').modal('toggle');
        $('html, body').stop().animate({
            scrollTop: $("#top").offset().top
        }, 600);

        // Create success alert
        createSuccessAlert("#answerAlertContainer", "You answered a question about <strong>" + helperTopic + "</strong> to <strong>" + currentUserToAnswer + "</strong>", "answerPostedAlert");

        // Reload
        loadAnswerRequests();
    }, 1300);
}

function postModifiedAnswer(){
    var helperTopic = currentTopicToModifyAnswerTo;
    var answerTextPost = $("#modifyAnswerText").val();

    $('#cancelModifyAnswer').prop('disabled', true);
    $('#saveModifyAnswerButton').prop('disabled', true);
    $("#saveModifyAnswerButton").text("Saving...");
    $(".alert").alert('close');

    currentTopicToModifyAnswerTo = "";

    setTimeout(function() {
        $('#modifyAnswerModal').modal('toggle');
        $('html, body').stop().animate({
            scrollTop: $("#top").offset().top
        }, 600);

        // Create success alert
        createSuccessAlert("#answerAlertContainer", "You modified your answer made to <strong>" + currentUserToModifyAnswerTo + "</strong> about <strong>" + helperTopic + "</strong>", "answerModifiedAlert");

        // Reload
        loadPreviousAnswers();
    }, 1300);
}


function loadAnswerRequests(){
    $("#answerRequestsSidebarButton").on("click", function(){
        $(".alert").alert('close');
        loadAnswerRequests();
    });

    $("#previousAnswersSidebarButton").on("click", function(){
        $(".alert").alert('close');
        loadPreviousAnswers();
    });
    var jsonLoadAnswRequests = {
        "action" : "loadAnswerRequest"
    };
    // Load request count
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data: jsonLoadAnswRequests,
        dataType: "json",
        success: function(jsonResponse){
            requestsResults = jsonResponse;
            var listRequests = jsonResponse;
            var numberRequests = listRequests.length;

            $("#answersList").html("");
            $("#answersList").append('<li class="list-group-item" id="answerRequestsHeader">Answer requests for you</li>');

            // Fill in all rows except last one
            for (i = 0; i < numberRequests; i++) {
                var requestHTML = helperCreateListElementRequest(listRequests[i]);
                $("#answersList").append(requestHTML);
            }

            $("[name=answerQuestionRequestButton").on("click", function(){
                triggerAnswerQuestionModal(this.id);

            });

        },
        error: function(error) {
            if(error.status == "406"){
                $("#answersList").html("");
                $("#answersList").append('<p id="noTopics" style="text-align: center; padding-top:10px; color:gray;">No questions to view</p>');
            }
        }
    });
}

function triggerModifyAnswerModal(questionId){
    $(".alert").alert('close');
    $("#modifyAnswerModalTitle").html("");
    $("#modifyAnswerModalTitle").prepend("<p class='answerTopic'>Answer sent to " + getUserFromId(questionId) + " about " + getTopicFromId(questionId) + "</p><hr /> <p class='introAnswer'>" + getQuestionFromId(questionId) + "</p>");
    $("#modifyAnswerText").val("");
    $("#modifyAnswerText").height('auto');
    $('#cancelModifyAnswer').prop('disabled', false);
    $('#saveModifyAnswerButton').prop('disabled', false);
    $("#saveModifyAnswerButton").text("Save Changes");

    setTimeout(function() {
        $("#modifyAnswerText").val(getAnswerFromId(questionId));
        $('#modifyAnswerText').keyup();
    }, 200);

    currentAnswerToModify = questionId;
    currentUserToModifyAnswerTo = getUserFromId(questionId);
    currentTopicToModifyAnswerTo = getTopicFromId(questionId) ;
}

function triggerAnswerQuestionModal(questionId){
    $(".alert").alert('close');
    $("#answerModalTitle").html("");
    $("#answerModalTitle").prepend("<p class='answerTopic'>Respond to " + getUserFromId(questionId) + " about " + getTopicFromId(questionId) + "</p><hr /> <p class='introAnswer' id='modalInstruction'>" + getQuestionFromId(questionId) + "</p>");
    $("#answerText").val("");
    $("#answerText").height('auto');
    $('#cancelAnswer').prop('disabled', false);
    $('#sendAnswerButton').prop('disabled', false);
    $("#sendAnswerButton").text("Send Answer");

    currentQuestionToAnswer = questionId;
    currentUserToAnswer = getUserFromId(questionId);
    currentTopicToAnswer = getTopicFromId(questionId) ;
}

function loadPreviousAnswers(){

    var jsonLoadPreviousAnswers = {"action" : "loadPreviousAnswers"};

    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data: jsonLoadPreviousAnswers,
        dataType: "json",
        success: function(jsonResponse){
            var listRequests = jsonResponse;
            previousResults = jsonResponse;
            var numberRequests = listRequests.length;

            $("#answersList").html("");
            $("#answersList").append('<li class="list-group-item" id="answerRequestsHeader">Answered by you</li>');

            // Fill in all rows except last one
            for (i = 0; i < numberRequests; i++) {
                var requestHTML = helperCreateListElementPrevious(listRequests[i]);
                $("#answersList").append(requestHTML);
            }

            $("span[name=previousAnswerLink]").on("click", function(){
                triggerModifyAnswerModal(this.id);
            });

            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function(error) {
            if(error.status == "406"){
                $("#answersList").html("");
                $("#answersList").append('<p id="noTopics" style="text-align: center; padding-top:10px; color:gray;">No questions to view</p>');
            }
        }
    });
}

function getQuestionFromId(questionId){
    // Look in unanswered questions
    for (i = 0; i < previousResults.length; i++) {
        if (previousResults[i].questionId == questionId){
            return previousResults[i].question;
        }
    }

    //Look in answered questions
    for (i = 0; i < requestsResults.length; i++) {
        if (requestsResults[i].questionId == questionId){
            return requestsResults[i].question;
        }
    }

    return "";
}

function getTopicFromId(questionId){
    // Look in unanswered questions
    for (i = 0; i < previousResults.length; i++) {
        if (previousResults[i].questionId == questionId){
            return previousResults[i].topic;
        }
    }

    //Look in answered questions
    for (i = 0; i < requestsResults.length; i++) {
        if (requestsResults[i].questionId == questionId){
            return requestsResults[i].topic;
        }
    }

    return "";
}

function getUserFromId(questionId){
    // Look in unanswered questions
    for (i = 0; i < previousResults.length; i++) {
        if (previousResults[i].questionId == questionId){
            return (previousResults[i].firstName + " " + previousResults[i].lastName);
        }
    }

    //Look in answered questions
    for (i = 0; i < requestsResults.length; i++) {
        if (requestsResults[i].questionId == questionId){
            return (requestsResults[i].firstName + " " + requestsResults[i].lastName);
        }
    }

    return "";
}

function getAnswerFromId(questionId){
    // Look in unanswered questions
    for (i = 0; i < previousResults.length; i++) {
        if (previousResults[i].questionId == questionId){
            return previousResults[i].answer;
        }
    }

    //Look in answered questions
    for (i = 0; i < requestsResults.length; i++) {
        if (requestsResults[i].questionId == questionId){
            return requestsResults[i].answer;
        }
    }

    return "";
}

function getPreviousAnswers(){
    return [{
        firstName: "Juan",
        lastName:"Medellin",
        username: "juajua",
        questionId: "4questionJuanPaulina",
        question: "What do I have to do to compile a .cpp file in terminal in Linux?",
        answer:"You can use: gcc -o outputName fileName.cpp",
        topic: "C++"},
    {
        firstName: "Monica",
        lastName:"Perez",
        username: "monmon",
        questionId: "5questioMonicaPaulina",
        question: "What is the best functionality for scrollers, top to bottom or bottom to top?",
        answer:"The best to to is top to bottom",
        topic: "UX/UI"}
    ];
}

function helperCreateListElementRequest(answerRequest){
    var buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">Question by ' + answerRequest.firstName + " " + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion">' + answerRequest.question + '</h4> <button name="answerQuestionRequestButton" class="flat-butt flat-info-butt flat-inner-butt flat-info-inner-butt" id="' + answerRequest.questionId + '" data-toggle="modal" data-target="#answerQuestionModal" href="">Answer</button></li>';
    return buildHTML;
}

function helperCreateListElementPrevious(answerRequest){
    var buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">Question by ' + answerRequest.firstName + " " + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p><a class="answersLink"> <h4 name="answerRequestQuestion">' + answerRequest.question + '</h4></a>';
    buildHTML = buildHTML + '<div class="well previousAnswer">' +
                            '<p class="showAnswer">' + answerRequest.answer +
                            '<span class="label label-success edit" name="previousAnswerLink" id="' + answerRequest.questionId + '"data-toggle="modal" data-target="#modifyAnswerModal">Edit</span>' +
                            '</p>' +
                            '</div>';
    return buildHTML;
}
