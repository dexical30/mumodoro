import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  StickyNote,
  RotateCcw,
} from 'lucide-react';
import { useTodoStore } from '../../../store/useTodoStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Text } from '../ui/text';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export const TodoList = () => {
  const { todos, activeTodoId, actions } = useTodoStore();
  const {
    addTodo,
    toggleTodo,
    deleteTodo,
    setActiveTodo,
    restoreTodoToToday,
  } = actions;
  const [newTodo, setNewTodo] = useState('');
  const todayTodos = todos.filter((todo) => todo.status === 'today');
  const overdayTodos = todos.filter((todo) => todo.status === 'overday');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const renderTodoRow = (todo: (typeof todos)[number], showRestore: boolean) => (
    <div
      key={todo.id}
      className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 border ${
        activeTodoId === todo.id
          ? 'bg-orange-500/10 border-orange-500/50'
          : 'bg-white/5 border-transparent hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`shrink-0 transition-colors ${
            todo.completed ? 'text-green-400' : 'text-white/30 hover:text-white/50'
          }`}
        >
          {todo.completed ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <Text
          as="span"
          onClick={() => todo.status === 'today' && !todo.completed && setActiveTodo(todo.id)}
          className={`truncate cursor-pointer select-none ${
            todo.completed ? 'text-white/30 line-through' : 'text-white'
          }`}
        >
          {todo.text}
        </Text>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {todo.notes.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
                <StickyNote className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0D1B2A] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Notes for: {todo.text}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[200px] mt-4">
                <div className="space-y-4">
                  {todo.notes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded bg-white/5 text-sm text-white/80">
                      {note}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}

        {showRestore && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-orange-400 hover:bg-orange-400/10"
            onClick={() => restoreTodoToToday(todo.id)}
          >
            <RotateCcw className="h-4 w-4" />
            오늘로 되돌리기
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/30 hover:text-red-400 hover:bg-red-400/10"
          onClick={() => deleteTodo(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
      <Text as="h2" className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Text as="span" className="w-2 h-2 rounded-full bg-orange-500"/>
        Tasks
      </Text>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-orange-500"
        />
        <Button type="submit" size="icon" className="bg-orange-500 hover:bg-orange-600 text-white shrink-0">
          <Plus className="h-5 w-5" />
        </Button>
      </form>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-6">
          <div className="space-y-3">
            <Text as="h3" className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Today
            </Text>
            {todayTodos.length === 0 && (
              <div className="text-center text-white/30 py-4 text-sm">
                No tasks yet. Add one to get started!
              </div>
            )}
            {todayTodos.map((todo) => renderTodoRow(todo, false))}
          </div>

          <div className="space-y-3">
            <Text as="h3" className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Overday
            </Text>
            {overdayTodos.length === 0 && (
              <div className="text-center text-white/30 py-4 text-sm">
                No overday tasks.
              </div>
            )}
            {overdayTodos.map((todo) => renderTodoRow(todo, true))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
