import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";

interface QuizActionsProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
}

export const QuizActions = ({ currentIndex, totalQuestions, onPrevious, onNext, onSave, onSubmit }: QuizActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        variant="outline"
        className="flex-1 min-w-[140px]"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Câu trước
      </Button>

      <Button
        onClick={onSave}
        variant="secondary"
        className="flex-1 min-w-[140px]"
      >
        <Save className="mr-2 h-4 w-4" /> Lưu tiến trình
      </Button>

      <Button
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1}
        variant="outline"
        className="flex-1 min-w-[140px]"
      >
        Câu tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
      </Button>

      <Button
        onClick={onSubmit}
        className="w-full bg-gradient-to-r from-success to-accent hover:opacity-90"
      >
        <Send className="mr-2 h-4 w-4" /> Nộp bài
      </Button>
    </div>
  );
};
