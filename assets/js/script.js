/*** QUIZ SETTINGS ***/
// Set, in seconds, time given to finish quiz
var timeGiven = 100;

// Set penalties for answering incorrectly
var timePenalty = 10;
var scorePenalty = 50;

// Set rewards for answering correctly
var timeReward = 5;
var scoreReward = 100;

// Set message to display if player runs out of time
var timesUpMessage = "Time's Up!"

// Set message to display if player answeres all questions before time runs out
var answeredAllMessage = "Excellent!"

// Set quiz questions
var quizQuestions = [
    {
        question: "Question 1",
        options: [
            "Correct",
            "Incorrect",
            "Another incorrect",
            "Incorrect again"
        ],
        answer: "Correct"
    },
    {
        question: "Question 2",
        options: [
            "Right answer",
            "Wrong again",
            "Another wrong answer",
            "This is wrong, too."
        ],
        answer: "Right answer"
    },
    {
        question: "Question 3",
        options: [
            "True statement",
            "False statement",
            "Another false statement",
            "This statement is false, too."
        ],
        answer: "True statement"
    }
];
/*** END QUIZ SETTINGS ***/

/*** QUIZ SETUP AND VARIABLE DECLARATIONS ***/
// randomize order of quiz questions
quizQuestions.sort(function (a, b) { return 0.5 - Math.random() });

// Setup timer
var timer = timeGiven;
var timeRemainingEl = document.querySelector("#time-remaining");
timeRemainingEl.textContent = timer;
// Declare startTimer variable globally, so other functions can clear interval
var startTimer;

// Store #quiz-content elements in variables
var mainEl = document.querySelector("main");
var promptEl = document.querySelector("#prompt");
var optionsEl = document.querySelector("#options");
var startBtn = document.querySelector("#start-btn");

// Add instructions to page
var instructionsEl = document.querySelector("#instructions");
instructionsEl.textContent = "You have " + timeGiven + " seconds to answer " + quizQuestions.length + " questions.";

// Set currentQuestion counter
var currentQuestion = 0;

// Set counter to track number of questions anwered correctly and incorrectly
var correctAnswersCounter = 0;
var incorrectAnswersCounter = 0;

// Declare score variable globally so multiple functions can access it
var score = 0;

// Create array to store any new scores, and load any scores from localStorage into it
var newScores = []
var loadScores = function () {
    var savedScores = localStorage.getItem("scores");

    // if there are no saved scores, return out of function
    if (!savedScores) {
        return false;
    } else {
        // parse savedScores into an array of objects
        savedScores = JSON.parse(savedScores);

        // Loop through objects in savedScores and push into newScores
        for (var i = 0; i < savedScores.length; i++) {
            newScores.push(savedScores[i]);
        }
    }
}
loadScores();
/*** END QUIZ SETUP AND VARIABLE DECLARATIONS ***/

// Start Quiz Function - To call when start button is clicked
var startQuiz = function () {
    // start timer
    startTimer = setInterval(function () {
        timer--;
        timeRemainingEl.textContent = timer;
        // when timer runs out, stop timer and end quiz
        if (timer === 0) {
            clearInterval(startTimer);
            endQuiz(timesUpMessage);
        }
    }, 1000)

    // call first question
    nextQuestion();
}

// Answer Question Function - To call when a question is answered
var answerQuestion = function (event) {
    // check if a question button was clicked before proceeding
    var targetEl = event.target;
    if (targetEl.matches(".question-btn")) {
        // check if answered correctly
        var pickedAnswer = targetEl.textContent;
        var correctAnswer = quizQuestions[currentQuestion].answer;
        if (pickedAnswer === correctAnswer) {
            console.log("Correct! You added " + timeReward + " seconds to the clock!");
            // add 1 to correctAnswersCounter
            correctAnswersCounter++;
            // add timeReward to timer
            timer += timeReward;
            // add scoreReward to score
            score += scoreReward;
        } else {
            console.log("Sorry, that's incorrect. You lose " + timePenalty + " seconds");
            // add 1 to incorrectAnswersCounter
            incorrectAnswersCounter++;
            // subtract scorePenalty from score
            score -= scorePenalty
            // check if time remaining is greater than timePenalty
            if (timer > timePenalty) {
                // subtract time penalty from timer
                timer -= timePenalty;
                // add question back into rotation
                quizQuestions.push(quizQuestions[currentQuestion]);
            } else {
                // set timer to zero and end quiz
                timer = 0;
                endQuiz(timesUpMessage);
                return false;
            }
        }

        // update currentQuestion counter
        currentQuestion++;

        // if there are more questions to answer, go to next question
        if (currentQuestion < quizQuestions.length) {
            nextQuestion();
        } else {
            endQuiz(answeredAllMessage);
        }
    }
}

