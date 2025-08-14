import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactFormData } from '../types';
import { fadeInUp } from '../utils/animations';
import { PopUp } from './PopUp';
import { sendContactForm } from '../utils/api';

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendContactForm(formData);
      setPopupMessage('Thank you for your message! I\'ll get back to you soon.');
      setPopupType('success');
      setFormData({ name: '', email: '', projectType: '', message: '' });
    } catch (error) {
      setPopupMessage('Failed to send message. Please try again.');
      setPopupType('error');
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
    }
  };

  return (
    <motion.div
      className="glass-effect rounded-2xl p-8"
      {...fadeInUp}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-2 text-cosmic-blue">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-cosmic-black bg-opacity-50 border border-cosmic-purple border-opacity-30 rounded-lg text-white placeholder-cosmic-gray focus:outline-none focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue focus:ring-opacity-50 transition-all duration-300"
            placeholder="Your cosmic name"
            required
            data-testid="input-name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-cosmic-blue">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-cosmic-black bg-opacity-50 border border-cosmic-purple border-opacity-30 rounded-lg text-white placeholder-cosmic-gray focus:outline-none focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue focus:ring-opacity-50 transition-all duration-300"
            placeholder="your@email.com"
            required
            data-testid="input-email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-cosmic-blue">
            Project Type
          </label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-cosmic-black bg-opacity-50 border border-cosmic-purple border-opacity-30 rounded-lg text-white focus:outline-none focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue focus:ring-opacity-50 transition-all duration-300"
            required
            data-testid="select-project-type"
          >
            <option value="">Select project type</option>
            <option value="web-app">Web Application</option>
            <option value="mobile-app">Mobile Application</option>
            <option value="blockchain">Blockchain Project</option>
            <option value="ai-ml">AI/ML Integration</option>
            <option value="consulting">Technical Consulting</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-cosmic-blue">
            Message
          </label>
          <textarea
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-cosmic-black bg-opacity-50 border border-cosmic-purple border-opacity-30 rounded-lg text-white placeholder-cosmic-gray focus:outline-none focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue focus:ring-opacity-50 transition-all duration-300 resize-none"
            placeholder="Tell me about your cosmic project..."
            required
            data-testid="textarea-message"
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-purple-vivid rounded-lg font-bold hover:shadow-xl hover:shadow-cosmic-purple/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-testid="button-submit-contact"
        >
          <i className="fas fa-rocket mr-2"></i>
          {isSubmitting ? 'Launching...' : 'Launch Project'}
        </motion.button>
      </form>

      <PopUp
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupType === 'success' ? 'Message Sent!' : 'Error'}
        message={popupMessage}
        type={popupType}
      />
    </motion.div>
  );
};
