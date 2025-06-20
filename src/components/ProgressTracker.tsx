
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Plus } from 'lucide-react';

const ProgressTracker = () => {
  const progressData = [
    {
      exercise: 'Supino Reto',
      currentWeight: '80kg',
      previousWeight: '75kg',
      improvement: '+5kg',
      date: '2024-06-18'
    },
    {
      exercise: 'Agachamento',
      currentWeight: '100kg',
      previousWeight: '95kg',
      improvement: '+5kg',
      date: '2024-06-16'
    },
    {
      exercise: 'Levantamento Terra',
      currentWeight: '120kg',
      previousWeight: '115kg',
      improvement: '+5kg',
      date: '2024-06-14'
    }
  ];

  const measurements = [
    { metric: 'Peso', value: '75.2kg', change: '-0.8kg', date: '2024-06-18' },
    { metric: '% Gordura', value: '12.5%', change: '-1.2%', date: '2024-06-18' },
    { metric: 'Peito', value: '102cm', change: '+2cm', date: '2024-06-15' },
    { metric: 'Braço', value: '38cm', change: '+1cm', date: '2024-06-15' }
  ];

  const weeklyProgress = [
    { week: 'Semana 1', workouts: 4, duration: '3h 20min' },
    { week: 'Semana 2', workouts: 5, duration: '4h 10min' },
    { week: 'Semana 3', workouts: 4, duration: '3h 45min' },
    { week: 'Semana 4', workouts: 6, duration: '4h 30min' }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-blue-600">6</p>
                <p className="text-xs text-gray-500">treinos</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Total</p>
                <p className="text-2xl font-bold text-green-600">4h 30min</p>
                <p className="text-xs text-gray-500">esta semana</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evolução</p>
                <p className="text-2xl font-bold text-green-600">+12kg</p>
                <p className="text-xs text-gray-500">carga total</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Evolução por Exercício</CardTitle>
          <Button variant="outline" size="sm">
            Ver Gráficos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.exercise}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.currentWeight}</p>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    {item.improvement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Body Measurements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medidas Corporais</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Medida
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {measurements.map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{item.metric}</p>
                <p className="text-xl font-bold">{item.value}</p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    item.change.startsWith('+') ? 'text-green-600 bg-green-50' : 
                    item.change.startsWith('-') && item.metric === 'Peso' ? 'text-green-600 bg-green-50' :
                    item.change.startsWith('-') && item.metric === '% Gordura' ? 'text-green-600 bg-green-50' :
                    'text-red-600 bg-red-50'
                  }`}
                >
                  {item.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyProgress.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{week.week}</p>
                  <p className="text-sm text-gray-600">{week.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{week.workouts}</p>
                  <p className="text-xs text-gray-500">treinos</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Photos Placeholder */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fotos de Progresso</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Foto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Adicionar Foto</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
