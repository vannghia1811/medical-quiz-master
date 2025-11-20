import { Card, CardContent } from "@/components/ui/card";
import { QuizSet } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";

interface QuestionDisplayProps {
  question: QuizSet;
  questionNumber: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

export const QuestionDisplay = ({ question, questionNumber, selectedAnswer, onSelectAnswer }: QuestionDisplayProps) => {
  return (
    <Card className="shadow-xl animate-scale-in">
      <CardContent className="p-6">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-3">
            Câu {questionNumber}
          </Badge>
          <h3 className="text-xl font-semibold leading-relaxed">
            {question.question}
          </h3>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            
            return (
              <button
                key={index}
                onClick={() => onSelectAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md transform scale-[1.02]'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {option[0]}
                  </div>
                  <div className="flex-1 pt-1">
                    {option.substring(3)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
