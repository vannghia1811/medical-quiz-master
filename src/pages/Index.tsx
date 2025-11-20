import { useState } from "react";
import { StartScreen } from "@/components/quiz/StartScreen";
import { QuizSetupScreen } from "@/components/quiz/QuizSetupScreen";
import { QuizScreen } from "@/components/quiz/QuizScreen";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";
import { Header } from "@/components/quiz/Header";

export type Screen = "start" | "setup" | "quiz" | "results";

export interface QuizSet {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizConfig {
  setName: string;
  questionCount: number;
  timeInMinutes: number;
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  timeTaken: string;
  userAnswers: (number | null)[];
  questions: QuizSet[];
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("start");
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const handleStartQuiz = (config: QuizConfig) => {
    setQuizConfig(config);
    setCurrentScreen("quiz");
  };

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setCurrentScreen("results");
  };

  const handleRestart = () => {
    setQuizConfig(null);
    setQuizResults(null);
    setCurrentScreen("start");
  };

  const handleBackToSetup = () => {
    setCurrentScreen("setup");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header />
        
        {currentScreen === "start" && (
          <StartScreen onContinue={() => setCurrentScreen("setup")} />
        )}
        
        {currentScreen === "setup" && (
          <QuizSetupScreen 
            onStartQuiz={handleStartQuiz}
            onBack={() => setCurrentScreen("start")}
          />
        )}
        
        {currentScreen === "quiz" && quizConfig && (
          <QuizScreen 
            config={quizConfig}
            onComplete={handleQuizComplete}
            onBack={handleBackToSetup}
          />
        )}
        
        {currentScreen === "results" && quizResults && (
          <ResultsScreen 
            results={quizResults}
            onRestart={handleRestart}
            onReview={handleBackToSetup}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
