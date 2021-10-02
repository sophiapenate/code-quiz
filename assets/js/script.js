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

var nextQuestion = function() {
    // replace #quiz-content with current question content
    promptTitleEl.textContent = quizQuestions[currentQuestion].question;
    optionsListEl.innerHTML = "";
    
    // loop through current question's options and create button for each
    for (var i = 0; i < quizQuestions[currentQuestion].options.length; i++) {
        var optionBtn = document.createElement("button");
        optionBtn.className = "question-btn";
        optionBtn.textContent = quizQuestions[currentQuestion].options[i];
        optionsListEl.appendChild(optionBtn);
    }

    // update currentQuestion counter
    currentQuestion++;

    // when any answer is selected, go to next question
    // ADD CONDITION: DON'T TRY TO PULL ANOTHER QUESTION IF WE'RE AT THE END OF THE ARRAY
    // MOVE THIS INTO ITS OWN FUNCTION
    optionsListEl.addEventListener("click", function(event) {
        var targetEl = event.target;
        if (targetEl.matches(".question-btn")) {
            nextQuestion();
        }
    })
}

startBtn.addEventListener("click", startQuiz);
