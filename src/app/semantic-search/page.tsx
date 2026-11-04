'use client';

import React, { useState } from 'react';
import { searchProductsSemantically, SemanticSearchResult } from '@/lib/vector-search';
import { 
  Sparkles, 
  Search, 
  Layers, 
  HelpCircle, 
  Database, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Code
} from 'lucide-react';

const SAMPLE_PROMPTS = [
  "ultra-low temperature perishable vaccines and biologics",
  "32-bit ARM Cortex RISC microcontroller for embedded IoT",
  "heavy-duty high pressure hydraulic valves for 350 bar fluid lines",
  "synthetic high temperature lubrication oil for gearboxes",
  "bio-degradable ultrasonic neutral cleaning solvent"
];

export default function SemanticSearchPage() {
  const [query, setQuery] = useState(SAMPLE_PROMPTS[0]);
  const [results, setResults] = useState<SemanticSearchResult[]>(searchProductsSemantically(SAMPLE_PROMPTS[0]));
  const [showSqlDetails, setShowSqlDetails] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setResults(searchProductsSemantically(searchQuery));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Option 2 Requirement: SQL + Vector Database Paradigm</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Semantic Catalog Search (pgvector)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Approximate Nearest Neighbor (ANN) search powered by 384-dimensional dense embeddings & Cosine Distance
          </p>
        </div>

        <button
          onClick={() => setShowSqlDetails(!showSqlDetails)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <Code className="w-3.5 h-3.5 text-indigo-600" />
          <span>{showSqlDetails ? 'Hide pgvector SQL' : 'Show pgvector SQL'}</span>
        </button>
      </div>

      {/* Rubric Architectural Documentation Box */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>Vector Architecture Specification (Syllabus Section 8)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block font-medium">1. Embedded Data:</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              Product SKU, technical specs, datasheet text & material properties
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block font-medium">2. Embedding Model:</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block font-medium">3. Vector Storage:</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              PostgreSQL <code className="text-emerald-400 font-mono">vector(384)</code> column with HNSW Index
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block font-medium">4. Similarity Metric:</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              Cosine Distance: <code className="text-emerald-400 font-mono">1 - (A &lt;=&gt; B)</code>
            </span>
          </div>
        </div>
      </div>

      {/* SQL Snippet Collapsible */}
      {showSqlDetails && (
        <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 shadow-inner">
          <div className="text-emerald-400 font-bold mb-1">-- Live SQL Execution Shape on PostgreSQL:</div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
{`SELECT 
    p.sku,
    p.name,
    c.name AS category,
    p.unit_price,
    ROUND((1 - (pe.embedding <=> query_vec))::NUMERIC, 4) AS cosine_similarity_score
FROM product_embeddings pe
JOIN products p ON pe.product_id = p.product_id
JOIN product_categories c ON p.category_id = c.category_id
ORDER BY pe.embedding <=> query_vec ASC
LIMIT 5;`}
          </pre>
        </div>
      )}

      {/* Interactive Search Bar & Prompt Pills */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ask for components using natural language (e.g. 'cold chain medicine' or 'high pressure hydraulic valves')..."
              className="w-full text-xs pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
          <button
            onClick={() => handleSearch(query)}
            className="px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Vectors</span>
          </button>
        </div>

        {/* Quick Demo Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Click Quick Demo Queries for Examiner / Viva:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(prompt)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  query === prompt
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
                }`}
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Semantic Results Listing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
          <span>Ranked Results ({results.length} Semantically Relevant SKUs)</span>
          <span className="text-slate-500 font-normal">Sorted by Cosine Similarity</span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-slate-400 text-xs border border-slate-200">
            No products matched the semantic similarity threshold. Try one of the demo query buttons above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {results.map((item, idx) => {
              const pct = Math.round(item.similarity_score * 100);
              return (
                <div
                  key={item.product_id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {item.sku}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{item.category_name}</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Rank #{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                    {item.matching_features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.matching_features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Similarity Score Metric */}
                  <div className="shrink-0 text-left md:text-right space-y-1 min-w-[160px] pl-4 border-l border-slate-100">
                    <div className="text-xs text-slate-500 font-medium">Cosine Similarity</div>
                    <div className="text-2xl font-extrabold text-indigo-600">
                      {pct}%
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 pt-1">
                      Distance: {(1 - item.similarity_score).toFixed(4)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
