import { useState, useEffect } from "react";
import { QuizConfig, QuizSet, QuizResults } from "@/pages/Index";
import { QuizTimer } from "./quiz-components/QuizTimer";
import { QuizProgress } from "./quiz-components/QuizProgress";
import { QuizNavigation } from "./quiz-components/QuizNavigation";
import { QuestionDisplay } from "./quiz-components/QuestionDisplay";
import { QuizActions } from "./quiz-components/QuizActions";
import { useToast } from "@/hooks/use-toast";

interface QuizScreenProps {
  config: QuizConfig;
  onComplete: (results: QuizResults) => void;
  onBack: () => void;
}

export const QuizScreen = ({ config, onComplete, onBack }: QuizScreenProps) => {
  const [questions, setQuestions] = useState<QuizSet[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.timeInMinutes * 60);
  const [startTime] = useState(Date.now());
  const { toast } = useToast();

  useEffect(() => {
    // Load questions from localStorage
    const stored = localStorage.getItem("customQuizSets");
    if (stored) {
      const quizSets = JSON.parse(stored);
      const allQuestions = quizSets[config.setName] || [];
      
      // Shuffle and select questions
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, config.questionCount);
      
      setQuestions(selected);
      setUserAnswers(new Array(selected.length).fill(null));
    }
  }, [config]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    const timeTaken = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });

    const results: QuizResults = {
      score: correctCount,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount: questions.length - correctCount,
      timeTaken,
      userAnswers,
      questions,
    };

    onComplete(results);
  };

  const handleSaveProgress = () => {
    const progress = {
      config,
      questions,
      userAnswers,
      currentQuestionIndex,
      timeLeft,
      startTime,
    };
    localStorage.setItem("quizProgress", JSON.stringify(progress));
    toast({
      title: "Đã lưu",
      description: "Tiến trình đã được lưu thành công!",
    });
  };

  if (questions.length === 0) {
    return <div>Đang tải câu hỏi...</div>;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between bg-card rounded-xl p-4 shadow-md">
        <QuizTimer timeLeft={timeLeft} />
        <div className="text-lg font-semibold">
          Câu {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>

      <QuizProgress 
        current={currentQuestionIndex + 1} 
        total={questions.length} 
      />

      <QuizNavigation
        questions={questions}
        currentIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        onNavigate={setCurrentQuestionIndex}
      />

      <QuestionDisplay
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        selectedAnswer={userAnswers[currentQuestionIndex]}
        onSelectAnswer={handleAnswerSelect}
      />

      <QuizActions
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
        onNext={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
        onSave={handleSaveProgress}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
