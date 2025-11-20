import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedImportTab } from "./tabs/EnhancedImportTab";
import { MyQuizzesTab } from "./tabs/MyQuizzesTab";
import { SyncTab } from "./tabs/SyncTab";
import { DashboardTab } from "./tabs/DashboardTab";
import { SmartPracticeTab } from "./tabs/SmartPracticeTab";
import { SearchTab } from "./tabs/SearchTab";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Brain, Upload, BookOpen, Cloud, Search } from "lucide-react";
import { QuizConfig } from "@/pages/Index";

interface StartScreenProps {
  onContinue: () => void;
  onStartQuiz: (config: QuizConfig) => void;
}

export const StartScreen = ({ onContinue, onStartQuiz }: StartScreenProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-info bg-clip-text text-transparent">
          Chào Mừng Đến Với Quiz Master
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tạo bộ câu hỏi của riêng bạn, luyện tập thông minh và theo dõi tiến độ học tập
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Tổng quan</span>
          </TabsTrigger>
          <TabsTrigger value="practice" className="gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Luyện tập</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Nhập</span>
          </TabsTrigger>
          <TabsTrigger value="my-quizzes" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Bộ đề</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </TabsTrigger>
          <TabsTrigger value="sync" className="gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">Đồng bộ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="animate-fade-in">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="practice" className="animate-fade-in">
          <SmartPracticeTab onStartQuiz={onStartQuiz} />
        </TabsContent>

        <TabsContent value="import" className="animate-fade-in">
          <EnhancedImportTab />
        </TabsContent>

        <TabsContent value="my-quizzes" className="animate-fade-in">
          <MyQuizzesTab />
        </TabsContent>

        <TabsContent value="search" className="animate-fade-in">
          <SearchTab />
        </TabsContent>

        <TabsContent value="sync" className="animate-fade-in">
          <SyncTab />
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          onClick={onContinue}
          className="bg-gradient-to-r from-primary via-accent to-info hover:opacity-90 text-lg px-8 shadow-lg hover:shadow-xl transition-all"
        >
          Bắt Đầu Quiz <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
