var currentQuestionToAnswer = "";
var currentUserToAnswer = "";
var currentTopicToAnswer = "";
var currentAnswerToModify = "";
var currentUserToModifyAnswerTo = "";
var currentTopicToModifyAnswerTo = "";

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
        var postSuccessful = true;
        
        if(postSuccessful){
            postModifiedAnswer();
        }

        else {
            setTimeout(function() {
                createDangerAlert("#modifyAnswerTextArea", "Error connecting to server. Try again later.", "answerNotPostModifiedAlert");
            }, 300);  
        }
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
        var postSuccessful = true;
        
        if(postSuccessful){
            postAnswer();
        }

        else {
            setTimeout(function() {
                createDangerAlert("#answerTextArea", "Error connecting to server. Try again later.", "answerNotPostedAlert");
            }, 300);  
        }
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

function loadSidebarRequestCount(){
    $("#requestsCountSidebar").text(getRequestNumber() == 0 ? "" : getRequestNumber()); 
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

    // Load request count
    loadSidebarRequestCount();

    var listRequests = getAnswerRequests();
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
    var listRequests = getPreviousAnswers();
    var numberRequests = listRequests.length;

    $("#answersList").html("");
    $("#answersList").append('<li class="list-group-item" id="answerRequestsHeader">Answered by you</li>');

    // Fill in all rows except last one
    for (i = 0; i < numberRequests; i++) {    
        var requestHTML = helperCreateListElementPrevious(listRequests[i]);
        $("#answersList").append(requestHTML);
    } 

    $(".previousAnswerLink").on("click", function(){
        triggerModifyAnswerModal(this.id);
    });

    $('[data-toggle="tooltip"]').tooltip();  
}

function getQuestionFromId(questionId){
    var questionsList = {
        "1questionPatricioPaulina":"Why do I have to include files in the header like #include stdlib.h and stdio.h, if I don't have them, will my code not compile?",
        "2questioMonicaPaulina" : "What nuget packages do you recommend to use for calculating the p-value of the gamma function?", 
        "3questionMonicaPaulina": "How can I make my python code into a REST API so that I can connect my web interface with my python code that I made for my compilers course?",
        "4questionJuanPaulina":"What do I have to do to compile a .cpp file in terminal in Linux?",
        "5questioMonicaPaulina":"What is the best functionality for scrollers, top to bottom or bottom to top?"};

    return questionsList[questionId];
}

function getTopicFromId(questionId){
    var topicsList = {
        "1questionPatricioPaulina": "C++",
        "2questioMonicaPaulina" : "C#",
        "3questionMonicaPaulina": "Python",
        "4questionJuanPaulina":"C++",
        "5questioMonicaPaulina":"UX/UI"};

    return topicsList[questionId];
}

function getUserFromId(questionId){
    var topicsList = {
        "1questionPatricioPaulina": "Patricio Sanchez",
        "2questioMonicaPaulina" : "Monica Perez",
        "3questionMonicaPaulina": "Monica Perez",
        "4questionJuanPaulina":"Juan Medellin",
        "5questioMonicaPaulina":"Monica Perez"};

    return topicsList[questionId];
}

function getAnswerFromId(questionId){
    var topicsList = {
        "1questionPatricioPaulina": "",
        "2questioMonicaPaulina" : "",
        "3questionMonicaPaulina": "",
        "4questionJuanPaulina":"You can use: gcc -o outputName fileName.cpp",
        "5questioMonicaPaulina":"The best to to is top to bottom"};

    return topicsList[questionId];
}

function loadRequestCount(){
    $("#requestsCount").text(getRequestNumber() == 0 ? "" : getRequestNumber()); 
    $("#requestsCountSidebar").text(getRequestNumber() == 0 ? "" : getRequestNumber()); 
}

function getAnswerRequests(){
    return [{
        firstName: "Patricio",
        lastName:"Sanchez",
        username: "patpat",
        userImage:"Media/userImage.jpg",
        questionId: "1questionPatricioPaulina",
        question: "Why do I have to include files in the header like #include stdlib.h and stdio.h, if I don't have them, will my code not compile?",
        topic: "C++"},
    {
        firstName: "Monica",
        lastName:"Perez",
        username: "monmon",
        userImage:"Media/userImage.jpg",
        questionId: "2questioMonicaPaulina",
        question: "What nuget packages do you recommend to use for calculating the p-value of the gamma function?",
        topic: "C#"},
    {
        firstName: "Monica",
        lastName:"Perez",
        username: "monmon",
        userImage:"Media/userImage.jpg",
        questionId: "3questionMonicaPaulina",
        question: "How can I make my python code into a REST API so that I can connect my web interface with my python code that I made for my compilers course?",
        topic: "Python"}
    ];
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
    var buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">Question by ' + answerRequest.firstName + " " + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion"> <span data-placement="top" data-toggle="tooltip" title="Click to modify"><a class="previousAnswerLink" id="' + answerRequest.questionId + '"data-toggle="modal" data-target="#modifyAnswerModal">' + answerRequest.question + '</a></span></h4>';
    buildHTML = buildHTML + '<div class="well previousAnswer">' + answerRequest.answer + '</div>';
    return buildHTML;
}
