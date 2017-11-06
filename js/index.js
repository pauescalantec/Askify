var currentTopic = "";
var currentUser = "";

$(document).ready(function(){
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
    });
    
    // Load topics
    loadTopicCards();

    // Load topics
    loadUserFullName();
});

function loadUserFullName(){
    currentUser = "Paulina";
    // Add to profile section
    $("#navbarItemDropdown").html('<span id="navbarItemProfile" class="glyphicon glyphicon-user"></span> ' + currentUser);
}

function loadTopicCards(){
    listTopics = [{
                topicName: "UX/UI",
                topicDescription:"UX & UI have always been a power couple. UX design is an analytical and technical skill that co-relates to the UI graphic design to increase of effectiveness in the use of the applications developed.",
                topicImage:"Media/cardImage1.jpg"
            }];

    for (i = 1; i < 10; i++) { 
        // Instead of 0 iterate through index
        var topicCardHTML = helperCreateCardHTML(listTopics[0], i);
        var topicCounterId = "#topic" + i;

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

function AutoGrowTextArea(textField)
{
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