const calculateCosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0; // Avoid division by zero
  return dotProduct / (magnitudeA * magnitudeB);
};

export const cosineSimilaritySearch = (queryEmbedding, vectorDatabase, topK = 1) => {
  const similarities = Object.values(vectorDatabase).map(entry => {
    return {
      id: entry.id,
      similarity: calculateCosineSimilarity(queryEmbedding, entry.embedding),
      meta_data: entry.meta_data
    };
  });

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
};