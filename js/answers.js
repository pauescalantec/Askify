$(document).ready(function(){
    // Load topics
    setTimeout(function() {
        loadAnswerRequests();
    }, 100);  
});

function loadSidebarRequestCount(){
    $("#requestsCountSidebar").text(getRequestNumber() == 0 ? "" : getRequestNumber()); 
}

function loadAnswerRequests(){
    $("#answerRequestsSidebarButton").on("click", function(){
        loadAnswerRequests();
    });

    $("#previousAnswersSidebarButton").on("click", function(){
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
    var buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">' + answerRequest.firstName + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion">' + answerRequest.question + '</h4> <button name="answerQuestionRequestButton" class="flat-butt flat-info-butt flat-inner-butt flat-info-inner-butt" ' + answerRequest.questionId + 'href="">Answer</button></li>';
    return buildHTML;
}

function helperCreateListElementPrevious(answerRequest){
    var buildHTML = '<li class="list-group-item" name="answerRequest"> <p name="answerRequestUserHeader">' + answerRequest.firstName + answerRequest.lastName + '</p> <p name="answerRequestSubjectHeader">&bull;</p> <p name="answerRequestSubjectHeader">' + answerRequest.topic + '</p> <h4 name="answerRequestQuestion"><a class="previousAnswerLink">' + answerRequest.question + '</a></h4></li>';
    return buildHTML;
}
