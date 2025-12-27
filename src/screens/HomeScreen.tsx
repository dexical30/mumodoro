import React from 'react';
import { BackgroundPlayer } from '../app/components/mumodoro/BackgroundPlayer';
import { TimerDisplay } from '../app/components/mumodoro/TimerDisplay';
import { TodoList } from '../app/components/mumodoro/TodoList';
import { Playbar } from '../app/components/mumodoro/Playbar';
import { MemoDialog } from '../app/components/mumodoro/MemoDialog';
import { SettingsSidebar } from '../app/components/mumodoro/SettingsSidebar';
import { ThemeToggle } from '../app/components/mumodoro/ThemeToggle';
import { Text } from '../app/components/ui/text';

export const HomeScreen = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D1B2A] text-white font-sans selection:bg-orange-500/30">
      <BackgroundPlayer />
      
      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        <div className="flex-1 w-full max-w-xl flex flex-col items-center">
           {/* Logo / Title Area */}
           <div className="absolute top-8 left-8 flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
             <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-[#0D1B2A]">M</div>
             <Text as="h1" className="text-xl font-bold tracking-tight">Mumodoro</Text>
           </div>

           <div className="absolute top-8 right-8 flex items-center gap-2 z-50">
             <ThemeToggle />
             <SettingsSidebar />
           </div>

           <TimerDisplay />
        </div>

        <div className="flex-1 w-full max-w-md animate-in slide-in-from-right-8 fade-in duration-700 delay-200">
          <TodoList />
        </div>
      </main>

      <Playbar />
      <MemoDialog />
    </div>
  );
};
