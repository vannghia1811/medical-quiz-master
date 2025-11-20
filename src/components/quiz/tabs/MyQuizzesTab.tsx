import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const MyQuizzesTab = () => {
  const [quizSets, setQuizSets] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  const loadQuizSets = () => {
    const stored = localStorage.getItem("customQuizSets");
    if (stored) {
      setQuizSets(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadQuizSets();
  }, []);

  const handleDelete = (name: string) => {
    if (confirm(`Bạn có chắc muốn xóa bộ đề "${name}"?`)) {
      const newSets = { ...quizSets };
      delete newSets[name];
      localStorage.setItem("customQuizSets", JSON.stringify(newSets));
      setQuizSets(newSets);
      
      toast({
        title: "Đã xóa",
        description: `Đã xóa bộ đề "${name}"`,
      });
    }
  };

  if (Object.keys(quizSets).length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground text-center">
            Chưa có bộ đề nào. Hãy nhập câu hỏi từ tab "Nhập Câu Hỏi".
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(quizSets).map(([name, questions]) => (
        <Card key={name} className="shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{name}</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {questions.length} câu hỏi
                  </Badge>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
