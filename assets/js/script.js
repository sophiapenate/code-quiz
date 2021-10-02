/*** QUIZ SETTINGS ***/

// Set, in seconds, time given to finish quiz
var timeGiven = 100;

// Set, in seconds, time penalty for answering incorrectly
var timePenalty = 10;

// Set, in seconds, time rewarded for answering correctly
var timeReward = 5;

// Set message to display if player runs out of time
var timesUpMessage = "Time's Up!"

// Set message to display if player answeres all questions
var answeredAllMessage = "Excellent! You answered every question!"

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

// Randomize quiz question order - push quizQuestions objects into a new array in a random order

// Set and display timer
var timer = timeGiven;
var timeRemainingEl = document.querySelector("#time-remaining");
timeRemainingEl.textContent = timer;
// Declare startTimer variable globally, so other functions can clear interval
var startTimer;

// Store #quiz-content elements in variables
var promptTitleEl = document.querySelector("#prompt-title");
var promptDetailsEl = document.querySelector("#prompt-details");
var startBtn = document.querySelector("#start-btn");
var optionsListEl = document.querySelector("#options");

// Set currentQuestion counter
var currentQuestion = 0;

// Start Quiz Function - To execute when start button is clicked
var startQuiz = function() {
    // start timer
    startTimer = setInterval(function() {
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

// Answer Question Function - To execute when a question is answered
var answerQuestion = function(event) {
    // check if a question button was clicked before proceeding
    var targetEl = event.target;
    if (targetEl.matches(".question-btn")) {
        // check if answered correctly
        var pickedAnswer = targetEl.textContent;
        var correctAnswer = quizQuestions[currentQuestion].answer;
        if (pickedAnswer === correctAnswer) {
            console.log("Correct!");
        } else {
            console.log("Sorry, that's incorrect. You lose " + timePenalty + " seconds");
            // check if time remaining is greater than timePenalty
            if (timer > timePenalty) {
                timer -= timePenalty;
            } else {
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
            // otherwise, end quiz
            endQuiz(answeredAllMessage);
        }
    }
}

// Next Question Function - To execute at start of quiz and after each question is answered
var nextQuestion = function() {
    // replace #quiz-content with current question content
    promptTitleEl.textContent = "Question " + (currentQuestion + 1);
    promptDetailsEl.textContent = quizQuestions[currentQuestion].question;
    optionsListEl.innerHTML = "";
    
    // loop through current question's options and create button for each
    for (var i = 0; i < quizQuestions[currentQuestion].options.length; i++) {
        var optionBtn = document.createElement("button");
        optionBtn.className = "question-btn";
        optionBtn.textContent = quizQuestions[currentQuestion].options[i];
        optionsListEl.appendChild(optionBtn);
    }
}

// End Quiz Function - To execute when timer or questions run out
var endQuiz = function(message) {
    // stop timer
    clearInterval(startTimer);

    // set player's score equal to time remaining
    var score = timer;

    promptTitleEl.textContent = message;
    promptDetailsEl.textContent = "Your score is " + score;
    optionsListEl.innerHTML = "";
}

startBtn.addEventListener("click", startQuiz);

optionsListEl.addEventListener("click", answerQuestion);