import { useState } from "react";
import { ethicQuestions } from "../../utils/mockData";
import CardItem from "./cardItem";

export default function CardList() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastResult, setLastResult] = useState(null); // { correct: boolean, explanation: string }

  const current = ethicQuestions[index];

  const handleSwipe = (direction, card) => {
    const correctAnswer = card.correctOption === 1 ? "right" : "left";
    const isCorrect = direction === correctAnswer;

    if (isCorrect) setScore((s) => s + 1);

    setLastResult({ correct: isCorrect, explanation: card.explanation });

    // mostrar explicación un tiempo y pasar a la siguiente
    setTimeout(() => {
      setIndex((i) => i + 1);
      setLastResult(null);
    }, 3000);
  };

  if (!current) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-bold">
          Finished — Score: {score} / {ethicQuestions.length}
        </h2>
        <p className="text-gray-500">
          {Math.round((score / ethicQuestions.length) * 100)}%
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-2">
      <p className="text-sm text-gray-600">
        {index + 1} / {ethicQuestions.length}
      </p>

      <CardItem card={current} onSwipe={handleSwipe} lastResult={lastResult} />
    </div>
  );
}
