/**
 * [INPUT]: schema.js, gemini API route
 * [OUTPUT]: analyzeFaceServer function
 * [POS]: lib/analyze - Server API wrapper for /api/analyze
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { SkinScanSchema, AURA_TYPES } from "./schema";
import { generateDetailFromRadar } from "./gemini";

/**
 * Analyze face via server API route (/api/analyze)
 * @param {File} imageFile - Image file to analyze
 * @returns {Promise<import('./schema').SkinScanResult>}
 */
export async function analyzeFaceServer(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch("https://www.7yaz1.cn/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "分析失败，请重试");
  }

  const parsed = await response.json();
  const validated = SkinScanSchema.parse(parsed);

  const enrichedRadarDetail = {
    ...validated.radar_detail,
    affinity: generateDetailFromRadar(validated.radar.affinity, "affinity"),
    uniqueness: generateDetailFromRadar(
      validated.radar.uniqueness,
      "uniqueness",
    ),
  };

  return {
    ...validated,
    radar_detail: enrichedRadarDetail,
    aura_label: AURA_TYPES[validated.aura_type]?.label || validated.aura_type,
  };
}
