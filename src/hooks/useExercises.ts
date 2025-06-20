
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  description?: string;
  created_at: string;
}

export const useExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Exercise[];
    },
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exercise: Omit<Exercise, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('exercises')
        .insert([exercise])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: 'Exercício criado!',
        description: 'O exercício foi adicionado à sua biblioteca.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar exercício: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast({
        title: 'Exercício removido!',
        description: 'O exercício foi removido da sua biblioteca.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao remover exercício: ' + error.message,
        variant: 'destructive',
      });
    },
  });
};
