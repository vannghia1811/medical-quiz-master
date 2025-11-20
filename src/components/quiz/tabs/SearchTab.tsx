import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Edit, Trash2 } from "lucide-react";
import { QuizSet } from "@/pages/Index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSet, setSelectedSet] = useState<string>("all");
  const [quizSets, setQuizSets] = useState<{ [key: string]: QuizSet[] }>({});
  const [filteredQuestions, setFilteredQuestions] = useState<Array<QuizSet & { setName: string }>>([]);

  useEffect(() => {
    loadQuizSets();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [searchQuery, selectedSet, quizSets]);

  const loadQuizSets = () => {
    const stored = localStorage.getItem("customQuizSets");
    if (stored) {
      setQuizSets(JSON.parse(stored));
    }
  };

  const filterQuestions = () => {
    let allQuestions: Array<QuizSet & { setName: string }> = [];
    
    Object.entries(quizSets).forEach(([setName, questions]) => {
      if (selectedSet === "all" || selectedSet === setName) {
        questions.forEach(q => {
          allQuestions.push({ ...q, setName });
        });
      }
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allQuestions = allQuestions.filter(q =>
        q.question.toLowerCase().includes(query) ||
        q.options.some(opt => opt.toLowerCase().includes(query))
      );
    }

    setFilteredQuestions(allQuestions);
  };

  const deleteQuestion = (setName: string, questionId: number) => {
    const newSets = { ...quizSets };
    newSets[setName] = newSets[setName].filter(q => q.id !== questionId);
    
    if (newSets[setName].length === 0) {
      delete newSets[setName];
    }
    
    localStorage.setItem("customQuizSets", JSON.stringify(newSets));
    setQuizSets(newSets);
    window.dispatchEvent(new Event('quizSetsUpdated'));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm câu hỏi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedSet} onValueChange={setSelectedSet}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tất cả bộ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bộ đề</SelectItem>
                {Object.keys(quizSets).map(setName => (
                  <SelectItem key={setName} value={setName}>
                    {setName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Tìm thấy {filteredQuestions.length} câu hỏi
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Không tìm thấy câu hỏi nào
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question, index) => (
            <Card key={`${question.setName}-${question.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {question.setName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Câu {question.id}
                      </span>
                    </div>
                    
                    <div className="font-medium text-lg">
                      {question.question}
                    </div>
                    
                    <div className="grid gap-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border ${
                            optIndex === question.correctAnswer
                              ? 'bg-success/10 border-success/20'
                              : 'bg-muted/30'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteQuestion(question.setName, question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
