import { Link } from "react-router-dom";
import { useTodoStore } from "../store/useTodoStore";
import { getTodayCompletedTodos, getWeeklyCompletionCounts } from "../utils/todoStats";
import { WeeklyCompletionChart } from "../app/components/mumodoro/WeeklyCompletionChart";
import { Card, CardContent, CardHeader, CardTitle } from "../app/components/ui/card";
import { Text } from "../app/components/ui/text";
import { Button } from "../app/components/ui/button";

export const StatsScreen = () => {
  const todos = useTodoStore((state) => state.todos);
  const todaySummary = getTodayCompletedTodos(todos);
  const weeklyData = getWeeklyCompletionCounts(todos);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D1B2A] text-white font-sans selection:bg-orange-500/30">
      <main className="container mx-auto px-4 py-10 flex flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Text as="h1" className="text-3xl font-bold">
              통계/리포트
            </Text>
            <Text as="p" className="text-white/60 mt-1 text-sm">
              오늘과 최근 7일의 완료 현황을 확인하세요.
            </Text>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <WeeklyCompletionChart data={weeklyData} />

          <Card className="bg-white/10 border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">오늘 완료한 것</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-semibold">{todaySummary.count}</div>
              {todaySummary.count === 0 ? (
                <Text as="p" className="text-white/60 text-sm">
                  아직 완료한 항목이 없어요. 하나 완료해보세요!
                </Text>
              ) : (
                <ul className="space-y-2 text-sm text-white/80">
                  {todaySummary.todos.map((todo) => (
                    <li key={todo.id} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      <span className="truncate">{todo.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};
