import { Button } from "@/components/ui/button";
import { QuizSet } from "@/pages/Index";

interface QuizNavigationProps {
  questions: QuizSet[];
  currentIndex: number;
  userAnswers: (number | null)[];
  onNavigate: (index: number) => void;
}

export const QuizNavigation = ({ questions, currentIndex, userAnswers, onNavigate }: QuizNavigationProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center p-4 bg-card rounded-xl shadow-md">
      {questions.map((_, index) => {
        const isAnswered = userAnswers[index] !== null;
        const isCurrent = index === currentIndex;

        return (
          <Button
            key={index}
            onClick={() => onNavigate(index)}
            variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
            size="sm"
            className={`w-10 h-10 ${isCurrent ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
          >
            {index + 1}
          </Button>
        );
      })}
    </div>
  );
};
