
export interface Exercise {
  id: string
  user_id: string
  name: string
  muscle_group: string
  description?: string
  created_at: string
}

export interface Workout {
  id: string
  user_id: string
  name: string
  date: string
  notes?: string
  duration_minutes?: number
  created_at: string
}

export interface Set {
  id: string
  workout_id: string
  exercise_id: string
  set_order: number
  reps: number
  weight_kg?: number
  rest_seconds: number
  created_at: string
}

export interface BodyMeasurement {
  id: string
  user_id: string
  measurement_type: string
  value: number
  unit: string
  measured_at: string
  created_at: string
}

export interface ProgressPhoto {
  id: string
  user_id: string
  photo_url: string
  photo_type?: string
  taken_at: string
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}
