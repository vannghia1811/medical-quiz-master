import { Clock } from "lucide-react";

interface QuizTimerProps {
  timeLeft: number;
}

export const QuizTimer = ({ timeLeft }: QuizTimerProps) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 60;

  return (
    <div className={`flex items-center gap-2 font-semibold text-lg ${isLowTime ? 'text-destructive animate-pulse' : 'text-primary'}`}>
      <Clock className="h-5 w-5" />
      <span>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};
