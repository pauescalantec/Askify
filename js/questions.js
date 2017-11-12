var currentQuestionToModify = "";
var currentUserToModifyQuestionTo = "";
var currentTopicToModifyQuestionTo = "";

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
        var postSuccessful = true;
        
        if(postSuccessful){
            postModifiedQuestion();
        }

        else {
            setTimeout(function() {
                createDangerAlert("#modifyQuestionTextArea", "Error connecting to server. Try again later.", "questionNotPostModifiedAlert");
            }, 300);  
        }
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

    var listQuestions = getAnsweredQuestions();
    var numberRequests = listQuestions.length;

    $("#questionsList").html("");
    $("#questionsList").append('<li class="list-group-item" id="answerRequestsHeader">Questions made by you with answers</li>');

    // Fill in all rows except last one
    for (i = 0; i < numberRequests; i++) {    
        var requestHTML = helperCreateListElementRequest(listQuestions[i]);
        $("#questionsList").append(requestHTML);
    } 
}

function loadUnansweredQuestions(){
    var listUnansweredQuestions = getUnansweredQuestions();
    var numberRequests = listUnansweredQuestions.length;

    $("#questionsList").html("");
    $("#questionsList").append('<li class="list-group-item" id="answerRequestsHeader">Questions made by you not yet answered</li>');

    // Fill in all rows except last one
    for (i = 0; i < numberRequests; i++) {    
        var requestHTML = helperCreateListElementRequest(listUnansweredQuestions[i]);
        $("#questionsList").append(requestHTML);
    } 

    $("span[name=unansweredQuestionLink]").on("click", function(){
        triggerModifyQuestionModal(this.id);
    });

    $('[data-toggle="tooltip"]').tooltip();  
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
    var questionsList = {
        "8questionPaulinaJuan": "How do I make an update to my table and validate that it was a success?",
        "12questionPaulinaPatricio" : "How can I host a web application?",
        "9questioPaulinaMonica": "What is the best language to make a compiler with? Is it Python?",
        "10questionPaulinaJavier":"Why do we need a data and an application layer?",
        "11questionPaulinaJavier":"How do you get the parameters of a POST request?"};

    return questionsList[questionId];
}

function getQTopicFromId(questionId){
    var topicsList = {
        "8questionPaulinaJuan": "SQL",
        "12questionPaulinaPatricio" : "Web Development",
        "9questioPaulinaMonica": "Python",
        "10questionPaulinaJavier":"PHP",
        "11questionPaulinaJavier":"PHP"};

    return topicsList[questionId];
}

function getQUserFromId(questionId){
    var topicsList = {
        "8questionPaulinaJuan": "Juan Medellin",
        "12questionPaulinaPatricio" : "Patricio Sanchez",
        "9questioPaulinaMonica": "Monica Perez",
        "10questionPaulinaJavier":"Javier Guajardo",
        "11questionPaulinaJavier":"Javier Guajardo"};

    return topicsList[questionId];
}

function getQAnswerFromId(questionId){
    var topicsList = {
        "8questionPaulinaJuan": "Use an UPDATE keyword on the table you want to modify and to validate use a SELECT from table WHERE value is what you expect, you can do this way or any other way",
        "12questionPaulinaPatricio" : "You can use Apache on your terminal, use a Node npm install http-server and use this command to run a localhost, or you can download Mamp",
        "9questioPaulinaMonica": "Definitely Python, using plyflex and bison, really easy to make with Python",
        "10questionPaulinaJavier":"",
        "11questionPaulinaJavier":""};

    return topicsList[questionId];
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

function getUnansweredQuestions(){
    return [{
            firstName: "Javier",
            lastName:"Guajardo",
            username: "juajua",
            userImage:"Media/userImage.jpg",
            questionId: "10questionPaulinaJavier",
            status: "N",
            rating: "-1",
            answer: "",
            question: "Why do we need a data and an application layer?",
            topic: "PHP"},
        {
            firstName: "Javier",
            lastName:"Guajardo",
            username: "juajua",
            userImage:"Media/userImage.jpg",
            questionId: "11questionPaulinaJavier",
            status: "N",
            rating: "-1",
            answer: "",
            question: "How do you get the parameters of a POST request?",
            topic: "PHP"}
        ];
}

function helperCreateListElementRequest(answerRequest){
    var buildHTML;
    if (answerRequest.status == "A") {
        buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader"> <span class="label label-primary">New</span> Question made to ' + answerRequest.firstName + " " +  answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion"><a class="unansweredQuestionLink">' + answerRequest.question + '</a></h4>';
        buildHTML = buildHTML + '<div class="well answer">' + answerRequest.answer + '</div>';
    }

    else if (answerRequest.status == "R")  {
        buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">Question made to ' + answerRequest.firstName + " " + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion"><a class="unansweredQuestionLink">' + answerRequest.question + '</a></h4>';
        buildHTML = buildHTML + '<div class="well answer">' + answerRequest.answer + '</div>';
    }

    else {
        buildHTML = '<li class="list-group-item" name="answerRequest">' + 
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