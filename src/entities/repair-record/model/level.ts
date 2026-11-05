import type { Difficulty } from "@/shared/api";
import type { RepairLevel } from "./types";

export const repairLevelOf = (difficulty: Difficulty): RepairLevel =>
  difficulty === "SELF" ? "user" : "engineer";
