import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportTab } from "./tabs/ImportTab";
import { MyQuizzesTab } from "./tabs/MyQuizzesTab";
import { SyncTab } from "./tabs/SyncTab";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StartScreenProps {
  onContinue: () => void;
}

export const StartScreen = ({ onContinue }: StartScreenProps) => {
  const [activeTab, setActiveTab] = useState("import");

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
          Chào Mừng Đến Với Trắc Nghiệm Y Khoa
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hệ thống cho phép bạn tự tạo bộ câu hỏi trắc nghiệm và thực hành. 
          Nhập câu hỏi của bạn và bắt đầu luyện tập ngay!
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="import">Nhập Câu Hỏi</TabsTrigger>
          <TabsTrigger value="my-quizzes">Bộ Đề Của Tôi</TabsTrigger>
          <TabsTrigger value="sync">Đồng Bộ</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="animate-fade-in">
          <ImportTab />
        </TabsContent>

        <TabsContent value="my-quizzes" className="animate-fade-in">
          <MyQuizzesTab />
        </TabsContent>

        <TabsContent value="sync" className="animate-fade-in">
          <SyncTab />
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          onClick={onContinue}
          className="bg-gradient-to-r from-primary to-info hover:opacity-90 text-lg px-8"
        >
          Tiếp Tục <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
