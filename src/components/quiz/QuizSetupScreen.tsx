import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { QuizConfig } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface QuizSetupScreenProps {
  onStartQuiz: (config: QuizConfig) => void;
  onBack: () => void;
}

export const QuizSetupScreen = ({ onStartQuiz, onBack }: QuizSetupScreenProps) => {
  const [quizSets, setQuizSets] = useState<Record<string, any[]>>({});
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeInMinutes, setTimeInMinutes] = useState<number>(15);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("customQuizSets");
    if (stored) {
      const sets = JSON.parse(stored);
      setQuizSets(sets);
      if (Object.keys(sets).length > 0) {
        setSelectedSet(Object.keys(sets)[0]);
      }
    }
  }, []);

  const handleStart = () => {
    if (!selectedSet) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn bộ câu hỏi!",
        variant: "destructive",
      });
      return;
    }

    if (questionCount < 1) {
      toast({
        title: "Lỗi",
        description: "Số câu hỏi phải lớn hơn 0!",
        variant: "destructive",
      });
      return;
    }

    const maxQuestions = quizSets[selectedSet]?.length || 0;
    if (questionCount > maxQuestions) {
      toast({
        title: "Lỗi",
        description: `Bộ đề chỉ có ${maxQuestions} câu hỏi!`,
        variant: "destructive",
      });
      return;
    }

    onStartQuiz({
      setName: selectedSet,
      questionCount,
      timeInMinutes,
    });
  };

  const maxQuestions = selectedSet ? quizSets[selectedSet]?.length || 0 : 0;

  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Thiết Lập Bài Kiểm Tra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quiz-set">Chọn bộ câu hỏi</Label>
            <Select value={selectedSet} onValueChange={setSelectedSet}>
              <SelectTrigger id="quiz-set">
                <SelectValue placeholder="Chọn bộ câu hỏi..." />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(quizSets).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name} ({quizSets[name].length} câu)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-count">
              Số câu hỏi muốn làm (Tối đa: {maxQuestions})
            </Label>
            <Input
              id="question-count"
              type="number"
              min={1}
              max={maxQuestions}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-time">Thời gian làm bài (phút)</Label>
            <Input
              id="quiz-time"
              type="number"
              min={1}
              max={180}
              value={timeInMinutes}
              onChange={(e) => setTimeInMinutes(parseInt(e.target.value) || 15)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay Lại
            </Button>
            <Button 
              onClick={handleStart} 
              className="flex-1 bg-gradient-to-r from-success to-accent hover:opacity-90"
            >
              <Play className="mr-2 h-4 w-4" /> Bắt Đầu Làm Bài
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
