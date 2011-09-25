$(function () {

    //Assign class dropdownMenuHidden to any nested ul's within the main menu

    $("ul#mainMenu > li > ul").addClass("dropdownMenuHidden");

    //Assign a mouseover function for all the top level menu li's to clear any
    //dropdown menus with class dropdownMenuShown and then find the one child element
    //that needs to have it reset to that.

    $("ul#mainMenu > li").mouseover(function () {
        //Hide any other dropdowns
        $(".dropdownMenuShown")
            .removeClass("dropdownMenuShown")
            .addClass("dropdownMenuHidden");

        var liElement = $(this);
        var innerUlElement = $(".dropdownMenuHidden", liElement);
        innerUlElement.removeClass("dropdownMenuHidden").addClass("dropdownMenuShown");


        return true;
    });

});
