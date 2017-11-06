var currentTopic = "";
var currentUser = "";
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

    $('#homeSection').on('classChange', function() {
        // Load topics
        loadTopicCards();
        loadAnalyticsField("#analyticsFeed");
    });

    activateAffixListener("#analyticsFeed");
    
    // Load topics
    loadTopicCards();

    // Load Analytics feed
    loadAnalyticsField("#analyticsFeed");

    // Load topics
    loadUserFullName();
});

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
        var identifierTopicName = "#" + this.id + "TopicName";
        currentTopic = $(identifierTopicName).text();
        $("#askModalTitle").html("");
        $("#askModalTitle").prepend("<p class='introQuestion'>" + currentUser + " asks about <strong>" + currentTopic + "</strong></p>");
        $("#questionText").val("");
        $("#questionText").height('auto');
    });
}

function helperCreateCardHTML(topicData, idNumber){
        var buildHTML = '<div class="well"> <div class="card"> <div class="card-body"> <img class="card-img-top" src="' + topicData.topicImage + '" alt=""> <h4 class="card-title" id="askTopic'+ idNumber +'TopicName">' + topicData.topicName + '</h4> <p class="card-text">' + topicData.topicDescription + '</p> <button id="askTopic' + idNumber + '"class="flat-butt flat-info-butt flat-inner-butt flat-info-inner-butt" data-toggle="modal" name="askQuestionButton" data-target="#askQuestionModal">Ask Question</button> </div> </div> </div>';
        return buildHTML;
}

function AutoGrowTextArea(textField){
  if (textField.clientHeight < textField.scrollHeight)
  {
    textField.style.height = textField.scrollHeight + "px";
    if (textField.clientHeight < textField.scrollHeight)
    {
      textField.style.height = 
        (textField.scrollHeight * 2 - textField.clientHeight) + "px";
    }
  }
}

function helperCreateAnalytics(idField, titleField, dataField){
    var analyticsHTML = '<div id="' + idField + '" class="well"> <h4>' + titleField + '</h4><p>' + dataField + '</p> </div>';
    return analyticsHTML;
}