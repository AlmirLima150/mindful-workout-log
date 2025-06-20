
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useExercises, useDeleteExercise } from '@/hooks/useExercises';
import AddExerciseModal from './AddExerciseModal';

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: exercises = [], isLoading } = useExercises();
  const deleteExercise = useDeleteExercise();

  const categories = ['all', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscle_group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.muscle_group === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Peito': 'bg-red-100 text-red-700',
      'Costas': 'bg-green-100 text-green-700',
      'Pernas': 'bg-blue-100 text-blue-700',
      'Ombros': 'bg-yellow-100 text-yellow-700',
      'Braços': 'bg-purple-100 text-purple-700',
      'Core': 'bg-indigo-100 text-indigo-700',
      'Cardio': 'bg-pink-100 text-pink-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleDeleteExercise = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o exercício "${name}"?`)) {
      await deleteExercise.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Exercícios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar exercícios ou músculos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Todos' : category}
              </Badge>
            ))}
          </div>

          <Button 
            onClick={() => setShowAddModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exercício Personalizado
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredExercises.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <p>Nenhum exercício encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca ou adicione um novo exercício</p>
            </CardContent>
          </Card>
        ) : (
          filteredExercises.map(exercise => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getCategoryColor(exercise.muscle_group)}>
                        {exercise.muscle_group}
                      </Badge>
                    </div>
                    {exercise.description && (
                      <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteExercise(exercise.id, exercise.name)}
                      disabled={deleteExercise.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600">
            Mostrando {filteredExercises.length} de {exercises.length} exercícios
          </div>
        </CardContent>
      </Card>

      <AddExerciseModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
};

export default ExerciseLibrary;
