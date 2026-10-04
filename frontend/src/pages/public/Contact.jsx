import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 0' }}>
      <h1 style={{ fontSize: '3rem', color: '#1a4331', marginBottom: '1rem', textAlign: 'center' }}>
        Contact Us
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Have questions? We'd love to hear from you.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', background: '#fff', padding: '3rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Contact Info Sidebar */}
        <div style={{ background: '#f8faf9', padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Get in Touch</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#1a4331', fontSize: '1rem', marginBottom: '0.5rem' }}>📍 Address</h4>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>123 Green Valley Road<br />Bangalore, KA 560001<br />India</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#1a4331', fontSize: '1rem', marginBottom: '0.5rem' }}>📧 Email</h4>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>support@gogreenai.com</p>
          </div>
          
          <div>
            <h4 style={{ color: '#1a4331', fontSize: '1rem', marginBottom: '0.5rem' }}>📞 Phone</h4>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>+91 98765 43210</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2rem', borderRadius: '12px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Message Sent!</h3>
              <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                style={{ marginTop: '2rem', background: 'none', border: '1px solid #2e7d32', color: '#2e7d32', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  rows="5"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
                ></textarea>
              </div>
              <button type="submit" className="btn-register-main" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', border: 'none' }}>
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;
