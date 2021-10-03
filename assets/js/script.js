/*** QUIZ SETTINGS ***/
// Set, in seconds, time given to finish quiz
var timeGiven = 100;

// Set, in seconds, time penalty for answering incorrectly
var timePenalty = 10;

// Set, in seconds, time rewarded for answering correctly
var timeReward = 5;

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
        } else {
            console.log("Sorry, that's incorrect. You lose " + timePenalty + " seconds");
            // add 1 to incorrectAnswersCounter
            incorrectAnswersCounter++;
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

    // set player's score (give player 100 points for each question answered correctly, -50 for each incorrect answer + bonus for time remaining)
    var score = (correctAnswersCounter * 100) - (incorrectAnswersCounter * 50) + timer;
    // if player earned negative points, reset score to 0
    if (score < 0) { score = 0 };
    console.log(score);

    // Save player's score
    saveScore(score);

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
    nameInput.setAttribute("placeholder", "Your Name");
    nameSubmit.setAttribute("type", "submit");
    nameSubmit.setAttribute("value", "Submit");
    nameForm.appendChild(nameInput);
    nameForm.appendChild(nameSubmit);
    optionsEl.appendChild(nameForm);
}

// Save player's score to localStorage
var saveScore = function (playerScore) {
    var playerName = window.prompt("Enter your name to save your score.");
    // if player leaves name blank, set name to 'Anonymous'
    if (!playerName) { playerName = "Anonymous" };

    var playerStats = {
        name: playerName,
        score: playerScore
    }

    // push playerStats into scores array
    newScores.push(playerStats);

    // sort newScores by score
    newScores.sort(function (a, b) { return b.score - a.score });
    console.log(newScores);

    // overwrite scores array in localStorage with newScores array
    localStorage.setItem("scores", JSON.stringify(newScores));
}

startBtn.addEventListener("click", startQuiz);

optionsEl.addEventListener("click", answerQuestion);