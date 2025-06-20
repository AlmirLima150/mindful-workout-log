
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface WorkoutTimerProps {
  onClose: () => void;
}

const WorkoutTimer = ({ onClose }: WorkoutTimerProps) => {
  const [time, setTime] = useState(60); // 60 seconds default
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      // Could add notification sound here
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setTime(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const presetTimes = [30, 60, 90, 120, 180];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Timer de Descanso</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {formatTime(time)}
            </div>
            <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${time === 0 ? 'bg-green-200' : ''}`}>
              <div 
                className={`h-full transition-all duration-1000 ${time === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${((initialTime - time) / initialTime) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={toggle}
              className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Preset Times */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">Tempos pré-definidos:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {presetTimes.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTime(preset);
                    setInitialTime(preset);
                    setIsActive(false);
                  }}
                  className={time === preset ? 'bg-blue-50 border-blue-300' : ''}
                >
                  {formatTime(preset)}
                </Button>
              ))}
            </div>
          </div>

          {time === 0 && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 font-medium">⏰ Tempo de descanso finalizado!</p>
              <p className="text-sm text-green-600">Pronto para a próxima série</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTimer;
