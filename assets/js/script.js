// Quiz Settings
var timeGiven = 100; // initial time given to complete quiz
var timePenalty = 10; // time deducted for incorrect answer
var scorePenalty = 50; // points deducted for incorrect answer
var timeReward = 5; // time rewarded for correct answer
var scoreReward = 100; // points rewarded for correct answer
var timesUpMessage = "Time's Up!"; // message to display when time runs out
var answeredAllMessage = "Excellent!"; // message to display if quiz ends because all questions were answered correctly

// Quiz Questions
var quizQuestions = [
    {
        question: "What is the correct syntax for referring to an external JavaScript file called \"xxx.js\"?",
        options: [
            "<script src =\"xxx.js\">",
            "<script href=\"xxx.js\">",
            "<js src =\"xxx.js\">",
            "<javascript href=\"xxx.js\">"
        ],
        answer: "<script src =\"xxx.js\">"
    },
    {
        question: "How do you create a function in JavaScript",
        options: [
            "function:myFunction()",
            "function = myFunction()",
            "var myFunction() =",
            "function myFunction()"
        ],
        answer: "function myFunction()"
    },
    {
        question: "How do you write an IF statement for executing some code if 'i' is NOT equal to 5?",
        options: [
            "if i <> 5",
            "if (i <> 5)",
            "if (i != 5)",
            "if i != 5 then"
        ],
        answer: "if (i != 5)"
    },
    {
        question: "How does a FOR loop start?",
        options: [
            "for (var i = 0; i < 10; i++)",
            "for (i = 0; i++; i = 10)",
            "for (var i = 10; i++; 10)",
            "for (var i = 0; i < 10)"
        ],
        answer: "for (var i = 0; i < 10; i++)"
    },
    {
        question: "How do you write a JavaScript array?",
        options: [
            "var colors = 1 = (\"red\"), 2 = (\"green\"), 3 = (\"blue\")",
            "var colors[] = \"red\", \"green\", \"blue\"",
            "var colors = [\"red\", \"green\", \"blue\"]",
            "var colors = {\"red\", \"green\", \"blue\"}"
        ],
        answer: "var colors = [\"red\", \"green\", \"blue\"]"
    },
    {
        question: "How do you round the number 7.8 to the nearest integer?",
        options: [
            "round(7.8)",
            "Math.floor(7.8)",
            "Math.round(7.8)",
            "rnd(7.8)"
        ],
        answer: "Math.round(7.8)"
    }
];

// randomize order of quiz questions
quizQuestions.sort(function (a, b) { return 0.5 - Math.random() });

// setup timer
var timer = timeGiven;
var timeRemainingEl = document.querySelector("#time-remaining");
timeRemainingEl.textContent = timer;
var startTimer;

// set counters
var currentQuestion = 0;
var correctAnswersCounter = 0;
var incorrectAnswersCounter = 0;
var score = 0;

// declare scoresArr globally
var scoresArr;

// store page elements in variables
var viewScoresBtn = document.querySelector("#view-scores");
var timerEl = document.querySelector("#timer-display");
var reloadBtn = document.querySelector("#reload");
var contentEl = document.querySelector("#content");
var optionsEl = document.querySelector("#options");
var startBtn = document.querySelector("#start-btn");

// add instructions to page
var instructionsEl = document.querySelector("#instructions");
instructionsEl.textContent = "You have " + timeGiven + " seconds to answer " + quizQuestions.length + " questions.";

var startQuiz = function () {
    // start timer
    startTimer = setInterval(function () {
        timer--;
        timeRemainingEl.textContent = timer;
        if (timer === 0) {
            clearInterval(startTimer);
            endQuiz(timesUpMessage);
        }
    }, 1000);

    // call first question
    nextQuestion();
}

var answerQuestion = function (event) {
    // check if a answer button was clicked before proceeding
    var targetEl = event.target;
    if (targetEl.matches(".answer-btn")) {
        // check if answered correctly or incorrectly
        var pickedAnswer = targetEl.textContent;
        var correctAnswer = quizQuestions[currentQuestion].answer;
        if (pickedAnswer === correctAnswer) {
            // change color of button and timer
            targetEl.setAttribute("class", "correct");
            timerEl.setAttribute("class", "correct");
            // update counters
            correctAnswersCounter++;
            score += scoreReward;
            timer += timeReward;
            timeRemainingEl.textContent = timer;
        } else {
            // add question back into rotation
            quizQuestions.push(quizQuestions[currentQuestion]);
            // change color of button and timer
            targetEl.setAttribute("class", "incorrect");
            timerEl.setAttribute("class", "incorrect");
            // update counters
            incorrectAnswersCounter++;
            score -= scorePenalty
            // before updating timer, check if time remaining is greater than timePenalty
            if (timer > timePenalty) {
                timer -= timePenalty;
                timeRemainingEl.textContent = timer;
            } else {
                clearInterval(startTimer);
                timer = 0;
                timeRemainingEl.textContent = timer;
            }
        };

        // update currentQuestion counter
        currentQuestion++;

        // pause long enough for player to see if they were correct or incorrect
        setTimeout(function() {
            // remove color from timer
            timerEl.removeAttribute("class");

            // check there is time left
            if (timer === 0) {
                endQuiz(timesUpMessage);
            // check if there are more questions to answer
            } else if (currentQuestion < quizQuestions.length) {
                nextQuestion();
            } else {
                endQuiz(answeredAllMessage);
            }
        }, 500);  
    };
}

