var currentQuestionToModify = "";
var currentUserToModifyQuestionTo = "";
var currentTopicToModifyQuestionTo = "";
var currentAnswerToView = "";
var currentAnswerRating = 0;
var ratingInstance;

var unansweredResults = [];
var answeredResults = [];

$(document).ready(function(){
    // Load topics
    setTimeout(function() {
        loadAnsweredQuestions();
    }, 100);

    $('#resizerModifyQuestion').on( 'change keyup keydown paste cut', 'textarea', function (event){
        $(".alert").alert('close');
        $(this).height(0).height(this.scrollHeight-12);
    }).find( 'textarea' ).change();

    $("#saveModifyQuestionButton").on("click", function(){
        saveModifyQuestionButtonClicked();
    });

    $('#viewNewAnswerModal').on('hide.bs.modal', function (event) {
        $(".alert").alert('close');

        var canClose = (currentAnswerRating > 0 ? true: false);

        if(!canClose){
            setTimeout(function() {
                createDangerAlert("#viewNewAnswerTextArea", "Rate answer to continue", "answerNotRatedAlert");
            }, 300);
            return false;
        }

        else {
            // Update status of answer
            //ajax to update ranking
            var jsonSend = {
                "questionId" : currentAnswerToView,
                "rating" : currentAnswerRating,
                "action": "updateRanking"
            };
            
            $.ajax({
                url: "./PHP/AppLayer.php",
                type: "POST",
                data : jsonSend,
                ContentType : "application/json",
                dataType: "json",
                success: function(response){
                    setTimeout(function() {
                        $(".container-rating").html("");
                        currentAnswerRating = 0;
                        loadAnsweredQuestions();
                        return true;
                    }, 500);
                },
                error: function (errorMS){
                    // Error message
                }
            });
        }
    });

    $("#doneViewNewButton").on("click", function(){
        $(".alert").alert('close');

        var canClose = (currentAnswerRating > 0 ? true: false );

        if(!canClose){
            setTimeout(function() {
                createDangerAlert("#viewNewAnswerTextArea", "Rate answer to continue", "answerNotRatedAlert");
            }, 300);
        }

        else {
            setTimeout(function() {
                $('#viewNewAnswerModal').modal('toggle');
            }, 500);
        }
    });
});

function saveModifyQuestionButtonClicked() {
    $(".alert").alert('close');

    if(!$("#modifyQuestionText").val()){
        setTimeout(function() {
            createDangerAlert("#modifyQuestionTextArea", "Question can not be empty", "questionEmptyAlert");
        }, 300);
    }

    else if ($("#modifyQuestionText").val() == getQQuestionFromId(currentQuestionToModify)){
        setTimeout(function() {
            createDangerAlert("#modifyQuestionTextArea", "No changes made to question", "questionNotModifiedAlert");
        }, 300);
    }

    else {
        // Ajax call to edit question
        var jsonSend = {
            "questionId" : currentQuestionToModify,
            "questionText" : $("#modifyQuestionText").val(),
            "action": "modifyQuestion"
        };
        
        $.ajax({
            url: "./PHP/AppLayer.php",
            type: "POST",
            data : jsonSend,
            ContentType : "application/json",
            dataType: "json",
            success: function(response){
                postModifiedQuestion();
            },
            error: function (errorMS){
                // Error message
                setTimeout(function() {
                    createDangerAlert("#modifyQuestionTextArea", "Error connecting to server. Try again later.", "questionNotPostModifiedAlert");
                }, 300);
            }
        });
    }
}

function postModifiedQuestion(){
    var helperTopic = currentTopicToModifyQuestionTo;
    var questionTextPost = $("#modifyQuestionText").val();

    $('#cancelModifyQuestion').prop('disabled', true);
    $('#saveModifyQuestionButton').prop('disabled', true);
    $("#saveModifyQuestionButton").text("Saving...");
    $(".alert").alert('close');

    currentTopicToModifyQuestionTo = "";

    setTimeout(function() {
        $('#modifyQuestionModal').modal('toggle');
        $('html, body').stop().animate({
            scrollTop: $("#top").offset().top
        }, 600);

        // Create success alert
        createSuccessAlert("#questionAlertContainer", "You modified your question made to <strong>" + currentUserToModifyQuestionTo + "</strong> about <strong>" + helperTopic + "</strong>", "questionModifiedAlert");

        // Reload
        loadUnansweredQuestions();
    }, 1300);
}

function loadSidebarQuestionsCount(){
    $("#questionsCountSidebar").text(getQuestionsNumber() == 0 ? "" : getQuestionsNumber());
}

