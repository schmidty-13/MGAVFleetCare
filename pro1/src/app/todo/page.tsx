
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Todo, todoStatuses } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowRight, Play } from "lucide-react";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData: Todo[] = [];
      querySnapshot.forEach((doc) => {
        todosData.push({ ...doc.data(), id: doc.id } as Todo);
      });
      setTodos(todosData.sort((a,b) => (a.createdAt || 0) > (b.createdAt || 0) ? 1 : -1));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching todos: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTodo = async () => {
    if (inputText.trim() === "") return;
    try {
      await addDoc(collection(db, "todos"), { 
        text: inputText, 
        status: "pending",
        createdAt: Date.now(),
      });
      setInputText("");
    } catch(e) {
      console.error("Error adding todo: ", e);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const todoDoc = doc(db, "todos", id);
      const currentTodo = todos.find(t => t.id === id);
      if (currentTodo && currentTodo.status === 'pending') {
        await updateDoc(todoDoc, { status: "in-progress" });
      }
    } catch (e) {
      console.error("Error updating todo: ", e);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch(e) {
      console.error("Error deleting todo: ", e);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center min-h-screen">
          <h2 className="text-xl font-semibold tracking-tight">
              Loading...
          </h2>
          <p className="mt-2 text-muted-foreground">
            Please wait a moment.
          </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Todo List
          </h1>
          <Button asChild>
            <Link href="/">
              Back to Fleet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <header className="border-b bg-background/80 backdrop-blur-sm py-4">
        <div className="container mx-auto flex justify-center">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter a new task..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <Button onClick={handleAddTodo}>Add Task</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <Card className="mx-auto max-w-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-4">
                       <Badge variant={todo.status === 'pending' ? 'secondary' : 'default'}>
                        {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium">{todo.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {todo.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(todo.id)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <h2 className="text-xl font-semibold tracking-tight">
                       Your todo list is empty.
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                       Add a task to get started!
                    </p>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
