import { fetchDemoUser } from '../api/study';
import { fetchGoals, fetchGrowth, fetchMilestones } from '../api/growth';
import { useAppStore } from '../stores/useAppStore';

export async function bootstrapApp(): Promise<void> {
  const user = await fetchDemoUser();
  const store = useAppStore.getState();
  store.setUser(user.id, user.displayName);

  const [growth, milestones, goals] = await Promise.all([
    fetchGrowth(user.id),
    fetchMilestones(user.id),
    fetchGoals(user.id),
  ]);

  store.setGrowth(growth);
  store.setMilestones(milestones);
  store.setGoals(goals);
}
