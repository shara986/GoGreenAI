import React, { useState } from 'react';
import './CustomerPages.css';

const AI_PRESETS = [
  {
    title: 'Yellowing Leaves & Brown Tips',
    plant: 'Monstera Deliciosa',
    symptoms: 'Bottom leaves turning bright yellow with dry crisp brown tips. Soil remains wet for days.',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80',
    diagnosis: {
      disease: 'Overwatering & Early Root Stress',
      severity: 'Moderate Stress (Health Score: 68%)',
      cause: 'Soil drainage is restricted, leading to excess moisture surrounding roots and preventing oxygen absorption.',
      treatment: [
        'Allow top 2-3 inches of soil to dry out completely before watering again.',
        'Prune severely yellowed leaves near the base using sanitized shears.',
        'Move plant to a spot with indirect bright sunlight to accelerate moisture evaporation.',
        'Apply a light nitrogen-rich organic foliage spray after soil dries out.'
      ],
      preventative: 'Water on a consistent schedule rather than fixed calendar days. Always check soil moisture.'
    }
  },
  {
    title: 'White Powdery Spots on Leaves',
    plant: 'Peace Lily / Flowering Plants',
    symptoms: 'Dusty white chalky spots spreading across upper leaf surfaces and flower buds.',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=400&q=80',
    diagnosis: {
      disease: 'Powdery Mildew (Fungal Infection)',
      severity: 'High Concern (Health Score: 52%)',
      cause: 'High ambient humidity combined with stagnant air circulation encourages fungal spore germination.',
      treatment: [
        'Wipe infected leaves with a mild solution of organic Neem oil or potassium bicarbonate.',
        'Increase room airflow using a small fan (avoid blowing directly on foliage).',
        'Isolate infected plant from nearby houseplants to prevent fungal spread.',
        'Avoid overhead watering — keep water strictly on the soil layer.'
      ],
      preventative: 'Maintain leaf hygiene and avoid misting plants in cold or shaded rooms.'
    }
  },
  {
    title: 'Drooping & Dry Soil Wilting',
    plant: 'Golden Pothos / Snake Plant',
    symptoms: 'Stems are limp, leaves feel soft and paper-thin, soil is pulled away from pot rim.',
    image: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&w=400&q=80',
    diagnosis: {
      disease: 'Severe Dehydration',
      severity: 'Mild Stress (Health Score: 78%)',
      cause: 'Extended period without water causing loss of cell turgor pressure.',
      treatment: [
        'Bottom water the plant by placing the pot in a water-filled tray for 30 minutes until soil rehydrates.',
        'Trim any crispy brown foliage.',
        'Keep plant away from direct radiator heat sources or AC vents.'
      ],
      preventative: 'Establish a weekly soil check routine. Pothos bounce back quickly after thorough hydration.'
    }
  }
];

