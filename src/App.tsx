import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";

type lineProps = {
  line: string;
  randomWord: string;
  currentLineIndex: boolean;
};
function App() {
  const [randomWord, setRandomWord] = useState<string>("");
  const [guesses, setGuesses] = useState(new Array(5).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [won, setWon] = useState(false);
  console.log(randomWord);

  useEffect(() => {
    const fetchRandomWord = async () => {
      const res = await fetch(
        "https://random-word-api.herokuapp.com/word?length=5"
      );
      const data = await res.json();
      setRandomWord(data[0].toLowerCase());
    };
    fetchRandomWord();
  }, []);

  useEffect(() => {
    const idx = guesses.findIndex((item) => item === null);
    const handleKeyDown = (e: KeyboardEvent) => {

      if (won) return;
      if (e.key === "Backspace") {
        if (currentGuess.length === 0) return;
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        if (currentGuess.length < 5) return;      
        setGuesses((prev) =>
          prev.map((item, index) => (index === idx ? currentGuess : item))
        );
        setWon(currentGuess === randomWord);
        setCurrentGuess("");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length === 5) return;
        setCurrentGuess((prev) => (prev += e.key));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess,guesses, randomWord, won]);
  const idx = guesses.findIndex((item) => item === null);

  return (
    <div className="w-100% h-screen flex items-center justify-center font-bold">
      <div className="flex flex-col gap-3">
        {won && <div className="text-3xl text-green-500">You Won!!</div>}
        {guesses.slice(0, 5).map((item, index) => {
          return (
            <Line
              key={index}
              randomWord={randomWord}
              line={index === idx ? currentGuess : item ? item : ""}
              currentLineIndex={idx === index}
            />
          );
        })}
        {currentGuess}
      </div>
    </div>
  );
}

export default App;

const Line = ({ line, randomWord, currentLineIndex }: lineProps) => {
  const arr = Array(5).fill(null);
  return (
    <div className="flex gap-3">
      {arr.map((_, index) => (
        <div
          key={index}
          className={`w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center text-4xl 
            ${
              currentLineIndex
                ? styles.absentChar
                : randomWord[index] === line[index] && line[index]
                ? styles.correctChar
                : randomWord.includes(line[index])
                ? styles.wrongPostionChar
                : line[index]? styles.wrongChar
                : styles.absentChar
            }
            `}
        >
          {!line ? undefined : line[index] || undefined}
        </div>
      ))}
    </div>
  );
};

const styles = {
  correctChar: "bg-green-500",
  wrongPostionChar: "bg-yellow-500",
  absentChar: "bg-gray-200",
  wrongChar: "bg-red-400",
};
