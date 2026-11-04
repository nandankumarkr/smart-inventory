/**
 * ============================================================================
 * SMART INVENTORY & AUTOMATED RESTOCK PREDICTOR
 * MongoDB NoSQL Database Script & Viva Demonstration Runner
 * Proposal Requirement: "MongoDB or Pinecone for storing product reviews and 
 *                       unstructured feedback embeddings"
 *                       "NoSQL aggregations for review sentiment analytics"
 * ============================================================================
 * 
 * HOW TO RUN IN TERMINAL / MONGOSH:
 *   mongosh "mongodb://localhost:27017/smart_inventory_db" mongodb_operations.js
 * Or run line-by-line inside mongosh / MongoDB Compass Aggregation Builder.
 */

// 1. Switch to project database
use smart_inventory_db;

// 2. Drop existing collection for clean initialization
db.product_reviews.drop();

// 3. Create collection with JSON Schema Validation
db.createCollection("product_reviews", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sku", "product_name", "customer_name", "rating", "review_text", "sentiment_score", "sentiment_label"],
      properties: {
        sku: { bsonType: "string", description: "Product SKU identifier" },
        product_name: { bsonType: "string" },
        customer_name: { bsonType: "string" },
        rating: { bsonType: "int", minimum: 1, maximum: 5 },
        review_text: { bsonType: "string" },
        sentiment_score: { bsonType: "double", minimum: -1.0, maximum: 1.0 },
        sentiment_label: { enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] },
        sentiment_cluster: { bsonType: "string" },
        feedback_embedding: { bsonType: "array", description: "384-dimensional dense vector embeddings" },
        created_at: { bsonType: "date" }
      }
    }
  }
});

// 4. Create Indexes
db.product_reviews.createIndex({ sku: 1 });
db.product_reviews.createIndex({ sentiment_label: 1 });
db.product_reviews.createIndex({ sentiment_cluster: 1 });
db.product_reviews.createIndex({ review_text: "text" }); // Full text search on review content

// 5. Baseline Seed Data
db.product_reviews.insertMany([
  {
    sku: "SKU-VAX-COV2",
    product_name: "Cold-Chain mRNA Viral Vaccine Vial",
    category: "Pharmaceutical & Vaccines",
    customer_name: "Dr. Alok Verma (Chief Medical Officer)",
    rating: NumberInt(5),
    review_text: "Exceptional cold chain integrity. Temperature sensors confirmed storage remained strictly below -15C throughout the delivery corridor.",
    sentiment_score: 0.94,
    sentiment_label: "POSITIVE",
    sentiment_cluster: "Cold-Chain Thermal Reliability",
    feedback_embedding: Array(384).fill(0.045),
    created_at: new Date("2026-01-20T10:00:00Z")
  },
  {
    sku: "SKU-INSULIN-100",
    product_name: "Recombinant Human Insulin 100IU/ml",
    category: "Pharmaceutical & Vaccines",
    customer_name: "Nurse Sneha Pillai (Apollo Hospital)",
    rating: NumberInt(5),
    review_text: "Highly stable insulin formulation. Rapid same-day delivery from Delhi cold hub prevented degradation. Packaging seals were immaculate.",
    sentiment_score: 0.89,
    sentiment_label: "POSITIVE",
    sentiment_cluster: "Cold-Chain Thermal Reliability",
    feedback_embedding: Array(384).fill(0.046),
    created_at: new Date("2026-01-22T14:30:00Z")
  },
  {
    sku: "SKU-VALVE-HYD-50",
    product_name: "High-Pressure Hydraulic Directional Valve",
    category: "Precision Mechanical",
    customer_name: "Rohan Sengupta (Industrial Plant Lead)",
    rating: NumberInt(4),
    review_text: "Directional valve held up to 340 bar continuous duty cycle without hydraulic leakages. High quality cast iron body.",
    sentiment_score: 0.72,
    sentiment_label: "POSITIVE",
    sentiment_cluster: "High-Pressure Structural Durability",
    feedback_embedding: Array(384).fill(0.052),
    created_at: new Date("2026-01-25T11:15:00Z")
  },
  {
    sku: "SKU-REAG-CLEAN-5",
    product_name: "Bio-Degradable Ultrasonic Degreaser 5L",
    category: "Specialty Chemicals",
    customer_name: "Suresh Kumar (Maintenance Supv)",
    rating: NumberInt(2),
    review_text: "Solvent cleans well but container lid had minor seepage during warehouse transit. Odor requires ventilation.",
    sentiment_score: -0.45,
    sentiment_label: "NEGATIVE",
    sentiment_cluster: "Packaging Seepage & Handling Issues",
    feedback_embedding: Array(384).fill(0.041),
    created_at: new Date("2026-02-01T09:45:00Z")
  }
]);

print("✅ MongoDB Collection 'product_reviews' initialized with 4 baseline seed documents and indexes.");

// ============================================================================
// 6. LIVE DEMONSTRATION COMMANDS FOR THE PROFESSOR:
// ============================================================================

/**
 * [COMMAND A]: PROFESSOR ASKS: "Add a new customer review to MongoDB"
 */
function liveDemoAddReview() {
  const newReview = {
    sku: "SKU-VAX-COV2",
    product_name: "Cold-Chain mRNA Viral Vaccine Vial",
    category: "Pharmaceutical & Vaccines",
    customer_name: "Dr. Nagasundari (Viva Evaluator Test)",
    rating: NumberInt(1),
    review_text: "Freezer door sensor alarm triggered; batch reached +4C, violating cold chain SLA.",
    sentiment_score: -0.92,
    sentiment_label: "NEGATIVE",
    sentiment_cluster: "Packaging Seepage & Handling Issues",
    feedback_embedding: Array(384).fill(0.039),
    created_at: new Date()
  };

  const result = db.product_reviews.insertOne(newReview);
  print("Inserted Document ID:", result.insertedId);
  return result;
}

/**
 * [COMMAND B]: PROFESSOR ASKS: "Remove / Delete a review from MongoDB"
 */
function liveDemoRemoveReview(customerName) {
  const result = db.product_reviews.deleteOne({ customer_name: customerName || "Dr. Nagasundari (Viva Evaluator Test)" });
  print("Deleted Documents Count:", result.deletedCount);
  return result;
}

/**
 * [COMMAND C]: PROFESSOR ASKS: "Run NoSQL Aggregation for Review Sentiment Analytics"
 */
function liveDemoSentimentAggregation() {
  return db.product_reviews.aggregate([
    {
      $group: {
        _id: "$sku",
        product_name: { $first: "$product_name" },
        total_reviews: { $sum: 1 },
        avg_rating: { $avg: "$rating" },
        avg_sentiment_score: { $avg: "$sentiment_score" },
        positive_reviews: {
          $sum: { $cond: [{ $eq: ["$sentiment_label", "POSITIVE"] }, 1, 0] }
        },
        negative_reviews: {
          $sum: { $cond: [{ $eq: ["$sentiment_label", "NEGATIVE"] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        sku: "$_id",
        product_name: 1,
        total_reviews: 1,
        avg_rating: { $round: ["$avg_rating", 2] },
        net_sentiment: { $round: ["$avg_sentiment_score", 2] },
        positive_sentiment_pct: {
          $round: [
            { $multiply: [{ $divide: ["$positive_reviews", "$total_reviews"] }, 100] },
            1
          ]
        }
      }
    },
    { $sort: { avg_rating: -1 } }
  ]).toArray();
}