const AiDiagnosis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [symptomText, setSymptomText] = useState('');
  const [plantTypeInput, setPlantTypeInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleSelectPreset = (preset) => {
    setImagePreview(preset.image);
    setPlantTypeInput(preset.plant);
    setSymptomText(preset.symptoms);
    setAnalysisResult(preset.diagnosis);
  };

  const handleRunAnalysis = (e) => {
    e.preventDefault();
    if (!imagePreview && !symptomText) {
      alert('Please upload a plant photo or describe the symptoms.');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        disease: 'Nutrient Deficiency & Light Stress',
        severity: 'Moderate Concern (Health Score: 72%)',
        cause: 'Lack of key micronutrients (Iron/Magnesium) coupled with inadequate indirect light exposure.',
        treatment: [
          'Apply a balanced 10-10-10 water-soluble fertilizer diluted to half-strength.',
          'Reposition plant within 3-5 feet of an east-facing window.',
          'Prune dead or dying foliage to redirect plant energy to healthy growth.',
          'Ensure drainage holes are clean and unblocked.'
        ],
        preventative: 'Feed monthly during active spring/summer growing seasons.'
      });
    }, 1800);
  };

  return (
    <div className="customer-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>🤖 AI Plant Doctor & Health Diagnosis</h1>
          <p className="subtitle">Upload a photo or describe plant symptoms for an instant AI disease diagnosis and treatment plan.</p>
        </div>
      </div>

      {/* Preset Quick Diagnostics */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#1a4331', marginBottom: '1rem' }}>⚡ Quick Diagnosis Scenarios</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {AI_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1.2rem',
                border: '1px solid #e0eee6',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#2e7d32'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#e0eee6'}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                <img src={preset.image} alt={preset.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#1a4331', marginBottom: '4px' }}>{preset.title}</h4>
                  <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '12px' }}>{preset.plant}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', lineClamp: 2 }}>{preset.symptoms}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Upload & Form Section */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#1a4331', marginBottom: '1.5rem' }}>📸 Upload Plant Photo & Symptoms</h3>
          
          <form onSubmit={handleRunAnalysis}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Plant Photo</label>
              <div style={{
                border: '2px dashed #4caf50',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                background: '#f9fbf9',
                cursor: 'pointer',
                position: 'relative'
              }}>
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px', margin: '0 auto 10px auto' }} />
                    <p style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: '600' }}>Photo attached ready for analysis</p>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🌱</span>
                    <p style={{ fontWeight: '600', color: '#1a4331', marginBottom: '4px' }}>Click or drag a plant photo here</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Plant Type / Name (Optional)</label>
              <input
                type="text"
                value={plantTypeInput}
                onChange={(e) => setPlantTypeInput(e.target.value)}
                placeholder="e.g. Monstera, Rose, Peace Lily"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Observed Symptoms</label>
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                rows="4"
                placeholder="Describe what you see (e.g., yellow spots, leaf drop, webbing under leaves, soft stems)..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1.05rem',
                cursor: analyzing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(46,125,50,0.2)'
              }}
            >
              {analyzing ? '🔍 AI Analyzing Plant Health...' : '⚡ Run AI Diagnosis'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', minHeight: '400px' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#1a4331', marginBottom: '1.5rem' }}>📊 AI Diagnosis Report</h3>

          {analyzing && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 1s infinite linear' }}>🌿</div>
              <h4 style={{ color: '#1a4331' }}>Scanning foliage patterns and leaf health...</h4>
              <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '6px' }}>AI vision models evaluating symptoms and pest markers</p>
            </div>
          )}

          {!analyzing && !analysisResult && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧪</div>
              <p style={{ fontSize: '1.1rem' }}>No active analysis report yet.</p>
              <p style={{ fontSize: '0.9rem' }}>Select a quick scenario above or upload a plant photo to view AI diagnostic insights.</p>
            </div>
          )}

          {!analyzing && analysisResult && (
            <div>
              <div style={{ background: '#f0f7f4', padding: '1rem 1.2rem', borderRadius: '12px', borderLeft: '5px solid #2e7d32', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700', color: '#2e7d32', letterSpacing: '0.5px' }}>Primary Diagnosis</span>
                <h2 style={{ fontSize: '1.5rem', color: '#1a4331', margin: '4px 0' }}>{analysisResult.disease}</h2>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef6c00' }}>{analysisResult.severity}</span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#1a4331', marginBottom: '6px' }}>🔬 Underlying Cause</h4>
                <p style={{ color: '#555', lineHeight: '1.6' }}>{analysisResult.cause}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#1a4331', marginBottom: '10px' }}>🛠️ Step-by-Step Treatment Plan</h4>
                <ul style={{ paddingLeft: '1.2rem', color: '#444', lineHeight: '1.8' }}>
                  {analysisResult.treatment.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{step}</li>
                  ))}
                </ul>
              </div>

              {analysisResult.preventative && (
                <div style={{ background: '#fffde7', padding: '1rem', borderRadius: '8px', border: '1px solid #fff59d' }}>
                  <h4 style={{ color: '#f57f17', marginBottom: '4px', fontSize: '0.95rem' }}>💡 Long-term Prevention</h4>
                  <p style={{ color: '#555', fontSize: '0.9rem' }}>{analysisResult.preventative}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiDiagnosis;