function loadAnsweredQuestions(){
    $("#newQuestionsSidebarButton").on("click", function(){
        $(".alert").alert('close');
        loadAnsweredQuestions();
    });

    $("#unansweredQuestionsSidebarButton").on("click", function(){
        $(".alert").alert('close');
        loadUnansweredQuestions();
    });

    loadSidebarQuestionsCount();

    var jsonSend = {
        "action": "loadAnsweredQuestions"
    };

    //Ajax to load answered
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data : jsonSend,
        ContentType : "application/json",
        dataType: "json",
        success: function(response){        
            var listQuestions = response;
            answeredResults = response;
            var numberRequests = listQuestions.length;

            $("#questionsList").html("");
            $("#questionsList").append('<li class="list-group-item" id="answerRequestsHeader">Questions made by you with answers <span class="label label-warning edit" id="manageAnsweredQuestions">Manage</span></li>');

            // Fill in all rows except last one
            for (i = 0; i < numberRequests; i++) {
                var requestHTML = helperCreateListElementRequest(listQuestions[i]);
                $("#questionsList").append(requestHTML);
            }

            $("#manageAnsweredQuestions").on("click", function(){
                if ($("#manageAnsweredQuestions").text() == "Manage") {
                    $(".close.answered").show();
                    $("#manageAnsweredQuestions").text("Done");
                }

                else {
                    $(".close.answered").hide();
                    $("#manageAnsweredQuestions").text("Manage");
                }
            });

            $(".close.answered").on("click", function(){
                var listId = $(this).parent().find("a[name=answerListItem]").attr('id');

                //Delete query here
                // Ajax call to edit question
                var jsonSend = {
                    "questionId" : listId,
                    "action": "deleteQuestion"
                };
                
                $.ajax({
                    url: "./PHP/AppLayer.php",
                    type: "POST",
                    data : jsonSend,
                    ContentType : "application/json",
                    dataType: "json",
                    success: function(response){
                        loadAnsweredQuestions();
                    },
                    error: function (errorMS){
                        // Error message
                    }
                });
            });

            $(".answeredQuestionLink").on("click", function(){
                triggerViewAnswerModal(this.id);
            });

            $(".newAnsweredQuestionLink").on("click", function(){
                triggerViewNewAnswerModal(this.id);
            });
        },
        error: function (errorMS){
            // Error message
            if(errorMS.status == "406"){
                $("#questionsList").html("");
                $("#questionsList").append('<p id="noTopics" style="text-align: center; padding-top:10px; color:gray;">No questions to view</p>');
            }
        }
    });
}

