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
});