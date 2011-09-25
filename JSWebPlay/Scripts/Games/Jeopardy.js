var game;
var currentQuestion;
var currentCategory;

$(function () {
    var bodyHeight = $("body").height();
    var controlBarHeight = $("#controlBarSection").height();
    var headerHeight = $("body header").height();
    $("#boardSection").height(bodyHeight - (headerHeight + controlBarHeight));
    $("#CtlRevealAnswerBtn").click(showAnswer);
    $("#CtlRevealedAnswerCloseBtn").click(closeAnswer);

    $("#headshot1,#CBtnBarbara").click(function () { playFunnyClip("barbara01"); });
    $("#CBtnWrong").click(function () { playFunnyClip("idiot01"); });
    $("#headshot2").click(function () { playFunnyClip("lostkeys"); });
    $("#CBtnStartGameBtn").click(startGameClicked);


    game = new GameData(boardLoaded);
});

function playClip(elementId) {
    var clip = $("#" + elementId)[0];
    clip.play();
}

function playFunnyClip(elementId) {
    var clip = $("#" + elementId);
    $("#bigRichard").fadeIn(100);
    clip.bind("ended", function () {
        $("#bigRichard").hide();
        clip.unbind("ended");
    }
    );
    clip[0].play();
}


function boardLoaded() {
    var catArray = game.getCategories();

    var row = "<tr>";
    $.each(catArray, function (i, cat) {
        row += "<th class='categoryBoxHidden' id='catbox-" + i + "' ><span class='qText'>" + "Jeopardy!" + "</span></th>";
    });
    row += "</tr>";
    $("#categoryHeader").append(row);


    for (var q = 0; q < game.numQuestions(); ++q) {
        row = "<tr>";
        for (var c = 0; c < game.numCats(); ++c) {
            row += "<td id='question-q" + q + "-c" + c + "' class='hiddenQuestion'>" +
                "$" + (q + 1) * 100
                + "</td>";
        }
        row += "</tr>";
        $("#cardTable tbody").append(row);
    }

    $("#cardTable .hiddenQuestion").click(questionClick);   //Attach handler
}

function questionClick() {
    var id = this.id;
    var q = id.slice(10, 11);
    var c = id.slice(13, 14);

    $(this).removeClass("hiddenQuestion").addClass("usedQuestion");

    currentQuestion = q;
    currentCategory = c;

    var qText = game.getQuestion(currentQuestion, currentCategory);
    $("#questionText").html(qText);
    $("#revealedQuestion")
        .show();
}


function showAnswer() {

    $("#revealedAnswer").slideDown(500, function () {
        $("#revealedQuestion").hide();        
    });
    
    var aText = game.getAnswer(currentQuestion, currentCategory);
    $("#answerText").html(aText);
}


function closeAnswer() {
    $("#revealedAnswer")
        .css("display", "none");
}

function startGameClicked() {
    revealCategories();
}

function revealCategories() {
    var catArray = game.getCategories();
    var numCats = catArray.length;
    var sleepTime = 2500;
    var catIndex = 0;
    function showCat() {
        var catText = catArray[catIndex];
        var id = "catbox-" + catIndex;

        var jq = $("#" + id + " .qText");

        jq.fadeOut(1000, function () {
            jq.removeClass("categoryBoxHidden")
                .addClass("categoryBoxRevealed");
            jq.html(catText)
                .fadeIn(1000);
        });

        if (catIndex < (numCats - 1)) {
            ++catIndex;
            setTimeout(function () { showCat(); }, sleepTime);
        }
    }
    showCat();
}
