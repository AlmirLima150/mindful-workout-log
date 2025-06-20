
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCreateExercise } from '@/hooks/useExercises';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const muscleGroups = [
  'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio'
];

const AddExerciseModal = ({ isOpen, onClose }: AddExerciseModalProps) => {
  const [name, setName] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [description, setDescription] = useState('');

  const createExercise = useCreateExercise();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !selectedMuscleGroup) {
      return;
    }

    await createExercise.mutateAsync({
      name: name.trim(),
      muscle_group: selectedMuscleGroup,
      description: description.trim() || undefined,
    });

    // Reset form
    setName('');
    setSelectedMuscleGroup('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Exercício</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Exercício</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino Reto"
              required
            />
          </div>

          <div>
            <Label>Grupo Muscular</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {muscleGroups.map((group) => (
                <Badge
                  key={group}
                  variant={selectedMuscleGroup === group ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedMuscleGroup(group)}
                >
                  {group}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instruções ou observações sobre o exercício..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!name.trim() || !selectedMuscleGroup || createExercise.isPending}
              className="flex-1"
            >
              {createExercise.isPending ? 'Salvando...' : 'Salvar Exercício'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseModal;