function loadUnansweredQuestions(){
    // Ajax call to get unanswered questions
    var jsonSend = {
        "action": "loadUnansweredQuestions"
    };
    
    $.ajax({
        url: "./PHP/AppLayer.php",
        type: "POST",
        data : jsonSend,
        ContentType : "application/json",
        dataType: "json",
        success: function(response){
            var listUnansweredQuestions = response;
            unansweredResults = response;

            var numberRequests = listUnansweredQuestions.length;
            
            $("#questionsList").html("");
            $("#questionsList").append('<li class="list-group-item" id="answerRequestsHeader">Questions made by you not yet answered <span class="label label-warning edit" id="manageUnansweredQuestions">Manage</span></li>');
        
            // Fill in all rows except last one
            for (i = 0; i < numberRequests; i++) {
                var requestHTML = helperCreateListElementRequest(listUnansweredQuestions[i]);
                $("#questionsList").append(requestHTML);
            }
        
            $("span[name=unansweredQuestionLink]").on("click", function(){
                triggerModifyQuestionModal(this.id);
            });
        
            $(".close.unanswered").on("click", function(){
                var listId = $(this).parent().find("span[name=unansweredQuestionLink]").attr('id');
        
                var jsonSend = {
                    "questionId" : listId,
                    "action": "deleteQuestion"
                };
  
                $.ajax({
                    url: "./PHP/AppLayer.php",
                    type: "POST",
                    data : jsonSend,
                    ContentType : "application/json",
                    dataType: "json",
                    success: function(response){
                        //Delete query here
                        loadUnansweredQuestions();
                    },
                    error: function (errorMS){
                        // Error message
                    }
                });

            });
        
            $("#manageUnansweredQuestions").on("click", function(){
                if ($("#manageUnansweredQuestions").text() == "Manage") {
                    $(".close.unanswered").show();
                    $("#manageUnansweredQuestions").text("Done");
                }
        
                else {
                    $(".close.unanswered").hide();
                    $("#manageUnansweredQuestions").text("Manage");
                }
            });
        
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: function (errorMS){
            if(errorMS.status == "406"){
                $("#questionsList").html("");
                $("#questionsList").append('<p id="noTopics" style="text-align: center; padding-top:10px; color:gray;">No questions to view</p>');
            }
        }
    });
}

function triggerViewAnswerModal(questionId){
    $(".alert").alert('close');
    $("#viewAnswerModalTitle").html("");
    $("#viewAnswerModalTitle").prepend('<p name="answerRequestUserHeader">Question made to ' + getQUserFromId(questionId) + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + getQTopicFromId(questionId) + '</p>');

    setTimeout(function() {
        $("#viewAnswerTextArea").html("");
        $("#viewAnswerTextArea").append('<h4 name="answerRequestQuestion">' + getQQuestionFromId(questionId) + '</h4>');
        $("#viewAnswerTextArea").append('<div class="well answerModal">' + getQAnswerFromId(questionId) + '</div>');
    }, 200);

    currentAnswerToView = questionId;
}

function triggerViewNewAnswerModal(questionId){
    $(".container-rating").append('<span class="rating golden" id="starsRating"></span>');
    $(".alert").alert('close');
    $("#viewNewAnswerModalTitle").html("");
    $("#viewNewAnswerModalTitle").prepend('<p name="answerRequestUserHeader">Question made to ' + getQUserFromId(questionId) + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + getQTopicFromId(questionId) + '</p>');

    setTimeout(function() {
        var ratings = document.getElementsByClassName('rating');

        for (var i = 0; i < ratings.length; i++) {
            var r = new SimpleStarRating(ratings[i]);

            ratings[i].addEventListener('rate', function(e) {
                $(".alert").alert('close');
                currentAnswerRating = e.detail;
            });
        }

        $("#viewNewAnswerTextArea").html("");
        $("#viewNewAnswerTextArea").append('<h4 name="answerRateRequestQuestion">' + getQQuestionFromId(questionId) + '</h4>');
        $("#viewNewAnswerTextArea").append('<div class="well answerModal">' + getQAnswerFromId(questionId) + '</div>');
    }, 200);

    currentAnswerToView = questionId;
}

function triggerModifyQuestionModal(questionId){
    $(".alert").alert('close');
    $("#modifyQuestionModalTitle").html("");
    $("#modifyQuestionModalTitle").prepend("<p class='answerTopic'>Question sent to " + getQUserFromId(questionId) + " about " + getQTopicFromId(questionId) + "</p><hr />");
    $("#modifyQuestionText").val("");
    $("#modifyQuestionText").height('auto');
    $('#cancelModifyQuestion').prop('disabled', false);
    $('#saveModifyQuestionButton').prop('disabled', false);
    $("#saveModifyQuestionButton").text("Save Changes");

    setTimeout(function() {
        $("#modifyQuestionText").val(getQQuestionFromId(questionId));
        $('#modifyQuestionText').keyup();
    }, 200);

    currentQuestionToModify = questionId;
    currentUserToModifyQuestionTo = getQUserFromId(questionId);
    currentTopicToModifyQuestionTo = getQTopicFromId(questionId) ;
}

function getQQuestionFromId(questionId){
    // Look in unanswered questions
    for (i = 0; i < unansweredResults.length; i++) {
        if (unansweredResults[i].questionId == questionId){
            return unansweredResults[i].question;
        }
    }

    //Look in answered questions
    for (i = 0; i < answeredResults.length; i++) {
        if (answeredResults[i].questionId == questionId){
            return answeredResults[i].question;
        }
    }

    return "";
}

function getQTopicFromId(questionId){
        // Look in unanswered questions
        for (i = 0; i < unansweredResults.length; i++) {
            if (unansweredResults[i].questionId == questionId){
                return unansweredResults[i].topic;
            }
        }
    
        //Look in answered questions
        for (i = 0; i < answeredResults.length; i++) {
            if (answeredResults[i].questionId == questionId){
                return answeredResults[i].topic;
            }
        }
    
        return "";
}

function getQUserFromId(questionId){

        // Look in unanswered questions
        for (i = 0; i < unansweredResults.length; i++) {
            if (unansweredResults[i].questionId == questionId){
                return (unansweredResults[i].firstName + " " + unansweredResults[i].lastName);
            }
        }
    
        //Look in answered questions
        for (i = 0; i < answeredResults.length; i++) {
            if (answeredResults[i].questionId == questionId){
                return (answeredResults[i].firstName + " " + answeredResults[i].lastName);
            }
        }
    
        return "";
}

function getQAnswerFromId(questionId){
    // Look in unanswered questions
    for (i = 0; i < unansweredResults.length; i++) {
        if (unansweredResults[i].questionId == questionId){
            return unansweredResults[i].answer;
        }
    }

    //Look in answered questions
    for (i = 0; i < answeredResults.length; i++) {
        if (answeredResults[i].questionId == questionId){
            return answeredResults[i].answer;
        }
    }

    return "";
}

function getAnsweredQuestions(){
    return [{
        firstName: "Juan",
        lastName:"Medellin",
        username: "juajua",
        userImage:"Media/userImage.jpg",
        questionId: "8questionPaulinaJuan",
        status: "A",
        rating: "-1",
        answer: "Use an UPDATE keyword on the table you want to modify and to validate use a SELECT from table WHERE value is what you expect, you can do this way or any other way",
        question: "How do I make an update to my table and validate that it was a success?",
        topic: "SQL"},
    {
        firstName: "Patricio",
        lastName:"Sanchez",
        username: "patpat",
        userImage:"Media/userImage.jpg",
        questionId: "12questionPaulinaPatricio",
        status: "A",
        rating: "-1",
        answer: "You can use Apache on your terminal, use a Node npm install http-server and use this command to run a localhost, or you can download Mamp",
        question: "How can I host a web application?",
        topic: "Web Development"},
    {
        firstName: "Monica",
        lastName:"Perez",
        username: "monmon",
        userImage:"Media/userImage.jpg",
        questionId: "9questioPaulinaMonica",
        status: "R",
        rating: "4.8",
        answer: "Definitely Python, using plyflex and bison, really easy to make with Python",
        question: "What is the best language to make a compiler with? Is it Python?",
        topic: "Python"}
    ];
}

function helperCreateListElementRequest(answerRequest){
    var buildHTML;
    if (answerRequest.status == "A") {
        buildHTML = '<li class="list-group-item" name="answerRequest"><button type="button" class="close answered">&times;</button> <p name="answerRequestUserHeader"> <span class="label label-primary">New</span> Question made to ' + answerRequest.firstName + " " +  answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion"><a class="newAnsweredQuestionLink" id="' + answerRequest.questionId + '"data-toggle="modal" data-target="#viewNewAnswerModal" name="answerListItem">' + answerRequest.question + '</a></h4>';
        //buildHTML = buildHTML + '<div class="well answer">' + answerRequest.answer + '</div>';
    }

    else if (answerRequest.status == "R")  {
        buildHTML = '<li class="list-group-item" name="answerRequest"><button type="button" class="close answered">&times;</button>  <p name="answerRequestUserHeader">Question made to ' + answerRequest.firstName + " " + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion"> <a class="answeredQuestionLink" id="' + answerRequest.questionId + '"data-toggle="modal" data-target="#viewAnswerModal" name="answerListItem">' + answerRequest.question + '</a></h4>';
        buildHTML = buildHTML + '<div class="well answer">' + answerRequest.answer + '</div>';
    }

    else {
        buildHTML = '<li class="list-group-item" name="answerRequest"><button type="button" class="close unanswered">&times;</button> ' +
                    '<p name="answerRequestUserHeader">' +
                    ' Question made to ' + answerRequest.firstName + " " + answerRequest.lastName +
                    '</p>' +
                    '<p name="answerRequestSubjectHeader"> ' + '&bull;' +
                    '</p>' +
                    ' <p name="answerRequestSubjectHeader">' + answerRequest.topic +
                    '</p>' +
                    '<span class="label label-success edit" name="unansweredQuestionLink" id="' + answerRequest.questionId + '"data-toggle="modal" data-target="#modifyQuestionModal">Edit</span>' +
                    '<h4 name="answerRequestQuestion">' +
                    '<p>' + answerRequest.question + '</p>' +
                    '</h4>';

        buildHTML = buildHTML + '<div class="well unanswer">' + "No answer yet" + '</div>';
    }

    //buildHTML = buildHTML + '<hr /><div class="well addComment">' + "Add comment" + '</div></li>';

    return buildHTML;
}

function getQuestionsNumber(){
    return 2;
}

function createStarRatingAnswer(answerRating){
    var star1 = (userRating >= 1 ? " checked": "");
    var star2 = (userRating >= 2 ? " checked": "");
    var star3 = (userRating >= 3 ? " checked": "");
    var star4 = (userRating >= 4 ? " checked": "");
    var star5 = (userRating >= 5 ? " checked": "");

    var buildStarHTML = '<span class="fa fa-star' + star1 + '"></span> <span class="fa fa-star' + star2 + '"></span> <span class="fa fa-star' + star3 + '"></span> <span class="fa fa-star' + star4 + '"></span> <span class="fa fa-star' + star5 + '"></span>';
    return buildStarHTML;
}
