var currentQuestionToAnswer = "";
var currentUserToAnswer = "";
var currentTopicToAnswer = "";

$(document).ready(function(){
    // Load topics
    setTimeout(function() {
        loadAnswerRequests();
    }, 100);  

    $('#resizerAnswer').on( 'change keyup keydown paste cut', 'textarea', function (event){
        $(".alert").alert('close');
        $(this).height(0).height(this.scrollHeight-12);
    }).find( 'textarea' ).change();

    $("#sendAnswerButton").on("click", function(){
        sendAnswerButtonClicked();
    });
});

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

function triggerAnswerQuestionModal(questionId){
    $(".alert").alert('close');
    $("#answerModalTitle").html("");
    $("#answerModalTitle").prepend("<p class='answerTopic'> " + getTopicFromId(questionId) + "</p><hr /> <p class='introAnswer' id='modalInstruction'>" + getQuestionFromId(questionId) + "</p>");
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
}

function getQuestionFromId(questionId){
    var questionsList = {
        "1questionPatricioPaulina":"Why do I have to include files in the header like #include stdlib.h and stdio.h, if I don't have them, will my code not compile?",
        "2questioMonicaPaulina" : "What nuget packages do you recommend to use for calculating the p-value of the gamma function?", 
        "3questionMonicaPaulina": "How can I make my python code into a REST API so that I can connect my web interface with my python code that I made for my compilers course?"};

    return questionsList[questionId];
}

function getTopicFromId(questionId){
    var topicsList = {
        "1questionPatricioPaulina": "C++",
        "2questioMonicaPaulina" : "C#",
        "3questionMonicaPaulina": "Python"};

    return topicsList[questionId];
}

function getUserFromId(questionId){
    var topicsList = {
        "1questionPatricioPaulina": "Patricio Sanchez",
        "2questioMonicaPaulina" : "Monica Perez",
        "3questionMonicaPaulina": "Monica Perez"};

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
    var buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">Question by ' + answerRequest.firstName + " " + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion">' + answerRequest.question + '</h4> <button name="answerQuestionRequestButton" class="flat-butt flat-info-butt flat-inner-butt flat-info-inner-butt" id="' + answerRequest.questionId + '" data-toggle="modal" data-target="#answerQuestionModal"  href="">Answer</button></li>';
    return buildHTML;
}

function helperCreateListElementPrevious(answerRequest){
    var buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">Question by ' + answerRequest.firstName + " " + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion"><a class="previousAnswerLink">' + answerRequest.question + '</a></h4>';
    buildHTML = buildHTML + '<div class="well previousAnswer">' + answerRequest.answer + '</div>';
    return buildHTML;
}
