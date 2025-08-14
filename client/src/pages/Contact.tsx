import { motion } from 'framer-motion';
import { ContactForm } from '../components/ContactForm';
import { fadeInUp, fadeInLeft, fadeInRight } from '../utils/animations';

const contactMethods = [
  {
    icon: 'fas fa-envelope',
    title: 'Email',
    value: 'cosmic.dev@universe.com',
    color: 'from-cosmic-purple to-cosmic-blue',
  },
  {
    icon: 'fab fa-linkedin',
    title: 'LinkedIn',
    value: 'linkedin.com/in/cosmicdev',
    color: 'from-cosmic-purple to-cosmic-blue',
  },
  {
    icon: 'fab fa-github',
    title: 'GitHub',
    value: 'github.com/cosmicdev',
    color: 'from-cosmic-purple to-cosmic-blue',
  },
];

export const Contact = () => {
  return (
    <section className="py-20 pt-32">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-5xl font-bold text-center mb-16 text-glow"
          {...fadeInUp}
        >
          Contact <span className="text-cosmic-purple">Me</span>
        </motion.h2>
        
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
          <motion.div {...fadeInLeft}>
            <h3 className="text-3xl font-bold mb-6 text-cosmic-blue">
              Let's Build Something Cosmic
            </h3>
            <p className="text-lg text-cosmic-gray mb-8">
              Ready to embark on a development journey that transcends the ordinary? 
              Let's create something extraordinary together.
            </p>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`contact-method-${method.title.toLowerCase()}`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center`}>
                    <i className={`${method.icon} text-white`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cosmic-blue">{method.title}</h4>
                    <p className="text-cosmic-gray">{method.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div {...fadeInRight}>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
