import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Split } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EnhancedImportTab = () => {
  const [quizName, setQuizName] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [separateQuestions, setSeparateQuestions] = useState("");
  const [separateAnswers, setSeparateAnswers] = useState("");
  const { toast } = useToast();

  // Parse any format flexibly
  const parseFlexibleFormat = (text: string) => {
    const questions = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    let currentQuestion: any = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect question patterns (very flexible)
      const questionPatterns = [
        /^(?:Câu|Cau|C|Question|Q)[\s.]*(\d+)[.:\s]+(.*)/i,
        /^(\d+)[.:\s]+(.*)/,
        /^(.+)\?$/
      ];
      
      let isQuestion = false;
      for (const pattern of questionPatterns) {
        const match = line.match(pattern);
        if (match && (!currentQuestion || currentQuestion.options.length === 4)) {
          if (currentQuestion && currentQuestion.options.length === 4) {
            questions.push(currentQuestion);
          }
          
          currentQuestion = {
            id: questions.length + 1,
            question: match[2] || match[1] || line,
            options: [],
            correctAnswer: null
          };
          isQuestion = true;
          break;
        }
      }
      
      if (isQuestion) continue;
      
      // Detect option patterns
      const optionPatterns = [
        /^([A-D])[.:\s)]+(.+)/i,
        /^(\d+)[.:\s)]+(.+)/,
      ];
      
      if (currentQuestion && currentQuestion.options.length < 4) {
        for (const pattern of optionPatterns) {
          const match = line.match(pattern);
          if (match) {
            const optionLetter = ['A', 'B', 'C', 'D'][currentQuestion.options.length];
            currentQuestion.options.push(`${optionLetter}. ${match[2]}`);
            break;
          }
        }
        
        // If no pattern matched but we need options, add as is
        if (currentQuestion.options.length < 4 && !line.match(/^[A-D][.:\s)]/i)) {
          const optionLetter = ['A', 'B', 'C', 'D'][currentQuestion.options.length];
          currentQuestion.options.push(`${optionLetter}. ${line}`);
        }
      }
      
      // Detect answer patterns
      const answerPatterns = [
        /^(?:Đáp án|Dap an|Answer|Ans)[:\s]*([A-D])/i,
        /^(\d+)[\s-]*([A-D])/i,
        /^([A-D])$/i,
      ];
      
      for (const pattern of answerPatterns) {
        const match = line.match(pattern);
        if (match && currentQuestion) {
          const answerChar = (match[2] || match[1]).toUpperCase();
          currentQuestion.correctAnswer = ['A', 'B', 'C', 'D'].indexOf(answerChar);
          break;
        }
      }
    }
    
    if (currentQuestion && currentQuestion.options.length === 4) {
      questions.push(currentQuestion);
    }
    
    return questions;
  };

  // Parse JSON format
  const parseJSONFormat = (text: string) => {
    return JSON.parse(text);
  };

  // Parse answer list (141-B, 142-C)
  const parseAnswerList = (text: string) => {
    const questions = [];
    const pairs = text.split(/[,\s]+/).filter(p => p.trim());
    
    for (const pair of pairs) {
      const match = pair.match(/^(\d+)[\s-]*([A-D])$/i);
      if (match) {
        const id = parseInt(match[1]);
        const answerChar = match[2].toUpperCase();
        questions.push({
          id,
          question: `Câu hỏi số ${id}`,
          options: ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
          correctAnswer: ['A', 'B', 'C', 'D'].indexOf(answerChar)
        });
      }
    }
    
    return questions;
  };

  // Parse separate questions and answers
  const parseSeparateInputs = (questionsText: string, answersText: string) => {
    const questionLines = questionsText.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    
    let currentQuestion: any = null;
    
    for (const line of questionLines) {
      // Check if it's a question
      if (line.match(/^(?:Câu|Cau|C|Question|Q)[\s.]*\d+/i) || line.includes('?') || currentQuestion === null || currentQuestion.options.length === 4) {
        if (currentQuestion && currentQuestion.options.length === 4) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          id: questions.length + 1,
          question: line.replace(/^(?:Câu|Cau|C|Question|Q)[\s.]*\d+[.:\s]*/i, ''),
          options: [],
          correctAnswer: null
        };
      } else if (currentQuestion && currentQuestion.options.length < 4) {
        const optionLetter = ['A', 'B', 'C', 'D'][currentQuestion.options.length];
        const cleanLine = line.replace(/^[A-D][.:\s)]+/i, '');
        currentQuestion.options.push(`${optionLetter}. ${cleanLine}`);
      }
    }
    
    if (currentQuestion && currentQuestion.options.length === 4) {
      questions.push(currentQuestion);
    }
    
    // Parse answers
    const answerLines = answersText.split(/[,\s\n]+/).map(a => a.trim()).filter(a => a);
    
    for (let i = 0; i < answerLines.length && i < questions.length; i++) {
      const answer = answerLines[i];
      const match = answer.match(/^(?:\d+[\s-]*)?([A-D])$/i);
      if (match) {
        const answerChar = match[1].toUpperCase();
        questions[i].correctAnswer = ['A', 'B', 'C', 'D'].indexOf(answerChar);
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

    try {
      let questions;
      
      if (questionsText.trim()) {
        // Auto-detect format
        const trimmed = questionsText.trim();
        
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          questions = parseJSONFormat(trimmed);
        } else if (trimmed.match(/^\d+[\s-]*[A-D]/i)) {
          questions = parseAnswerList(trimmed);
        } else {
          questions = parseFlexibleFormat(trimmed);
        }
      } else if (separateQuestions.trim() && separateAnswers.trim()) {
        questions = parseSeparateInputs(separateQuestions, separateAnswers);
      } else {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập nội dung câu hỏi!",
          variant: "destructive",
        });
        return;
      }

      // Validate
      if (!questions || questions.length === 0) {
        throw new Error("Không tìm thấy câu hỏi nào");
      }

      // Fill in missing correct answers with default (A)
      questions = questions.map((q: any) => ({
        ...q,
        correctAnswer: q.correctAnswer !== null && q.correctAnswer !== undefined ? q.correctAnswer : 0
      }));

      const stored = localStorage.getItem("customQuizSets");
      const quizSets = stored ? JSON.parse(stored) : {};
      quizSets[quizName] = questions;
      localStorage.setItem("customQuizSets", JSON.stringify(quizSets));

      toast({
        title: "Thành công",
        description: `Đã lưu ${questions.length} câu hỏi!`,
      });

      // Clear form
      setQuizName("");
      setQuestionsText("");
      setSeparateQuestions("");
      setSeparateAnswers("");

      // Trigger refresh
      window.dispatchEvent(new Event('quizSetsUpdated'));
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể import câu hỏi. Vui lòng kiểm tra lại định dạng!",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setQuizName("");
    setQuestionsText("");
    setSeparateQuestions("");
    setSeparateAnswers("");
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Nhập Câu Hỏi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="quiz-name">Tên bộ câu hỏi</Label>
          <Input
            id="quiz-name"
            placeholder="VD: Lịch sử Việt Nam, Toán học cơ bản..."
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all-in-one" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-in-one">Nhập Tất Cả</TabsTrigger>
            <TabsTrigger value="separate">
              <Split className="h-4 w-4 mr-2" />
              Nhập Riêng
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-in-one" className="space-y-4">
            <div>
              <Label htmlFor="questions-text">Nội dung câu hỏi (hỗ trợ mọi định dạng)</Label>
              <Textarea
                id="questions-text"
                placeholder={`Nhập theo bất kỳ định dạng nào:

1. Định dạng đơn giản:
Câu 1. Thủ đô của Việt Nam?
A. Hà Nội
B. TP HCM
C. Đà Nẵng
D. Huế
Đáp án: A

2. Định dạng ngắn gọn:
1. Câu hỏi của bạn?
A. Đáp án A
B. Đáp án B
C. Đáp án C
D. Đáp án D
A

3. Chỉ đáp án:
1-A, 2-B, 3-C, 4-D

4. JSON:
[{"id": 1, "question": "...", "options": [...], "correctAnswer": 0}]`}
                value={questionsText}
                onChange={(e) => setQuestionsText(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="separate" className="space-y-4">
            <div>
              <Label htmlFor="separate-questions">Câu hỏi</Label>
              <Textarea
                id="separate-questions"
                placeholder={`Câu 1. Thủ đô của Việt Nam?
A. Hà Nội
B. TP HCM
C. Đà Nẵng
D. Huế

Câu 2. 2 + 2 = ?
A. 3
B. 4
C. 5
D. 6`}
                value={separateQuestions}
                onChange={(e) => setSeparateQuestions(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="separate-answers">Đáp án (mỗi câu 1 dòng hoặc cách nhau bằng dấu phẩy)</Label>
              <Textarea
                id="separate-answers"
                placeholder={`A
B

hoặc:

1-A, 2-B, 3-C

hoặc:

A, B, C, D`}
                value={separateAnswers}
                onChange={(e) => setSeparateAnswers(e.target.value)}
                rows={5}
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={handleImport} className="flex-1">
            <Upload className="mr-2 h-4 w-4" />
            Lưu Bộ Câu Hỏi
          </Button>
          <Button onClick={handleClear} variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
