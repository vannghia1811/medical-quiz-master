import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Target } from "lucide-react";
import { QuizConfig } from "@/pages/Index";

interface SmartPracticeTabProps {
  onStartQuiz: (config: QuizConfig) => void;
}

export const SmartPracticeTab = ({ onStartQuiz }: SmartPracticeTabProps) => {
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [quizSets, setQuizSets] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load quiz sets
    const stored = localStorage.getItem("customQuizSets");
    if (stored) {
      const sets = JSON.parse(stored);
      setQuizSets(Object.keys(sets));
    }

    // Analyze weak areas from history
    const history = localStorage.getItem("quizHistory");
    if (history) {
      const historyData = JSON.parse(history);
      const scores = historyData.reduce((acc: any, item: any) => {
        if (!acc[item.quizName]) {
          acc[item.quizName] = [];
        }
        acc[item.quizName].push((item.score / item.totalQuestions) * 100);
        return acc;
      }, {});

      const weak = Object.keys(scores)
        .filter(name => {
          const avg = scores[name].reduce((a: number, b: number) => a + b, 0) / scores[name].length;
          return avg < 70;
        })
        .slice(0, 3);

      setWeakAreas(weak);
    }
  };

  const startQuickPractice = (setName: string, count: number = 10) => {
    onStartQuiz({
      setName,
      questionCount: count,
      timeInMinutes: count
    });
  };

  const startFocusedPractice = () => {
    if (weakAreas.length === 0) {
      return;
    }
    startQuickPractice(weakAreas[0], 15);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Luyện tập thông minh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Hệ thống phân tích kết quả của bạn và đề xuất các bài luyện tập phù hợp
          </p>

          {weakAreas.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                Các chủ đề cần ôn luyện
              </h3>
              {weakAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border"
                >
                  <span className="font-medium">{area}</span>
                  <Button
                    size="sm"
                    onClick={() => startQuickPractice(area, 15)}
                    className="bg-gradient-to-r from-accent to-primary"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Luyện ngay
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có dữ liệu để phân tích. Hãy làm vài bài quiz trước!
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Luyện tập nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizSets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có bộ đề nào. Hãy nhập câu hỏi trước!
            </p>
          ) : (
            <div className="grid gap-3">
              {quizSets.map((setName, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{setName}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startQuickPractice(setName, 5)}
                    >
                      5 câu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startQuickPractice(setName, 10)}
                    >
                      10 câu
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => startQuickPractice(setName, 20)}
                    >
                      20 câu
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
