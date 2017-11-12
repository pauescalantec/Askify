var currentTopic = "";
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
    // Menu control
    $("#navbarHome li").on("click", function(){
		$(".active").removeClass("active");
        var currentClass = $(this).attr("class");

        // Options is just a dropdown menu
        if (currentClass != "dropdown" && currentClass != "options" && currentClass != "dropdown open") {
            $(this).addClass("active");

            $(".selectedSection").removeClass("selectedSection").addClass("notSelectedSection");

            $("#" + currentClass + "Section").addClass("selectedSection").removeClass("notSelectedSection").trigger('classChange');
        }
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

    // Load topics
    loadUserFullName();

    // Load request count
    loadRequestCount();
});

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


    // After successful posting
    currentTopic = "";
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
            // Fade out from tutor list
            $("#chooseTutorArea").fadeOut( 30, function() {
                $("#chosenTutorButton").fadeOut( 5, function() {
                    $("#sendQuestionButton").hide().fadeIn(100);
                });

                $("#modalInstruction").html(currentUser + " asks " + getFullNameFromUsername(selectedTutor) + " about <strong>" + currentTopic + " </strong><hr />");
                $("#questionTextArea").hide().fadeIn(120);
                $("#backToTutors").hide().fadeIn(100);
                $(this).hide();
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

function loadUserFullName(){
    currentUser = getCurrentUser();
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

function getCurrentUser(){
    return "Paulina";
}

function getTopicCards(){
    return [{
                topicName: "Python",
                topicDescription:"An interpreted, object-oriented programming language similar to PERL, that has gained popularity because of its clear syntax and readability, it features a dynamic type system.",
                topicImage:"Media/cardImage6.jpg"},
            {
                topicName: "Web Development",
                topicDescription:"HTML + Javascript + CSS: These technologies are responsible for designing, coding and modifying websites, from layout to function and according to a client's specifications and needs.",
                topicImage:"Media/cardImage2.jpg"},
            {
                topicName: "C#",
                topicDescription:"Object-oriented programming language that aims to combine the computing power of C++ with the programming ease of Visual Basic. C# is based on C++ and contains features like Java.",
                topicImage:"Media/cardImage3.jpg"},
            {
                topicName: "PHP",
                topicDescription:"A server-side scripting language designed primarily for web development but also used as a general-purpose programming language, stands for Hypertext Preprocessor.",
                topicImage:"Media/cardImage7.jpg"},
            {
                topicName: "C++",
                topicDescription:"C++ is a general-purpose object-oriented programming (OOP) language and is an extension of the C language. It encapsulates both high- and low-level language features.",
                topicImage:"Media/cardImage4.jpg"},
            {
                topicName: "Java",
                topicDescription:"A general-purpose computer programming language that is concurrent, class-based, object-oriented, and specifically designed to have as few implementation dependencies as possible.",
                topicImage:"Media/cardImage5.jpg"},
            {
                topicName: "UX/UI",
                topicDescription:"UX & UI have always been a power couple. UX design is an analytical and technical skill that co-relates to the UI graphic design to increase of effectiveness in the use of the applications developed.",
                topicImage:"Media/cardImage1.jpg"},
            {
                topicName: "SQL",
                topicDescription:"Structured Query Language (SQL) is a standard computer language for relational database management and manipulation. SQL is used to query, insert, update and modify data.",
                topicImage:"Media/cardImage8.jpg"},
            {
                topicName: "React",
                topicDescription:"JavaScript library for building user interfaces. React dynamically allows developers to create large web-applications that use data and can change over time without reloading the page.",
                topicImage:"Media/cardImage9.jpg"}
          ];
}

function getRequestNumber(){
    return 3;
}

function getQuestionsNumber(){
    return 2;
}

function getListTutorsByTopic(topicName){
    // use topicName for query
    return [{
                firstName: "Paulina",
                lastName:"Escalante",
                username: "paupau",
                userImage:"Media/userImage.jpg",
                userCareer: "Computer Science",
                userGraduationDate: "December 2018",
                userRating: "4.0"},
            {
                firstName: "Patricio",
                lastName:"Sanchez",
                username: "patpat",
                userImage:"Media/userImage.jpg",
                userCareer: "Computer Science",
                userGraduationDate: "May 2018",
                userRating: "4.3"},
            {
                firstName: "Juan",
                lastName:"Medellin",
                username: "juajua",
                userImage:"Media/userImage.jpg",
                userCareer: "Robotics",
                userGraduationDate: "May 2014",
                userRating: "2.7"},
            {
                firstName: "Javier",
                lastName:"Guajardo",
                username: "javjav",
                userImage:"Media/userImage.jpg",
                userCareer: "Computer Science",
                userGraduationDate: "May 2016",
                userRating: "4.7"},
            {
                firstName: "Monica",
                lastName:"Perez",
                username: "monmon",
                userImage:"Media/userImage.jpg",
                userCareer: "Information Technology",
                userGraduationDate: "May 2019",
                userRating: "3.7"}
            ];
}

function loadTopicCards(){
    listTopics = getTopicCards();

    for (i = 0; i < (listTopics.length); i++) {
        // Instead of 0 iterate through index
        var topicCardHTML = helperCreateCardHTML(listTopics[i], (i+1));
        var topicCounterId = "#topic" + (i+1);

        $(topicCounterId).html("");
        $(topicCounterId).prepend(topicCardHTML).hide().fadeIn((i+1)*400);
    }

    $("[name='askQuestionButton']").on("click", function() {
        $(".alert").alert('close');
        var identifierTopicName = "#" + this.id + "TopicName";
        currentTopic = $(identifierTopicName).text();
        triggerAskQuestionModal(currentTopic);
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

function triggerAskQuestionModal(currentTopic){
    // Create title instruction
    $("#chooseModalTitle").html("");
    $("#chooseModalTitle").prepend("<p class='introQuestion' id='modalInstruction'>Choose a tutor to ask about <strong>" + currentTopic + " </strong></p>");
    $("#questionText").val("");
    $("#questionText").height('auto');
    selectedTutor = "";

    createTutorList();

    $("[name='tutorCard']").on("click", function() {
        $(".alert").alert('close');
        var identifierUsername = this.id;

        // Another tutor was selected
        if (selectedTutor != ""){
            //Remove previous tutor selection
            $("#" + selectedTutor).removeClass("selected");
            $("#" + selectedTutor).addClass("unselected");
            $("#" + selectedTutor).css("background-color", "transparent");
        }

        if (selectedTutor == identifierUsername){
            $("#" + identifierUsername).css("background-color", "transparent");
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
}

function createTutorList(){
    // Create tutor list by topic
    var listTutors = getListTutorsByTopic(currentTopic);
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
}

function helperCreateTutorCardHTML(tutorDataJson){
    var tutorCardHTML = '<div class="card" name="tutorCard" id="' + tutorDataJson.username + '"> <div class="card-body"> <img class="card-img-top" name="tutorImage" src="' + tutorDataJson.userImage + '" alt=""> <h5 class="card-title" name="tutorNameHeading"> '+ tutorDataJson.firstName + " " + tutorDataJson.lastName + '</h5> <p name="starRating">' + createStarRating(tutorDataJson.userRating) + '</p>  <p name="numberRating">(' + tutorDataJson.userRating + '/5.0)</p><p class="card-text" name="tutorCardDescription">' + tutorDataJson.userCareer  + '</p></div></div>';
    return tutorCardHTML;
}

function createTutorRow(rowId){
    var buildRowHTML = '<div class="row equal" id="' + rowId + '" name="tutorRow">';
    return buildRowHTML;
}

function helperCreateCardHTML(topicData, idNumber){
    var buildHTML = '<div class="well"> <div class="card"> <div class="card-body"> <img class="card-img-top" src="' + topicData.topicImage + '" alt=""> <h4 class="card-title" id="askTopic'+ idNumber +'TopicName">' + topicData.topicName + '</h4> <p class="card-text">' + topicData.topicDescription + '</p> <button id="askTopic' + idNumber + '"class="flat-butt flat-info-butt flat-inner-butt flat-info-inner-butt" data-toggle="modal" name="askQuestionButton" data-target="#chooseTutorModal">Ask Question</button> </div> </div> </div>';
    return buildHTML;
}

function helperCreateAnalytics(idField, titleField, dataField){
    var analyticsHTML = '<div id="' + idField + '" class="well" name="analyticsWells"> <h4>' + titleField + '</h4><p class="analyticsDataField">' + dataField + '</p> </div>';
    return analyticsHTML;
}
