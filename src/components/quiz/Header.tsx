import { Activity } from "lucide-react";

export const Header = () => {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="bg-gradient-to-r from-primary to-info rounded-2xl p-8 shadow-xl text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Activity className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              TRẮC NGHIỆM Y KHOA
            </h1>
          </div>
          <p className="text-center text-lg opacity-95">
            Hệ thống ôn tập và kiểm tra kiến thức chuyên ngành
          </p>
        </div>
      </div>
    </header>
  );
};
