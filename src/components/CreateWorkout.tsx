
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from 'lucide-react';
import { useExercises } from '@/hooks/useExercises';
import { useCreateWorkout, WorkoutSet } from '@/hooks/useWorkouts';

interface ExerciseInWorkout {
  id: string;
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
}

const CreateWorkout = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<ExerciseInWorkout[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const { data: availableExercises = [], isLoading: exercisesLoading } = useExercises();
  const createWorkout = useCreateWorkout();

  const addExercise = (exerciseId: string, exerciseName: string) => {
    const newExercise: ExerciseInWorkout = {
      id: Date.now().toString(),
      exercise_id: exerciseId,
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

  const updateExercise = (id: string, field: keyof ExerciseInWorkout, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const saveWorkout = async () => {
    if (!workoutName.trim() || exercises.length === 0) {
      alert('Por favor, adicione um nome e pelo menos um exercício');
      return;
    }
    
    // Convert exercises to sets format
    const sets: Omit<WorkoutSet, 'id'>[] = [];
    exercises.forEach((exercise, exerciseIndex) => {
      const numSets = exercise.sets;
      const repsRange = exercise.reps;
      const weight = parseFloat(exercise.weight) || undefined;
      
      for (let setIndex = 0; setIndex < numSets; setIndex++) {
        sets.push({
          exercise_id: exercise.exercise_id,
          set_order: setIndex + 1,
          reps: parseInt(repsRange.split('-')[0]) || 8, // Use first number of range
          weight_kg: weight,
          rest_seconds: exercise.rest,
        });
      }
    });

    await createWorkout.mutateAsync({
      name: workoutName,
      date: new Date().toISOString().split('T')[0],
      sets: sets,
    });
    
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
              disabled={exercisesLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Exercício
            </Button>
          </div>

          {exercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum exercício adicionado ainda</p>
              <p className="text-sm">Clique em "Adicionar Exercício" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((exercise) => (
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
              <Button 
                onClick={saveWorkout} 
                disabled={createWorkout.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createWorkout.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Treino'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setWorkoutName('');
                  setExercises([]);
                }}
                disabled={createWorkout.isPending}
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
                {exercisesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Seus exercícios:</p>
                    <div className="space-y-2">
                      {availableExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => addExercise(exercise.id, exercise.name)}
                        >
                          <span className="font-medium">{exercise.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {exercise.muscle_group}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateWorkout;
