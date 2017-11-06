var currentTopic = "";
var currentUser = "";
var currentWidthAnalytics = 0;

$(window).on('resize', function() {
    if($(window).width() < 768){
        $("#analyticsFeed").remove();
        $("#analyticsGrid").html("");
        $("#analyticsGrid").append('<div class="well" id="analyticsFeedAlt" width="100%;" style=""> </div>');
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
        $('#analyticsFeed').on('affix.bs.affix', function () {
            var $affixElement = $('div[data-spy="affix"]');
            if(currentWidthAnalytics == 0) {
                currentWidthAnalytics = $("#analyticsFeed").width();
            }
            $affixElement.width(currentWidthAnalytics);
        });
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

    $('#analyticsFeed').on('affix.bs.affix', function () {
        var $affixElement = $('div[data-spy="affix"]');
        if(currentWidthAnalytics == 0) {
            currentWidthAnalytics = $("#analyticsFeed").width();
        }
        $affixElement.width(currentWidthAnalytics);
   });
    
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
        topicName: "UX/UI",
        topicDescription:"UX & UI have always been a power couple. UX design is an analytical and technical skill that co-relates to the UI graphic design to increase of effectiveness in the use of the applications developed.",
        topicImage:"Media/cardImage1.jpg"
    }];
}

function loadTopicCards(){
    listTopics = getTopicCards();

    for (i = 1; i < 10; i++) { 
        // Instead of 0 iterate through index
        var topicCardHTML = helperCreateCardHTML(listTopics[0], i);
        var topicCounterId = "#topic" + i;

        $(topicCounterId).html("");
        $(topicCounterId).append(topicCardHTML).hide().fadeIn(i*400);
    }

    $("[name='askQuestionButton']").on("click", function() {
        var identifierTopicName = "#" + this.id + "TopicName";
        currentTopic = $(identifierTopicName).text();
        $("#askModalTitle").html("");
        $("#askModalTitle").prepend("<p class='introQuestion'>" + currentUser + " asks about " + currentTopic + "</p>");
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