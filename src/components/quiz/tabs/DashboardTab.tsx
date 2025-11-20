import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Award, Clock } from "lucide-react";

interface QuizHistory {
  date: string;
  quizName: string;
  score: number;
  totalQuestions: number;
  timeTaken: string;
}

export const DashboardTab = () => {
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem("quizHistory");
    if (stored) {
      const historyData = JSON.parse(stored);
      setHistory(historyData);
      calculateStats(historyData);
    }
  };

  const calculateStats = (historyData: QuizHistory[]) => {
    if (historyData.length === 0) {
      setStats({
        totalQuizzes: 0,
        totalQuestions: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0
      });
      return;
    }

    const totalQuizzes = historyData.length;
    const totalQuestions = historyData.reduce((sum, h) => sum + h.totalQuestions, 0);
    const totalCorrect = historyData.reduce((sum, h) => sum + h.score, 0);
    const averageScore = Math.round((totalCorrect / totalQuestions) * 100);
    const bestScore = Math.max(...historyData.map(h => Math.round((h.score / h.totalQuestions) * 100)));
    
    const totalTimeSpent = historyData.reduce((sum, h) => {
      const [min, sec] = h.timeTaken.split(':').map(Number);
      return sum + (min * 60) + sec;
    }, 0);

    setStats({
      totalQuizzes,
      totalQuestions,
      averageScore,
      bestScore,
      totalTimeSpent
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Tổng số bài
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalQuizzes}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-success" />
              Điểm trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.averageScore}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Điểm cao nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.bestScore}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-info" />
              Thời gian luyện tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">{formatTime(stats.totalTimeSpent)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử làm bài</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có lịch sử làm bài. Hãy bắt đầu làm bài quiz đầu tiên!
            </p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).reverse().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.quizName}</div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {Math.round((item.score / item.totalQuestions) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.score}/{item.totalQuestions}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.timeTaken}
                    </div>
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
