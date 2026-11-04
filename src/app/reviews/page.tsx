'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  BarChart3, 
  Layers, 
  Database,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface Review {
  review_id: string;
  product_id: string;
  sku: string;
  product_name: string;
  category: string;
  customer_name: string;
  rating: number;
  review_text: string;
  sentiment_score: number;
  sentiment_label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  sentiment_cluster: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    review_id: 'rev-01',
    product_id: 'e0000000-0000-0000-0000-000000000003',
    sku: 'SKU-VAX-COV2',
    product_name: 'Cold-Chain mRNA Viral Vaccine Vial',
    category: 'Pharmaceutical & Vaccines',
    customer_name: 'Dr. Alok Verma (Chief Medical Officer)',
    rating: 5,
    review_text: 'Exceptional cold chain integrity. Temperature sensors confirmed storage remained strictly below -15C throughout the delivery corridor.',
    sentiment_score: 0.94,
    sentiment_label: 'POSITIVE',
    sentiment_cluster: 'Cold-Chain Thermal Reliability'
  },
  {
    review_id: 'rev-02',
    product_id: 'e0000000-0000-0000-0000-000000000004',
    sku: 'SKU-INSULIN-100',
    product_name: 'Recombinant Human Insulin 100IU/ml',
    category: 'Pharmaceutical & Vaccines',
    customer_name: 'Nurse Sneha Pillai (Apollo Hospital)',
    rating: 5,
    review_text: 'Highly stable insulin formulation. Rapid same-day delivery from Delhi cold hub prevented degradation. Packaging seals were immaculate.',
    sentiment_score: 0.89,
    sentiment_label: 'POSITIVE',
    sentiment_cluster: 'Cold-Chain Thermal Reliability'
  },
  {
    review_id: 'rev-03',
    product_id: 'e0000000-0000-0000-0000-000000000005',
    sku: 'SKU-VALVE-HYD-50',
    product_name: 'High-Pressure Hydraulic Directional Valve',
    category: 'Precision Mechanical',
    customer_name: 'Rohan Sengupta (Industrial Plant Lead)',
    rating: 4,
    review_text: 'Directional valve held up to 340 bar continuous duty cycle without hydraulic leakages. High quality cast iron body.',
    sentiment_score: 0.72,
    sentiment_label: 'POSITIVE',
    sentiment_cluster: 'High-Pressure Structural Durability'
  },
  {
    review_id: 'rev-04',
    product_id: 'e0000000-0000-0000-0000-000000000006',
    sku: 'SKU-PUMP-ROT-02',
    product_name: 'Rotary Gear Lubrication Pump',
    category: 'Precision Mechanical',
    customer_name: 'Vikram Joshi (Hydraulics Tech)',
    rating: 4,
    review_text: 'Smooth gear actuation and self-priming capability works reliably even at high temperatures and continuous operation.',
    sentiment_score: 0.68,
    sentiment_label: 'POSITIVE',
    sentiment_cluster: 'High-Pressure Structural Durability'
  },
  {
    review_id: 'rev-05',
    product_id: 'e0000000-0000-0000-0000-000000000008',
    sku: 'SKU-REAG-CLEAN-5',
    product_name: 'Bio-Degradable Ultrasonic Degreaser 5L',
    category: 'Specialty Chemicals',
    customer_name: 'Suresh Kumar (Maintenance Supv)',
    rating: 2,
    review_text: 'Solvent cleans well but container lid had minor seepage during warehouse transit. Odor requires ventilation.',
    sentiment_score: -0.45,
    sentiment_label: 'NEGATIVE',
    sentiment_cluster: 'Packaging Seepage & Handling Issues'
  }
];

export default function ReviewsPage() {
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');

  const clusters = ['ALL', 'Cold-Chain Thermal Reliability', 'High-Pressure Structural Durability', 'Packaging Seepage & Handling Issues'];

  const filteredReviews = selectedCluster === 'ALL'
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.filter(r => r.sentiment_cluster === selectedCluster);

  // Compute NoSQL Aggregations
  const totalReviews = MOCK_REVIEWS.length;
  const positivePct = Math.round((MOCK_REVIEWS.filter(r => r.sentiment_label === 'POSITIVE').length / totalReviews) * 100);
  const avgRating = (MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1);
  const avgSentiment = (MOCK_REVIEWS.reduce((acc, r) => acc + r.sentiment_score, 0) / totalReviews).toFixed(2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Proposal Requirement: Customer Review Sentiment & Unstructured Embeddings</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Reviews & Sentiment Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Groups similar products based on customer review sentiment embeddings and NoSQL aggregation pipelines
          </p>
        </div>
      </div>

      {/* NoSQL Sentiment Aggregation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Sentiment</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{positivePct}%</span>
            <span className="text-xs text-slate-500 font-medium">Positive feedback</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${positivePct}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Sentiment Score</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            +{avgSentiment} <span className="text-xs font-normal text-slate-500">(-1.0 to +1.0)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Vectorized feedback NLP polarity</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Customer Rating</span>
          <div className="mt-2 flex items-center gap-1.5 text-2xl font-extrabold text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{avgRating} / 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Across 5 enterprise clients</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semantic Clusters</span>
          <div className="mt-2 text-2xl font-extrabold text-indigo-600">3 Clusters</div>
          <p className="text-[11px] text-slate-500 mt-2">HNSW Vector similarity grouping</p>
        </div>
      </div>

      {/* Semantic Clustering Filter Pills */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Group Products by Review Sentiment Clusters (pgvector / NoSQL):</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Metric: Cosine Distance</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {clusters.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCluster(c)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                selectedCluster === c
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.review_id}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  {rev.sku}
                </span>
                <span className="text-sm font-bold text-slate-900">{rev.product_name}</span>
                <span className="text-xs text-slate-500">({rev.category})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Cluster: {rev.sentiment_cluster}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
              "{rev.review_text}"
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800">{rev.customer_name}</span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 font-semibold">
                <span className="text-slate-500">
                  Polarity Score: <code className="font-mono text-slate-800">{rev.sentiment_score > 0 ? `+${rev.sentiment_score}` : rev.sentiment_score}</code>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rev.sentiment_label === 'POSITIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {rev.sentiment_label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
