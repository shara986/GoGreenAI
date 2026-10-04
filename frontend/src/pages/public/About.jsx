import React from 'react';

const About = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 0' }}>
      <h1 style={{ fontSize: '3rem', color: '#1a4331', marginBottom: '2rem', textAlign: 'center' }}>
        About GoGreen <span className="highlight">AI</span>
      </h1>
      
      <div style={{ background: '#fff', padding: '3rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#2e7d32' }}>Our Mission</h2>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', lineHeight: '1.8' }}>
          At GoGreen AI, our mission is to bridge the gap between technology and nature. 
          We believe that everyone deserves a vibrant, healthy green space, whether you're a seasoned botanist or a first-time plant parent.
          By connecting local nursery owners directly with plant enthusiasts, we're building a sustainable ecosystem that benefits everyone.
        </p>

        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#2e7d32' }}>The Technology</h2>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', lineHeight: '1.8' }}>
          What sets GoGreen AI apart is our integration of cutting-edge artificial intelligence. 
          Our AI Diagnosis tool allows users to upload photos of their plants to instantly identify diseases, pests, or nutrient deficiencies, 
          providing actionable care instructions tailored to the specific plant species.
        </p>

        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#2e7d32' }}>For Nursery Owners</h2>
        <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8' }}>
          We provide a comprehensive dashboard for nursery owners to manage their inventory, track sales, and reach a broader audience. 
          Our platform simplifies the digital transition for traditional nurseries, allowing them to focus on what they do best: growing beautiful plants.
        </p>
      </div>
    </div>
  );
};

export default About;
