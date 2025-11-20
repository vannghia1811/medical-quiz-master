import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
}

export const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-2" />
      <p className="text-sm text-muted-foreground text-center">
        Hoàn thành {current}/{total} câu hỏi ({Math.round(percentage)}%)
      </p>
    </div>
  );
};
