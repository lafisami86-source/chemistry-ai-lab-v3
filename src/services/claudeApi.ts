import type { ChemicalElement, ReactionResult } from '../types';

// يستعمل /api/claude كـ proxy على Vercel — ما فيه CORS مشكلة
const API_URL = '/api/claude';

export async function predictReactionWithClaude(
  elementA: ChemicalElement,
  elementB: ChemicalElement,
  temperature: number,
  pressure: number,
  apiKey: string
): Promise<ReactionResult> {
  const prompt = `You are an expert chemist. Predict the reaction between:
- ${elementA.name} (${elementA.symbol}, Z=${elementA.atomicNumber}, category: ${elementA.category}, EN: ${elementA.electronegativity ?? 'N/A'}, phase: ${elementA.phase})
- ${elementB.name} (${elementB.symbol}, Z=${elementB.atomicNumber}, category: ${elementB.category}, EN: ${elementB.electronegativity ?? 'N/A'}, phase: ${elementB.phase})
Conditions: temperature=${temperature}°C, pressure=${pressure} atm.

Respond ONLY with a valid JSON object, no markdown, no extra text:
{
  "formula": "product formula",
  "name": "IUPAC name",
  "bondType": "Ionic | Covalent | Metallic | Van der Waals | No Reaction",
  "balancedEquation": "balanced equation string",
  "yield": 0-100,
  "stability": "Stable | Unstable | Highly Unstable",
  "phase": "Solid | Liquid | Gas | Unknown",
  "deltaH": number in kJ/mol,
  "deltaS": number in J/mol·K,
  "deltaG": number in kJ/mol,
  "optimalTemp": number in Celsius,
  "confidence": 0-100,
  "description": "2-3 sentence scientific description",
  "safetyWarning": "warning string or null",
  "isNobleGasReaction": boolean,
  "isAlloy": boolean
}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? '';
  const clean = text.replace(/```json|```/gi, '').trim();
  const parsed = JSON.parse(clean);

  return {
    formula: parsed.formula ?? `${elementA.symbol}${elementB.symbol}`,
    name: parsed.name ?? 'Unknown Compound',
    bondType: parsed.bondType ?? 'Unknown',
    balancedEquation: parsed.balancedEquation ?? `${elementA.symbol} + ${elementB.symbol} → ${parsed.formula}`,
    yield: Number(parsed.yield) || 0,
    stability: parsed.stability ?? 'Highly Unstable',
    phase: parsed.phase ?? 'Unknown',
    deltaH: Number(parsed.deltaH) || 0,
    deltaS: Number(parsed.deltaS) || 0,
    deltaG: Number(parsed.deltaG) || 0,
    optimalTemp: Number(parsed.optimalTemp) || temperature,
    confidence: Number(parsed.confidence) || 0,
    description: parsed.description ?? '',
    safetyWarning: parsed.safetyWarning ?? null,
    isNobleGasReaction: Boolean(parsed.isNobleGasReaction),
    isAlloy: Boolean(parsed.isAlloy),
    color: '#00f0ff',
  };
}
