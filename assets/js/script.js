// store quiz questions as objects in quizQuestions array
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

// Randomize quiz question order - push quizQuestions objects into a new array in a random order

// store #quiz-content elements in variables
var promptTitleEl = document.querySelector("#prompt-title");
var promptDetailsEl = document.querySelector("#prompt-details");
var startBtn = document.querySelector("#start-btn");
var optionsListEl = document.querySelector("#options");

// create currentQuestion counter and store in variable
var currentQuestion = 0;

var startQuiz = function() {
    nextQuestion();
}

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
            console.log("Sorry, that's incorrect.");
        }
        
        // update currentQuestion counter
        currentQuestion++;

        // if there are more questions to answer, go to next question
        if (currentQuestion < quizQuestions.length) {
            nextQuestion();
        } else {
            endQuiz();
        }
    }
}

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

var endQuiz = function() {
    promptTitleEl.textContent = "Game Over!";
    promptDetailsEl.textContent = "Your score is ";
    optionsListEl.innerHTML = "";
}

startBtn.addEventListener("click", startQuiz);

optionsListEl.addEventListener("click", answerQuestion);