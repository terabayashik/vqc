import { z } from "zod";

const pooledMetricsSchema = z.object({
  min: z.number(),
  max: z.number(),
  mean: z.number(),
  harmonic_mean: z.number(),
});

export const statsSchema = z.object({
  version: z.string(),
  fps: z.number(),
  frames: z.array(
    z.object({
      frameNum: z.number(),
      metrics: z.object({
        integer_motion2: z.number(),
        integer_motion: z.number(),
        integer_vif_scale0: z.number(),
        integer_vif_scale1: z.number(),
        integer_vif_scale2: z.number(),
        integer_vif_scale3: z.number(),
        integer_adm2: z.number(),
        integer_adm_scale0: z.number(),
        integer_adm_scale1: z.number(),
        integer_adm_scale2: z.number(),
        integer_adm_scale3: z.number(),
        vmaf: z.number(),
      }),
    }),
  ),
  pooled_metrics: z.object({
    integer_motion2: pooledMetricsSchema,
    integer_motion: pooledMetricsSchema,
    integer_vif_scale0: pooledMetricsSchema,
    integer_vif_scale1: pooledMetricsSchema,
    integer_vif_scale2: pooledMetricsSchema,
    integer_vif_scale3: pooledMetricsSchema,
    integer_adm2: pooledMetricsSchema,
    integer_adm_scale0: pooledMetricsSchema,
    integer_adm_scale1: pooledMetricsSchema,
    integer_adm_scale2: pooledMetricsSchema,
    integer_adm_scale3: pooledMetricsSchema,
    vmaf: pooledMetricsSchema,
  }),
  aggregate_metrics: z.object({}),
});
export type Stats = z.infer<typeof statsSchema>;