// Next Question Function - To call at start of quiz and after each question is answered
var nextQuestion = function () {
    // clear #quiz-content
    promptEl.innerHTML = "";
    optionsEl.innerHTML = "";

    // place current question in p tag and add to promptEl
    var questionEl = document.createElement("p");
    questionEl.textContent = quizQuestions[currentQuestion].question;
    promptEl.appendChild(questionEl);

    // loop through current question's options and create button for each
    for (var i = 0; i < quizQuestions[currentQuestion].options.length; i++) {
        var optionBtn = document.createElement("button");
        optionBtn.className = "question-btn";
        optionBtn.textContent = quizQuestions[currentQuestion].options[i];
        optionsEl.appendChild(optionBtn);
    }
}

// End Quiz Function - To call when timer or questions run out
var endQuiz = function (message) {
    // stop timer and display final time remaining
    clearInterval(startTimer);
    timeRemainingEl.textContent = timer;

    // add score bonus for time remaining
    if (timer > 0) { score += timer };
    // if player earned negative points, reset score to 0
    if (score < 0) { score = 0 };
    console.log(score);

    // clear #quiz-content
    promptEl.innerHTML = "";
    optionsEl.innerHTML = "";

    // add end quiz header
    var endHeaderEl = document.createElement("h2");
    endHeaderEl.textContent = message;
    promptEl.appendChild(endHeaderEl);

    // add player's score
    var playerScoreEl = document.createElement("h3");
    playerScoreEl.textContent = "You finished with " + score + " points!";
    promptEl.appendChild(playerScoreEl);

    // add player's detailed stats
    var playerDetailsEl = document.createElement("p");
    playerDetailsEl.textContent = "You answered " + correctAnswersCounter + " questions correctly with " + timer + " seconds remaining. You made " + incorrectAnswersCounter + " mistakes.";
    promptEl.appendChild(playerDetailsEl);

    // add instructions for player to submit name
    var namePromptEl = document.createElement("p");
    namePromptEl.textContent = "Enter your name to save your score."
    promptEl.appendChild(namePromptEl);

    // add form for player to enter name
    var nameForm = document.createElement("form");
    var nameInput = document.createElement("input")
    var nameSubmit = document.createElement("input")
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
    nameForm.addEventListener("submit", saveScore);
}

// Save player's score to localStorage
var saveScore = function (event) {
    event.preventDefault();
    var playerName = document.querySelector("input[name='player-name']").value;
    // if player leaves name blank, set name to 'Anonymous'
    if (!playerName) { playerName = "Anonymous" };

    var playerStats = {
        name: playerName,
        score: score
    }

    // push playerStats into scores array
    newScores.push(playerStats);

    // sort newScores by score
    newScores.sort(function (a, b) { return b.score - a.score });
    console.log(newScores);

    // overwrite scores array in localStorage with newScores array
    localStorage.setItem("scores", JSON.stringify(newScores));

    viewHighScores();
}

// View High Scores Function - Call when button clicked or player saves their score
var viewHighScores = function() {    
    // clear main content
    mainEl.innerHTML = "";

    // setup high scores table
    var scoresTableEl = document.createElement("table");
    scoresTableEl.id = "high-scores"
    mainEl.appendChild(scoresTableEl);
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

    // loop through newScores (which has already been loaded with saved scores) and add tr for each score
    for (var i = 0; i < newScores.length; i++) {
        // create tr
        var rowEl = document.createElement("tr");
        rowEl.innerHTML = "<td>#" + (i + 1) + "</td><td>" + newScores[i].name + "</td><td>" + newScores[i].score + "</td>";
        scoresTableEl.appendChild(rowEl);
    }
}

startBtn.addEventListener("click", startQuiz);

optionsEl.addEventListener("click", answerQuestion);