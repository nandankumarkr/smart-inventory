import { MOCK_PRODUCTS } from './mock-data';

// Precomputed semantic keyword dictionaries mapping concepts to products for instant in-browser semantic simulation
const SEMANTIC_TOPIC_MAP: Record<string, string[]> = {
  // Medical & Cold Chain
  'cold': ['SKU-VAX-COV2', 'SKU-INSULIN-100'],
  'chain': ['SKU-VAX-COV2', 'SKU-INSULIN-100'],
  'vaccine': ['SKU-VAX-COV2'],
  'virus': ['SKU-VAX-COV2'],
  'mrna': ['SKU-VAX-COV2'],
  'temperature': ['SKU-VAX-COV2', 'SKU-INSULIN-100', 'SKU-SENS-BMP280'],
  'freeze': ['SKU-VAX-COV2'],
  'refrigerated': ['SKU-VAX-COV2', 'SKU-INSULIN-100'],
  'diabetes': ['SKU-INSULIN-100'],
  'insulin': ['SKU-INSULIN-100'],
  'pharma': ['SKU-VAX-COV2', 'SKU-INSULIN-100'],
  'medicine': ['SKU-VAX-COV2', 'SKU-INSULIN-100'],
  'perishable': ['SKU-VAX-COV2', 'SKU-INSULIN-100', 'SKU-LUB-SYN-20'],

  // Electronics & Sensors
  'chip': ['SKU-STM32-01'],
  'microcontroller': ['SKU-STM32-01'],
  'mcu': ['SKU-STM32-01'],
  'arm': ['SKU-STM32-01'],
  'processor': ['SKU-STM32-01'],
  'cortex': ['SKU-STM32-01'],
  'embedded': ['SKU-STM32-01', 'SKU-SENS-BMP280'],
  'sensor': ['SKU-SENS-BMP280'],
  'pressure': ['SKU-SENS-BMP280', 'SKU-VALVE-HYD-50'],
  'barometric': ['SKU-SENS-BMP280'],
  'weather': ['SKU-SENS-BMP280'],
  'altitude': ['SKU-SENS-BMP280'],

  // Mechanical & Hydraulics
  'valve': ['SKU-VALVE-HYD-50'],
  'hydraulic': ['SKU-VALVE-HYD-50', 'SKU-PUMP-ROT-02'],
  'fluid': ['SKU-VALVE-HYD-50', 'SKU-PUMP-ROT-02', 'SKU-LUB-SYN-20'],
  'pump': ['SKU-PUMP-ROT-02'],
  'gear': ['SKU-PUMP-ROT-02', 'SKU-LUB-SYN-20'],
  'high pressure': ['SKU-VALVE-HYD-50'],
  'solenoid': ['SKU-VALVE-HYD-50'],
  'bar': ['SKU-VALVE-HYD-50'],

  // Chemicals & Lubrication
  'oil': ['SKU-LUB-SYN-20'],
  'lubricant': ['SKU-LUB-SYN-20'],
  'synthetic': ['SKU-LUB-SYN-20'],
  'cleaner': ['SKU-REAG-CLEAN-5'],
  'solvent': ['SKU-REAG-CLEAN-5'],
  'degreaser': ['SKU-REAG-CLEAN-5'],
  'ultrasonic': ['SKU-REAG-CLEAN-5'],
  'chemical': ['SKU-LUB-SYN-20', 'SKU-REAG-CLEAN-5']
};

export interface SemanticSearchResult {
  product_id: string;
  sku: string;
  name: string;
  description: string;
  category_name: string;
  unit_price: number;
  cost_price: number;
  total_on_hand: number;
  similarity_score: number;
  matching_features: string[];
}

/**
 * Calculates cosine similarity between two numeric vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Simulates semantic AI vector search across product catalog
 */
export function searchProductsSemantically(query: string): SemanticSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored = MOCK_PRODUCTS.map(product => {
    let score = 0.35; // baseline noise
    const matchedFeatures: string[] = [];

    // Exact name match
    if (product.name.toLowerCase().includes(normalizedQuery)) {
      score += 0.50;
      matchedFeatures.push('Direct title match');
    }

    // Exact description match
    if (product.description.toLowerCase().includes(normalizedQuery)) {
      score += 0.35;
      matchedFeatures.push('Full specification match');
    }

    // Semantic dictionary association
    for (const [concept, skus] of Object.entries(SEMANTIC_TOPIC_MAP)) {
      if (normalizedQuery.includes(concept) || queryTokens.includes(concept)) {
        if (skus.includes(product.sku)) {
          score += 0.40;
          matchedFeatures.push(`Semantic concept: "${concept}"`);
        }
      }
    }

    // Perishable attribute inference
    if ((normalizedQuery.includes('perish') || normalizedQuery.includes('expire') || normalizedQuery.includes('spoil')) && product.is_perishable) {
      score += 0.25;
      matchedFeatures.push('Perishable goods classification');
    }

    // Normalize score to maximum of 0.985
    const finalScore = Math.min(0.985, parseFloat(score.toFixed(3)));

    return {
      product_id: product.product_id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      category_name: product.category_name || '',
      unit_price: product.unit_price,
      cost_price: product.cost_price,
      total_on_hand: product.total_on_hand || 0,
      similarity_score: finalScore,
      matching_features: Array.from(new Set(matchedFeatures))
    };
  });

  return scored
    .filter(item => item.similarity_score > 0.40)
    .sort((a, b) => b.similarity_score - a.similarity_score);
}
