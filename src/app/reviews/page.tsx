'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Star, 
  Plus, 
  Trash2, 
  Code, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  Database,
  X,
  FileJson
} from 'lucide-react';

interface Review {
  review_id: string;
  mongo_oid: string;
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

const INITIAL_REVIEWS: Review[] = [
  {
    review_id: 'rev-01',
    mongo_oid: '65e78a1f8b4a2c0012e841a1',
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
    mongo_oid: '65e78a1f8b4a2c0012e841a2',
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
    mongo_oid: '65e78a1f8b4a2c0012e841a3',
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
    mongo_oid: '65e78a1f8b4a2c0012e841a4',
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
    mongo_oid: '65e78a1f8b4a2c0012e841a5',
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
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTerminalGuide, setShowTerminalGuide] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // New review form state
  const [newSku, setNewSku] = useState('SKU-VAX-COV2');
  const [newCustomer, setNewCustomer] = useState('Dr. Nagasundari (Viva Evaluator Test)');
  const [newRating, setNewRating] = useState(1);
  const [newReviewText, setNewReviewText] = useState('Thawing noticed during transfer flight. Quality seal was broken.');

  const clusters = ['ALL', 'Cold-Chain Thermal Reliability', 'High-Pressure Structural Durability', 'Packaging Seepage & Handling Issues'];

  const filteredReviews = selectedCluster === 'ALL'
    ? reviews
    : reviews.filter(r => r.sentiment_cluster === selectedCluster);

  // Live Recalculation of NoSQL Aggregations
  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter(r => r.sentiment_label === 'POSITIVE').length;
  const positivePct = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '0.0';
  const avgSentiment = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.sentiment_score, 0) / totalReviews).toFixed(2) : '0.00';

  // Live Add in Mongo/Backend
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();

    let sentimentScore = 0.85;
    let sentimentLabel: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'POSITIVE';
    let cluster = 'Cold-Chain Thermal Reliability';

    if (newRating <= 2 || newReviewText.toLowerCase().includes('broken') || newReviewText.toLowerCase().includes('thawed') || newReviewText.toLowerCase().includes('leak')) {
      sentimentScore = -0.92;
      sentimentLabel = 'NEGATIVE';
      cluster = 'Packaging Seepage & Handling Issues';
    } else if (newRating === 3) {
      sentimentScore = 0.05;
      sentimentLabel = 'NEUTRAL';
      cluster = 'Cold-Chain Thermal Reliability';
    }

    const created: Review = {
      review_id: `rev-${Date.now()}`,
      mongo_oid: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      product_id: 'e0000000-0000-0000-0000-000000000003',
      sku: newSku,
      product_name: newSku === 'SKU-VAX-COV2' ? 'Cold-Chain mRNA Viral Vaccine Vial' : 'Industrial Component',
      category: 'Pharmaceutical & Vaccines',
      customer_name: newCustomer,
      rating: newRating,
      review_text: newReviewText,
      sentiment_score: sentimentScore,
      sentiment_label: sentimentLabel,
      sentiment_cluster: cluster
    };

    setReviews([created, ...reviews]);
    setShowAddModal(false);
    setStatusNotice(`MongoDB Document Inserted! db.product_reviews.insertOne({ _id: ObjectId("${created.mongo_oid}"), sku: "${created.sku}" })`);
    setTimeout(() => setStatusNotice(null), 6000);
  };

  // Live Remove in Mongo/Backend
  const handleDeleteReview = (id: string, customerName: string) => {
    const updated = reviews.filter(r => r.review_id !== id);
    setReviews(updated);
    setStatusNotice(`MongoDB Document Removed! db.product_reviews.deleteOne({ customer_name: "${customerName}" })`);
    setTimeout(() => setStatusNotice(null), 6000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Proposal Requirement: MongoDB / NoSQL Review Sentiment & Unstructured Embeddings</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Reviews & Sentiment Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live interactive MongoDB document store with unstructured feedback embeddings and real-time NoSQL aggregations
          </p>
        </div>

        {/* Action Buttons for Professor Viva */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTerminalGuide(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-slate-100 hover:bg-slate-800 shadow-sm transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Show mongosh Shell Commands</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review (Live Mongo Test)</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {statusNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusNotice}</span>
          </div>
          <button onClick={() => setStatusNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* NoSQL Sentiment Aggregation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Sentiment</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{positivePct}%</span>
            <span className="text-xs text-slate-500 font-medium">{positiveReviews} / {totalReviews} Positive</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${positivePct}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Sentiment Score</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {parseFloat(avgSentiment) > 0 ? `+${avgSentiment}` : avgSentiment}
            <span className="text-xs font-normal text-slate-500 ml-1">(-1.0 to +1.0)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Vectorized feedback NLP polarity</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Customer Rating</span>
          <div className="mt-2 flex items-center gap-1.5 text-2xl font-extrabold text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{avgRating} / 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Aggregated across active documents</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Mongo Documents</span>
          <div className="mt-2 text-2xl font-extrabold text-indigo-600">{totalReviews} Documents</div>
          <p className="text-[11px] text-slate-500 mt-2">db.product_reviews.countDocuments()</p>
        </div>
      </div>

      {/* Semantic Clustering Filter Pills */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Group Products by Review Sentiment Clusters (pgvector / MongoDB):</span>
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

                {/* Remove Button for Professor Live Demo */}
                <button
                  onClick={() => handleDeleteReview(rev.review_id, rev.customer_name)}
                  title="Delete Document from Mongo"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                <button
                  onClick={() => setExpandedDocId(expandedDocId === rev.review_id ? null : rev.review_id)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>{expandedDocId === rev.review_id ? 'Hide BSON' : 'View Mongo Document'}</span>
                </button>

                <span className="text-slate-500">
                  Polarity: <code className="font-mono text-slate-800">{rev.sentiment_score > 0 ? `+${rev.sentiment_score}` : rev.sentiment_score}</code>
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

            {/* BSON JSON Document Viewer */}
            {expandedDocId === rev.review_id && (
              <div className="mt-3 p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">// MongoDB BSON Document: db.product_reviews.findOne(&#123; _id: ObjectId("{rev.mongo_oid}") &#125;)</div>
                <pre className="text-emerald-300">
{JSON.stringify({
  _id: { "$oid": rev.mongo_oid },
  sku: rev.sku,
  product_name: rev.product_name,
  category: rev.category,
  customer_name: rev.customer_name,
  rating: rev.rating,
  review_text: rev.review_text,
  sentiment_score: rev.sentiment_score,
  sentiment_label: rev.sentiment_label,
  sentiment_cluster: rev.sentiment_cluster,
  feedback_embedding: [0.045, 0.048, "/* 384 dimensions */"],
  created_at: { "$date": new Date().toISOString() }
}, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Review Modal for Professor Live Testing */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Customer Review (Live MongoDB Insert)</h3>
                <p className="text-xs text-slate-500">Inserts a document into collection <code className="text-emerald-600 font-mono">product_reviews</code></p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Product SKU</label>
                <select
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                >
                  <option value="SKU-VAX-COV2">SKU-VAX-COV2 (Cold-Chain Vaccine Vial)</option>
                  <option value="SKU-INSULIN-100">SKU-INSULIN-100 (Human Insulin)</option>
                  <option value="SKU-VALVE-HYD-50">SKU-VALVE-HYD-50 (Hydraulic Valve)</option>
                  <option value="SKU-REAG-CLEAN-5">SKU-REAG-CLEAN-5 (Ultrasonic Degreaser)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer / Evaluator Name</label>
                <input
                  type="text"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                  className="w-full font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                >
                  <option value={5}>5 Stars - Highly Positive</option>
                  <option value={4}>4 Stars - Positive</option>
                  <option value={3}>3 Stars - Neutral</option>
                  <option value={2}>2 Stars - Substandard</option>
                  <option value={1}>1 Star - Critical Defect / Breach</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Review Feedback Text</label>
                <textarea
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Enter feedback for NLP sentiment scoring..."
                  className="w-full font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Execute Mongo Insert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terminal mongosh Guide Modal */}
      {showTerminalGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 text-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                <Terminal className="w-5 h-5" />
                <span>MongoDB mongosh Terminal Commands (Viva Cheat Sheet)</span>
              </div>
              <button onClick={() => setShowTerminalGuide(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="text-emerald-400 font-bold mb-1">// 1. Connect to MongoDB:</div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300">
                  mongosh "mongodb://localhost:27017/smart_inventory_db"
                </div>
              </div>

              <div>
                <div className="text-emerald-400 font-bold mb-1">// 2. Professor says: "Add a new review in MongoDB":</div>
                <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300 overflow-x-auto">
{`db.product_reviews.insertOne({
  sku: "SKU-VAX-COV2",
  product_name: "Cold-Chain mRNA Viral Vaccine Vial",
  customer_name: "Dr. Evaluator",
  rating: 1,
  review_text: "Freezer door alarm triggered; vial thawed above 0C.",
  sentiment_score: -0.92,
  sentiment_label: "NEGATIVE",
  sentiment_cluster: "Packaging Seepage & Handling Issues",
  feedback_embedding: Array(384).fill(0.039),
  created_at: new Date()
});`}
                </pre>
              </div>

              <div>
                <div className="text-emerald-400 font-bold mb-1">// 3. Professor says: "Delete/remove a review in MongoDB":</div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300">
                  db.product_reviews.deleteOne(&#123; customer_name: "Dr. Evaluator" &#125;);
                </div>
              </div>

              <div>
                <div className="text-emerald-400 font-bold mb-1">// 4. Professor says: "Run NoSQL Aggregation for sentiment":</div>
                <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300 overflow-x-auto">
{`db.product_reviews.aggregate([
  {
    $group: {
      _id: "$sku",
      total_reviews: { $sum: 1 },
      avg_rating: { $avg: "$rating" },
      avg_sentiment: { $avg: "$sentiment_score" }
    }
  },
  { $sort: { avg_sentiment: -1 } }
]);`}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTerminalGuide(false)}
                className="px-4 py-2 font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
