import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ImportTab = () => {
  const [quizName, setQuizName] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const { toast } = useToast();

  const parseTextFormat = (text: string) => {
    const questions = [];
    const lines = text.split('\n');
    let currentQuestion: any = null;
    let optionCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      if (line.match(/^Câu\s+\d+\./)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        
        currentQuestion = {
          id: questions.length + 1,
          question: line.replace(/^Câu\s+\d+\.\s*/, ''),
          options: [],
          correctAnswer: null
        };
        optionCount = 0;
      }
      else if (line.match(/^[A-D]\./) && currentQuestion) {
        currentQuestion.options.push(line);
        optionCount++;
      }
      else if (line.match(/^\d+[a-d]$/i) && currentQuestion) {
        const match = line.match(/^(\d+)([a-d])$/i);
        if (match) {
          const questionNum = parseInt(match[1]);
          const answerChar = match[2].toLowerCase();
          
          if (questionNum === currentQuestion.id) {
            currentQuestion.correctAnswer = ['a', 'b', 'c', 'd'].indexOf(answerChar);
          }
        }
      }
    }
    
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    return questions;
  };

  const parseAnswerListFormat = (text: string) => {
    const questions = [];
    const answerPairs = text.split(',').map(pair => pair.trim());
    
    for (const pair of answerPairs) {
      const match = pair.match(/^(\d+)-([A-D])$/i);
      if (match) {
        const id = parseInt(match[1]);
        const answerChar = match[2].toUpperCase();
        const correctAnswer = ['A', 'B', 'C', 'D'].indexOf(answerChar);
        
        questions.push({
          id: id,
          question: `Câu hỏi số ${id}?`,
          options: [
            "A. Đáp án A",
            "B. Đáp án B", 
            "C. Đáp án C",
            "D. Đáp án D"
          ],
          correctAnswer: correctAnswer
        });
      }
    }
    
    return questions;
  };

  const handleImport = () => {
    if (!quizName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên bộ câu hỏi!",
        variant: "destructive",
      });
      return;
    }

    if (!questionsText.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung câu hỏi!",
        variant: "destructive",
      });
      return;
    }

    try {
      let questions;
      
      if (questionsText.trim().startsWith('[')) {
        questions = JSON.parse(questionsText);
      } else if (questionsText.match(/^\d+-[A-D],?\s*/)) {
        questions = parseAnswerListFormat(questionsText);
      } else {
        questions = parseTextFormat(questionsText);
      }

      const stored = localStorage.getItem("customQuizSets");
      const quizSets = stored ? JSON.parse(stored) : {};
      quizSets[quizName] = questions;
      localStorage.setItem("customQuizSets", JSON.stringify(quizSets));

      toast({
        title: "Thành công",
        description: `Đã lưu bộ câu hỏi "${quizName}" với ${questions.length} câu hỏi!`,
      });

      setQuizName("");
      setQuestionsText("");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Định dạng câu hỏi không hợp lệ!",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setQuizName("");
    setQuestionsText("");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Nhập Bộ Câu Hỏi Mới</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quiz-name">Tên bộ câu hỏi</Label>
          <Input
            id="quiz-name"
            placeholder="Nhập tên bộ câu hỏi (ví dụ: Đề thi Y khoa 1)"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="questions">Nhập câu hỏi</Label>
          <Textarea
            id="questions"
            placeholder="Nhập câu hỏi theo định dạng JSON, Text hoặc List đáp án..."
            className="min-h-[300px] font-mono text-sm"
            value={questionsText}
            onChange={(e) => setQuestionsText(e.target.value)}
          />
        </div>

        <Alert>
          <AlertDescription className="text-sm space-y-2">
            <p className="font-semibold">📝 Hướng dẫn nhập câu hỏi:</p>
            <div className="space-y-1">
              <p><strong>1. Định dạng Text:</strong> Câu 1. Câu hỏi? / A. Đáp án A / ... / 1a</p>
              <p><strong>2. List đáp án:</strong> 141-B, 142-C, 143-A</p>
              <p><strong>3. JSON:</strong> [{`{"id": 1, "question": "...", "options": [...], "correctAnswer": 0}`}]</p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button onClick={handleImport} className="flex-1 bg-info hover:bg-info/90">
            <Upload className="mr-2 h-4 w-4" /> Lưu Bộ Câu Hỏi
          </Button>
          <Button onClick={handleClear} variant="outline" className="flex-1">
            <Trash2 className="mr-2 h-4 w-4" /> Xóa Nội Dung
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
