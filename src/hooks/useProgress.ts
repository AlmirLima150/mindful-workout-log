
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface BodyMeasurement {
  id: string;
  measurement_type: string;
  value: number;
  unit: string;
  measured_at: string;
  created_at: string;
}

export const useBodyMeasurements = () => {
  return useQuery({
    queryKey: ['body-measurements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .order('measured_at', { ascending: false });
      
      if (error) throw error;
      return data as BodyMeasurement[];
    },
  });
};

export const useCreateBodyMeasurement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (measurement: Omit<BodyMeasurement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('body_measurements')
        .insert([measurement])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-measurements'] });
      toast({
        title: 'Medida registrada!',
        description: 'Sua medida foi adicionada ao histórico.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao registrar medida: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useExerciseProgress = (exerciseId?: string) => {
  return useQuery({
    queryKey: ['exercise-progress', exerciseId],
    queryFn: async () => {
      if (!exerciseId) return [];
      
      const { data, error } = await supabase
        .from('sets')
        .select(`
          *,
          workouts (
            date,
            name
          )
        `)
        .eq('exercise_id', exerciseId)
        .order('workouts(date)', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!exerciseId,
  });
};
