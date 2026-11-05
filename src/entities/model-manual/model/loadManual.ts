import { ApiError, makerApi, type Manual } from "@/shared/api";

// A model without a manual yet answers 404; treat that as an empty manual.
export async function loadManual(modelId: number): Promise<Manual> {
  try {
    return await makerApi.manual(modelId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return { sections: [] };
    throw error;
  }
}
