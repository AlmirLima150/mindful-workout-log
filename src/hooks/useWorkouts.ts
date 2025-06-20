
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface WorkoutSet {
  id?: string;
  exercise_id: string;
  set_order: number;
  reps: number;
  weight_kg?: number;
  rest_seconds: number;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  notes?: string;
  duration_minutes?: number;
  created_at: string;
  sets?: WorkoutSet[];
}

export interface WorkoutWithSets extends Workout {
  sets: (WorkoutSet & {
    exercises: {
      name: string;
      muscle_group: string;
    };
  })[];
}

export const useWorkouts = () => {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Workout[];
    },
  });
};

export const useWorkout = (id: string) => {
  return useQuery({
    queryKey: ['workout', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          sets (
            *,
            exercises (
              name,
              muscle_group
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as WorkoutWithSets;
    },
    enabled: !!id,
  });
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (workout: {
      name: string;
      date: string;
      notes?: string;
      sets: Omit<WorkoutSet, 'id'>[];
    }) => {
      // Create workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert([{
          name: workout.name,
          date: workout.date,
          notes: workout.notes,
        }])
        .select()
        .single();
      
      if (workoutError) throw workoutError;

      // Create sets
      if (workout.sets.length > 0) {
        const setsWithWorkoutId = workout.sets.map(set => ({
          ...set,
          workout_id: workoutData.id,
        }));

        const { error: setsError } = await supabase
          .from('sets')
          .insert(setsWithWorkoutId);
        
        if (setsError) throw setsError;
      }

      return workoutData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: 'Treino salvo!',
        description: 'Seu treino foi salvo com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar treino: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: 'Treino removido!',
        description: 'O treino foi removido do seu histórico.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao remover treino: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};
