
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  instructions?: string;
}

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Supino Reto',
      category: 'Peito',
      muscles: ['Peitoral', 'Tríceps', 'Deltoides']
    },
    {
      id: '2',
      name: 'Agachamento',
      category: 'Pernas',
      muscles: ['Quadríceps', 'Glúteos', 'Isquiotibiais']
    },
    {
      id: '3',
      name: 'Levantamento Terra',
      category: 'Costas',
      muscles: ['Lombar', 'Glúteos', 'Isquiotibiais', 'Trapézio']
    },
    {
      id: '4',
      name: 'Rosca Direta',
      category: 'Braços',
      muscles: ['Bíceps', 'Antebraços']
    },
    {
      id: '5',
      name: 'Desenvolvimento com Halteres',
      category: 'Ombros',
      muscles: ['Deltoides', 'Tríceps']
    },
    {
      id: '6',
      name: 'Puxada Alta',
      category: 'Costas',
      muscles: ['Latíssimo', 'Bíceps', 'Romboides']
    },
    {
      id: '7',
      name: 'Leg Press',
      category: 'Pernas',
      muscles: ['Quadríceps', 'Glúteos']
    },
    {
      id: '8',
      name: 'Tríceps Testa',
      category: 'Braços',
      muscles: ['Tríceps']
    }
  ];

  const categories = ['all', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Peito': 'bg-red-100 text-red-700',
      'Costas': 'bg-green-100 text-green-700',
      'Pernas': 'bg-blue-100 text-blue-700',
      'Ombros': 'bg-yellow-100 text-yellow-700',
      'Braços': 'bg-purple-100 text-purple-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Exercícios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Buscar exercícios ou músculos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Category Filter */}
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

          {/* Add Custom Exercise */}
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exercício Personalizado
          </Button>
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      <div className="grid gap-4">
        {filteredExercises.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <p>Nenhum exercício encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
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
                      <Badge className={getCategoryColor(exercise.category)}>
                        {exercise.category}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscles.map(muscle => (
                        <Badge key={muscle} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600">
            Mostrando {filteredExercises.length} de {exercises.length} exercícios
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseLibrary;
