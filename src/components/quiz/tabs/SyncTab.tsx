import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SyncTab = () => {
  const [quizSets, setQuizSets] = useState<Record<string, any[]>>({});
  const [selectedSet, setSelectedSet] = useState("");
  const [syncCode, setSyncCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("customQuizSets");
    if (stored) {
      const sets = JSON.parse(stored);
      setQuizSets(sets);
    }
  }, []);

  const generateSyncCode = () => {
    if (!selectedSet) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn bộ đề để tạo mã đồng bộ!",
        variant: "destructive",
      });
      return;
    }

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const syncCodes = JSON.parse(localStorage.getItem("syncCodes") || "{}");
    
    syncCodes[code] = {
      quizSet: quizSets[selectedSet],
      name: selectedSet,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000)
    };
    
    localStorage.setItem("syncCodes", JSON.stringify(syncCodes));
    setGeneratedCode(code);
    
    toast({
      title: "Thành công",
      description: `Đã tạo mã đồng bộ: ${code}`,
    });
  };

  const syncFromCode = () => {
    if (!syncCode.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã đồng bộ!",
        variant: "destructive",
      });
      return;
    }

    const syncCodes = JSON.parse(localStorage.getItem("syncCodes") || "{}");
    const syncData = syncCodes[syncCode.toUpperCase()];
    
    if (!syncData) {
      toast({
        title: "Lỗi",
        description: "Mã đồng bộ không tồn tại!",
        variant: "destructive",
      });
      return;
    }

    if (Date.now() > syncData.expires) {
      toast({
        title: "Lỗi",
        description: "Mã đồng bộ đã hết hạn!",
        variant: "destructive",
      });
      delete syncCodes[syncCode.toUpperCase()];
      localStorage.setItem("syncCodes", JSON.stringify(syncCodes));
      return;
    }

    const newName = `${syncData.name} (Đồng bộ)`;
    const newSets = { ...quizSets, [newName]: syncData.quizSet };
    localStorage.setItem("customQuizSets", JSON.stringify(newSets));
    
    toast({
      title: "Thành công",
      description: `Đã đồng bộ thành công bộ đề: ${syncData.name}`,
    });
    
    setSyncCode("");
    setQuizSets(newSets);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Tạo mã đồng bộ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Chọn bộ đề</Label>
            <Select value={selectedSet} onValueChange={setSelectedSet}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn bộ đề..." />
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

          <Button onClick={generateSyncCode} className="w-full">
            <Share2 className="mr-2 h-4 w-4" /> Tạo Mã Đồng Bộ
          </Button>

          {generatedCode && (
            <Alert className="bg-success/10 border-success">
              <AlertDescription>
                <p className="font-semibold mb-2">Mã đồng bộ của bạn:</p>
                <div className="bg-card p-3 rounded-lg text-center font-mono text-2xl tracking-wider">
                  {generatedCode}
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Mã này có hiệu lực trong 24 giờ
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Nhập mã đồng bộ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mã đồng bộ</Label>
            <Input
              placeholder="Nhập mã đồng bộ"
              value={syncCode}
              onChange={(e) => setSyncCode(e.target.value.toUpperCase())}
              className="font-mono text-center tracking-wider"
            />
          </div>

          <Button onClick={syncFromCode} className="w-full bg-success hover:bg-success/90">
            <Download className="mr-2 h-4 w-4" /> Đồng Bộ Ngay
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
