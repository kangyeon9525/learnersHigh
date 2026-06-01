import type { CreateStudyPlanRequest, StudyPlan, UpdateStudyPlanRequest } from '@learners-high/shared';
import { StudyPlanModel } from '../db/models/index.js';
import { toStudyPlanDto } from '../db/mappers.js';

export async function listPlans(userId: string, plannedDate?: string): Promise<StudyPlan[]> {
  const filter: Record<string, unknown> = { userId };
  if (plannedDate) filter.plannedDate = plannedDate;
  const docs = await StudyPlanModel.find(filter).sort({ plannedDate: 1, sortOrder: 1 });
  return docs.map(toStudyPlanDto);
}

export async function createPlan(body: CreateStudyPlanRequest): Promise<StudyPlan> {
  let sortOrder = body.sortOrder;
  if (sortOrder === undefined) {
    const last = await StudyPlanModel.findOne({
      userId: body.userId,
      plannedDate: body.plannedDate,
    }).sort({ sortOrder: -1 });
    sortOrder = last ? last.sortOrder + 1 : 0;
  }

  const doc = await StudyPlanModel.create({
    userId: body.userId,
    title: body.title,
    plannedDate: body.plannedDate,
    sortOrder,
    durationMinutes: body.durationMinutes,
    completed: false,
  });
  return toStudyPlanDto(doc);
}

export async function updatePlan(
  planId: string,
  userId: string,
  patch: UpdateStudyPlanRequest,
): Promise<StudyPlan> {
  const doc = await StudyPlanModel.findOne({ _id: planId, userId });
  if (!doc) {
    throw Object.assign(new Error('Plan not found'), { statusCode: 404 });
  }

  if (patch.title !== undefined) doc.title = patch.title;
  if (patch.plannedDate !== undefined) doc.plannedDate = patch.plannedDate;
  if (patch.sortOrder !== undefined) doc.sortOrder = patch.sortOrder;
  if (patch.durationMinutes !== undefined) doc.durationMinutes = patch.durationMinutes;
  if (patch.completed !== undefined) doc.completed = patch.completed;

  await doc.save();
  return toStudyPlanDto(doc);
}

export async function deletePlan(planId: string, userId: string): Promise<void> {
  const result = await StudyPlanModel.deleteOne({ _id: planId, userId });
  if (result.deletedCount === 0) {
    throw Object.assign(new Error('Plan not found'), { statusCode: 404 });
  }
}
