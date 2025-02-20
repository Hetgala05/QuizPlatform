import React, { useState, useEffect } from 'react';

// Questions Array
const questions = [
  {
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    answer: 1,
  },
  {
    question: 'Which data structure organizes items in a First-In, First-Out (FIFO) manner?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    answer: 1,
  },
  {
    question: 'Which of the following is primarily used for structuring web pages?',
    options: ['Python', 'Java', 'HTML', 'C++'],
    answer: 2,
  },
  {
    question: 'Which chemical symbol stands for Gold?',
    options: ['Au', 'Gd', 'Ag', 'Pt'],
    answer: 0,
  },
  {
    question: 'Which of these processes is not typically involved in refining petroleum?',
    options: ['Fractional distillation', 'Cracking', 'Polymerization', 'Filtration'],
    answer: 3,
  },
  {
    question: 'What is the value of 12 + 28?',
    isInteger: true,
    answer: '40',
  },
  {
    question: 'How many states are there in the United States?',
    isInteger: true,
    answer: '50',
  },
  {
    question: 'In which year was the Declaration of Independence signed?',
    isInteger: true,
    answer: '1776',
  },
  {
    question: 'What is the value of pi rounded to the nearest integer?',
    isInteger: true,
    answer: '3',
  },
  {
    question: 'If a car travels at 60 mph for 2 hours, how many miles does it travel?',
    isInteger: true,
    answer: '120',
  },
];

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<
    { index: number; status: 'correct' | 'incorrect' | 'unanswered' }[]
  >([]);
  const [attemptHistory, setAttemptHistory] = useState<
    { attemptNumber: number; question: string; selected: string; correct: string }[]
  >([]);
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      handleNextQuestion();
    }
  }, [timer]);

  const handleNextQuestion = () => {
    const current = questions[currentQuestion];
    const isAnswered = current.isInteger
      ? userInput.trim() !== ''
      : selectedOption !== null;

    const isCorrect = isAnswered
      ? current.isInteger
        ? userInput.trim() === current.answer
        : selectedOption === current.answer
      : false;

    const status = isAnswered ? (isCorrect ? 'correct' : 'incorrect') : 'unanswered';

    setCompletedQuestions((prev) => [
      ...prev,
      { index: currentQuestion, status },
    ]);

    // Save to attempt history
    setAttemptHistory((prev) => [
      ...prev,
      {
        attemptNumber: attempt,
        question: current.question,
        selected: current.isInteger
          ? userInput.trim() || 'Not Answered'
          : selectedOption !== null
          ? current.options[selectedOption]
          : 'Not Answered',
        correct: current.isInteger ? current.answer : current.options[current.answer],
      },
    ]);

    if (isCorrect) setScore((prev) => prev + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setUserInput('');
      setTimer(30);
    } else {
      setShowScore(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setUserInput('');
    setTimer(30);
    setScore(0);
    setShowScore(false);
    setCompletedQuestions([]);
    setAttempt((prev) => prev + 1);
  };

  return (
    <div
      className={`flex flex-col lg:flex-row ${
        showScore ? 'bg-gray-900 h-screen' : 'bg-black min-h-screen'
      } text-white lg:justify-between lg:items-center`}
    >
      <QuizContent
        questions={questions}
        currentQuestion={currentQuestion}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        userInput={userInput}
        setUserInput={setUserInput}
        timer={timer}
        handleNextQuestion={handleNextQuestion}
        showScore={showScore}
        score={score}
        handleRetry={handleRetry}
        attemptHistory={attemptHistory}
        attempt={attempt}
      />
      {!showScore && (
        <QuestionSidebar
          questions={questions}
          completedQuestions={completedQuestions}
        />
      )}
    </div>
  );
};

const QuizContent: React.FC<any> = ({
  questions,
  currentQuestion,
  selectedOption,
  setSelectedOption,
  userInput,
  setUserInput,
  timer,
  handleNextQuestion,
  showScore,
  score,
  handleRetry,
  attemptHistory,
  attempt,
}) => (
  <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-xl w-full mx-auto flex items-center justify-center lg:h-[80vh]">
    <div>
      {showScore ? (
        <div className="text-center w-full h-full flex flex-col justify-center">
          <h1 className="text-3xl font-bold">Quiz Completed!</h1>
          <p className="text-xl mt-4">Your Score: {score}/{questions.length}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
            onClick={handleRetry}
          >
            Attempt Again
          </button>
          <div className="mt-6 text-left">
            <h2 className="text-lg font-bold mb-4">Attempt History:</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              {Array.from(
                new Set(attemptHistory.map((item) => item.attemptNumber))
              ).map((attemptNumber) => (
                <div key={attemptNumber} className="mb-4">
                  <h3 className="font-semibold text-white mb-2">
                    Attempt {attemptNumber}
                  </h3>
                  <ul className="list-disc list-inside text-gray-300">
                    {attemptHistory
                      .filter((item) => item.attemptNumber === attemptNumber)
                      .map((item, index) => (
                        <li key={index}>
                          <strong>{item.question}</strong>: {item.selected}{' '}
                          {'{'}
                          {item.correct}
                          {'}'}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold">
            Attempt {attempt} - Question {currentQuestion + 1}/{questions.length}
          </h2>
          <p className="mt-2 text-gray-300 text-xl">{questions[currentQuestion].question}</p>
          <div className="space-y-6 mt-4">
            {questions[currentQuestion].isInteger ? (
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-4 border rounded-lg text-xl bg-gray-700 text-white"
                placeholder="Enter your answer"
              />
            ) : (
              questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 border rounded-lg text-xl font-medium ${
                    selectedOption === index
                      ? 'bg-blue-300 border-blue-500 text-blue-900 font-bold'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-400 text-lg">Time Left: {timer}s</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleNextQuestion}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const QuestionSidebar: React.FC<any> = ({ questions, completedQuestions }) => (
  <div className="bg-gray-800 shadow-md rounded-lg p-4 lg:w-72 w-full lg:fixed lg:right-6 lg:top-1/2 transform lg:-translate-y-1/2 mx-auto mt-6 lg:mt-0">
    <h3 className="text-lg font-bold mb-4 text-center">Questions</h3>
    <div className="grid grid-cols-3 gap-4">
      {questions.map((_, index) => {
        const status = completedQuestions.find((item) => item.index === index)?.status || 'unvisited';
        return (
          <div
            key={index}
            className={`w-12 h-12 flex items-center justify-center rounded-full ${
              status === 'correct'
                ? 'bg-green-500 text-white'
                : status === 'incorrect'
                ? 'bg-red-500 text-white'
                : status === 'unanswered'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-700 border border-gray-500 text-white'
            }`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  </div>
);

export default Quiz;
