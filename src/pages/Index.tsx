import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Timer, TrendingUp, Activity, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import WorkoutTimer from "@/components/WorkoutTimer";
import CreateWorkout from "@/components/CreateWorkout";
import ExerciseLibrary from "@/components/ExerciseLibrary";
import ProgressTracker from "@/components/ProgressTracker";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTimer, setShowTimer] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado',
        description: 'Até a próxima!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao fazer logout',
        variant: 'destructive',
      });
    }
  };

  const recentWorkouts = [
    { id: 1, name: "Peito e Tríceps", date: "2024-06-18", duration: "45 min", exercises: 6 },
    { id: 2, name: "Costas e Bíceps", date: "2024-06-16", duration: "52 min", exercises: 8 },
    { id: 3, name: "Pernas", date: "2024-06-14", duration: "38 min", exercises: 5 },
  ];

  const stats = {
    totalWorkouts: 24,
    thisWeek: 4,
    avgDuration: "42 min",
    streak: 7
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
                  <p className="text-sm text-gray-600">Total de Treinos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
                  <p className="text-sm text-gray-600">Esta Semana</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{stats.avgDuration}</div>
                  <p className="text-sm text-gray-600">Duração Média</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
                  <p className="text-sm text-gray-600">Dias Seguidos</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setActiveTab('create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Treino
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTimer(true)}
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Timer
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('progress')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Ver Progresso
                </Button>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card>
              <CardHeader>
                <CardTitle>Treinos Recentes</CardTitle>
                <CardDescription>Seus últimos treinos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-gray-600">{workout.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{workout.duration}</Badge>
                        <p className="text-sm text-gray-600 mt-1">{workout.exercises} exercícios</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'create':
        return <CreateWorkout />;
      
      case 'exercises':
        return <ExerciseLibrary />;
      
      case 'progress':
        return <ProgressTracker />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">FitTracker</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date().toLocaleDateString('pt-BR')}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Activity },
              { key: 'create', label: 'Criar Treino', icon: Plus },
              { key: 'exercises', label: 'Exercícios', icon: Activity },
              { key: 'progress', label: 'Progresso', icon: TrendingUp },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Timer Modal */}
      {showTimer && (
        <WorkoutTimer onClose={() => setShowTimer(false)} />
      )}
    </div>
  );
};

export default Index;
