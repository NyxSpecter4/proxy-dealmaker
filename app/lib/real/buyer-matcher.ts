// app/lib/real/buyer-matcher.ts
import { supabase } from '@/lib/supabase-client';

export async function findRealBuyers(techStack: string[], budget: number) {
  const { data: buyers, error } = await supabase
    .from('buyers')
    .select('*')
    .contains('interests', techStack)
    .gte('budget', budget)
    .order('created_at', { ascending: false });
  
  return buyers || [];
}