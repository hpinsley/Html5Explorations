function GameData(onLoadComplete) {

    var url = "/JSWebPlay/Game/GetJeopardyBoard";
    var that = this;

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        success: function (gdata) {
            that.data = gdata;
            onLoadComplete();

        },
        error: function (request, errmsg, error) {
            alert("Error " + errmsg + " " + error + " " + request.responseText);
        }
    });
}

GameData.prototype.numCats = function () {
    var numCats = this.data.Categories.length;
    return numCats;
};

GameData.prototype.numQuestions = function () {
    var count = this.data.Categories[0].questions.length;
    return count;
};

GameData.prototype.getCategories = function () {
    var result = [];
    for (var i = 0; i < this.data.Categories.length; ++i) {
        result[i] = this.data.Categories[i].title;
    }
    return result;
};

GameData.prototype.getQuestion = function (qIndex, cIndex) {
    var question = this.data.Categories[cIndex].questions[qIndex].q;
    return question;
};

GameData.prototype.getAnswer = function (qIndex, cIndex) {
    var answer = this.data.Categories[cIndex].questions[qIndex].a;
    return answer;
};