var nextQuestion = function () {
    // clear main content
    contentEl.innerHTML = "";
    optionsEl.innerHTML = "";

    // place current question in p tag and add to contentEl
    var questionEl = document.createElement("p");
    questionEl.textContent = quizQuestions[currentQuestion].question;
    contentEl.appendChild(questionEl);

    // loop through current question's options and create button for each
    for (var i = 0; i < quizQuestions[currentQuestion].options.length; i++) {
        var optionBtn = document.createElement("button");
        optionBtn.className = "answer-btn";
        optionBtn.textContent = quizQuestions[currentQuestion].options[i];
        optionsEl.appendChild(optionBtn);
    };
}

var endQuiz = function (message) {
    // stop and hide timer
    clearInterval(startTimer);
    timerEl.setAttribute("class", "hide");

    // show reloadBtn and change text to Try Again
    reloadBtn.setAttribute("class", "show");
    reloadBtn.textContent = "Try Again";

    // add score bonus for time remaining
    if (timer > 0) { score += timer };
    // if player earned negative points, reset score to 0
    if (score < 0) { score = 0 };

    // clear main content
    contentEl.innerHTML = "";
    optionsEl.innerHTML = "";

    // add end quiz header
    var endHeaderEl = document.createElement("h2");
    endHeaderEl.textContent = message;
    contentEl.appendChild(endHeaderEl);

    // add player's score
    var playerScoreEl = document.createElement("h3");
    playerScoreEl.textContent = "You finished with " + score + " points!";
    contentEl.appendChild(playerScoreEl);

    // add player's detailed stats
    var playerDetailsEl = document.createElement("p");
    playerDetailsEl.textContent = "You answered " + correctAnswersCounter + " questions correctly with " + timer + " seconds remaining. You made " + incorrectAnswersCounter + " mistakes.";
    contentEl.appendChild(playerDetailsEl);

    // add instructions for player to submit name
    var namecontentEl = document.createElement("p");
    namecontentEl.textContent = "Enter your name to save your score.";
    contentEl.appendChild(namecontentEl);

    // add form for player to enter name
    var nameForm = document.createElement("form");
    var nameInput = document.createElement("input");
    var nameSubmit = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "player-name");
    nameInput.setAttribute("placeholder", "Your Name");
    nameSubmit.setAttribute("type", "submit");
    nameSubmit.setAttribute("value", "Submit");
    nameForm.appendChild(nameInput);
    nameForm.appendChild(nameSubmit);
    optionsEl.appendChild(nameForm);

    // set focus on name input
    nameInput.focus();

    // add event listener to form
    nameForm.addEventListener("submit", function(event) {
        event.preventDefault();
        saveScore();
        viewHighScores();
    });
}

// push scores from localStorage into scoresArr
var loadScores = function () {
    // reset scoresArr with scores from local storage
    scoresArr = [];
    var savedScores = localStorage.getItem("scores");

    // if there are no saved scores, return out of function
    if (!savedScores) {
        return false;
    } else {
        // parse savedScores into an array of objects
        savedScores = JSON.parse(savedScores);

        // loop through objects in savedScores and push into scoresArr
        for (var i = 0; i < savedScores.length; i++) {
            scoresArr.push(savedScores[i]);
        }
    };
}

var saveScore = function () {
    // update scoresArr
    loadScores();

    // set playerStats object properties
    var playerName = document.querySelector("input[name='player-name']").value;
    // if player leaves name blank, set name to 'Anonymous'
    if (!playerName) { playerName = "Anonymous" };
    var playerStats = {
        name: playerName,
        score: score
    };

    // push playerStats into scoresArr
    scoresArr.push(playerStats);

    // sort scoresArr by score
    scoresArr.sort(function (a, b) { return b.score - a.score });

    // overwrite scores array in localStorage with scoresArr
    localStorage.setItem("scores", JSON.stringify(scoresArr));
}

var viewHighScores = function() {
    //update scoresArr
    loadScores();
    
    // stop and hide timer
    clearInterval(startTimer);
    timerEl.setAttribute("class", "hide");

    // hide viewScoresBtn
    viewScoresBtn.setAttribute("class", "hide");

    // set and show reloadBtn
    reloadBtn.textContent = "Back to Quiz";
    reloadBtn.setAttribute("class", "show");
    
    // clear main content
    contentEl.innerHTML = "";
    optionsEl.innerHTML = "";

    // add high scores header
    var scoresHeaderEl = document.createElement("h2");
    scoresHeaderEl.textContent = "High Scores";
    contentEl.appendChild(scoresHeaderEl);

    // setup high scores table
    var scoresTableEl = document.createElement("table");
    scoresTableEl.id = "high-scores";
    contentEl.appendChild(scoresTableEl);
    var scoresTitleRowEl = document.createElement("tr");
    scoresTableEl.appendChild(scoresTitleRowEl);
    var rankTitleEl = document.createElement("th");
    rankTitleEl.textContent = "Rank";
    scoresTitleRowEl.appendChild(rankTitleEl);
    var nameTitleEl = document.createElement("th");
    nameTitleEl.textContent = "Player Name";
    scoresTitleRowEl.appendChild(nameTitleEl);
    var scoreTitleEl = document.createElement("th");
    scoreTitleEl.textContent = "Score";
    scoresTitleRowEl.appendChild(scoreTitleEl);

    // loop through scoresArr and add tr for each score
    for (var i = 0; i < scoresArr.length; i++) {
        // create tr
        var rowEl = document.createElement("tr");
        rowEl.innerHTML = "<td>#" + (i + 1) + "</td><td>" + scoresArr[i].name + "</td><td>" + scoresArr[i].score + "</td>";
        scoresTableEl.appendChild(rowEl);
    };
}

var reload = function() {
    location.reload();
}

startBtn.addEventListener("click", startQuiz);

optionsEl.addEventListener("click", answerQuestion);

viewScoresBtn.addEventListener("click", viewHighScores);

reloadBtn.addEventListener("click", reload);