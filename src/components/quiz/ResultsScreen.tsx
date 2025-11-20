import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResults } from "@/pages/Index";
import { Trophy, RefreshCw, BookOpen, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResultsScreenProps {
  results: QuizResults;
  onRestart: () => void;
  onReview: () => void;
}

export const ResultsScreen = ({ results, onRestart, onReview }: ResultsScreenProps) => {
  const percentage = Math.round((results.score / results.totalQuestions) * 100);
  
  const getMessage = () => {
    if (percentage >= 90) return "Xuất sắc! 🎉";
    if (percentage >= 70) return "Tốt lắm! 👍";
    if (percentage >= 50) return "Khá! Cố gắng thêm nhé!";
    return "Cần ôn tập thêm!";
  };

  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-info text-primary-foreground rounded-t-xl">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl mb-2">Kết Quả Bài Làm</CardTitle>
          <div className="text-5xl font-bold my-4">
            {results.score}/{results.totalQuestions}
          </div>
          <p className="text-xl opacity-95">{getMessage()}</p>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-success/10 border-success">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckCircle2 className="h-12 w-12 text-success mb-2" />
                <div className="text-3xl font-bold text-success">{results.correctCount}</div>
                <div className="text-sm text-muted-foreground">Câu đúng</div>
              </CardContent>
            </Card>

            <Card className="bg-destructive/10 border-destructive">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <XCircle className="h-12 w-12 text-destructive mb-2" />
                <div className="text-3xl font-bold text-destructive">{results.incorrectCount}</div>
                <div className="text-sm text-muted-foreground">Câu sai</div>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Clock className="h-12 w-12 text-primary mb-2" />
                <div className="text-3xl font-bold text-primary">{results.timeTaken}</div>
                <div className="text-sm text-muted-foreground">Thời gian</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Xem lại các câu hỏi
            </h3>
            
            {results.questions.map((question, index) => {
              const userAnswer = results.userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={isCorrect ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge variant={isCorrect ? "default" : "destructive"} className="mt-1">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.question}</p>
                        <div className="space-y-1 text-sm">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer = question.correctAnswer === optIndex;
                            
                            return (
                              <div 
                                key={optIndex}
                                className={`p-2 rounded ${
                                  isCorrectAnswer ? "bg-success/20 text-success font-medium" : 
                                  isUserAnswer ? "bg-destructive/20 text-destructive" : 
                                  "text-muted-foreground"
                                }`}
                              >
                                {option}
                                {isCorrectAnswer && " ✓"}
                                {isUserAnswer && !isCorrectAnswer && " ✗"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 mt-8">
            <Button onClick={onRestart} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" /> Làm bài khác
            </Button>
            <Button onClick={onReview} className="flex-1 bg-gradient-to-r from-primary to-info">
              <BookOpen className="mr-2 h-4 w-4" /> Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
