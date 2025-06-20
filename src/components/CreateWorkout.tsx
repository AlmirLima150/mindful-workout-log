
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
}

const CreateWorkout = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const popularExercises = [
    'Supino Reto', 'Agachamento', 'Levantamento Terra', 'Rosca Direta',
    'Desenvolvimento', 'Puxada Alta', 'Leg Press', 'Remada Curvada',
    'Flexão', 'Tríceps Testa', 'Elevação Lateral', 'Cadeira Extensora'
  ];

  const addExercise = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: 3,
      reps: '8-12',
      weight: '',
      rest: 60
    };
    setExercises([...exercises, newExercise]);
    setShowAddExercise(false);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const saveWorkout = () => {
    if (!workoutName.trim() || exercises.length === 0) {
      alert('Por favor, adicione um nome e pelo menos um exercício');
      return;
    }
    
    // Here you would save to localStorage or database
    console.log('Saving workout:', { name: workoutName, exercises });
    alert('Treino salvo com sucesso!');
    
    // Reset form
    setWorkoutName('');
    setExercises([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Treino</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Treino
            </label>
            <Input
              placeholder="Ex: Peito e Tríceps"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Exercícios ({exercises.length})</h3>
            <Button 
              onClick={() => setShowAddExercise(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Exercício
            </Button>
          </div>

          {/* Exercise List */}
          {exercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum exercício adicionado ainda</p>
              <p className="text-sm">Clique em "Adicionar Exercício" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <Card key={exercise.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Séries</label>
                        <Input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Repetições</label>
                        <Input
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                          placeholder="8-12"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Peso (kg)</label>
                        <Input
                          value={exercise.weight}
                          onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value)}
                          placeholder="20"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Descanso (s)</label>
                        <Input
                          type="number"
                          value={exercise.rest}
                          onChange={(e) => updateExercise(exercise.id, 'rest', parseInt(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {exercises.length > 0 && (
            <div className="flex gap-3 pt-4">
              <Button onClick={saveWorkout} className="bg-green-600 hover:bg-green-700">
                Salvar Treino
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setWorkoutName('');
                  setExercises([]);
                }}
              >
                Limpar Tudo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-96 overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Adicionar Exercício</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddExercise(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Exercícios populares:</p>
                <div className="flex flex-wrap gap-2">
                  {popularExercises.map((exercise) => (
                    <Badge
                      key={exercise}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => addExercise(exercise)}
                    >
                      {exercise}
                    </Badge>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Input
                    placeholder="Ou digite o nome do exercício..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        addExercise(e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Pressione Enter para adicionar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateWorkout;
