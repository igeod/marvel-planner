import { z } from "zod";

// What an account keeps across devices. A guest keeps the same shape on the device.
export const preferencesSchema = z.object({
  collapsedPhases: z.array(z.number().int().min(0).max(99)).max(99),
});

export type Preferences = z.infer<typeof preferencesSchema>;
