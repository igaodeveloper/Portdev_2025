import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { FiCode, FiSmartphone, FiServer, FiLayers, FiDatabase, FiShield } from 'react-icons/fi';

const services = [
  {
    icon: <FiCode className="w-8 h-8 text-cosmic-purple" />,
    title: 'Desenvolvimento Web',
    description: 'Criação de sites e aplicações web modernas, responsivas e de alto desempenho utilizando as melhores tecnologias do mercado.',
    features: [
      'Sites institucionais',
      'Landing Pages',
      'Aplicações Web Progressivas (PWA)',
      'E-commerces',
      'Sistemas Web Personalizados'
    ]
  },
  {
    icon: <FiSmartphone className="w-8 h-8 text-cosmic-blue" />,
    title: 'Aplicativos Móveis',
    description: 'Desenvolvimento de aplicativos nativos e híbridos para iOS e Android com excelente experiência do usuário.',
    features: [
      'Aplicativos nativos (iOS/Android)',
      'Aplicativos híbridos (React Native/Flutter)',
      'UI/UX otimizada',
      'Integração com APIs',
      'Publicação nas lojas de aplicativos'
    ]
  },
  {
    icon: <FiServer className="w-8 h-8 text-cosmic-pink" />,
    title: 'Backend & APIs',
    description: 'Desenvolvimento de APIs robustas e escaláveis para alimentar suas aplicações com segurança e desempenho.',
    features: [
      'APIs RESTful',
      'GraphQL',
      'Autenticação e Autorização',
      'Microserviços',
      'Otimização de desempenho'
    ]
  },
  {
    icon: <FiLayers className="w-8 h-8 text-cosmic-cyan" />,
    title: 'Sistemas Personalizados',
    description: 'Soluções sob medida para atender necessidades específicas do seu negócio ou projeto.',
    features: [
      'Sistemas de gestão',
      'Automação de processos',
      'Soluções empresariais',
      'Integração entre sistemas',
      'Migração de legados'
    ]
  },
  {
    icon: <FiDatabase className="w-8 h-8 text-cosmic-yellow" />,
    title: 'Banco de Dados',
    description: 'Modelagem, implementação e otimização de bancos de dados relacionais e não relacionais.',
    features: [
      'Modelagem de dados',
      'Otimização de consultas',
      'MongoDB, PostgreSQL, MySQL',
      'Migrations',
      'Backup e recuperação'
    ]
  },
  {
    icon: <FiShield className="w-8 h-8 text-cosmic-green" />,
    title: 'Segurança da Informação',
    description: 'Proteção de dados e sistemas contra ameaças cibernéticas com as melhores práticas de segurança.',
    features: [
      'Análise de vulnerabilidades',
      'Proteção contra ataques',
      'Criptografia de dados',
      'LGPD/GDPR',
      'Auditoria de segurança'
    ]
  }
];

export const Services = () => {
  return (
    <motion.div 
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cosmic-dark to-cosmic-darker"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nossos <span className="text-cosmic-purple">Serviços</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluções tecnológicas personalizadas para impulsionar seu negócio no mundo digital
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-cosmic-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-cosmic-dark/50 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-400">
                    <svg className="w-4 h-4 mr-2 text-cosmic-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center bg-cosmic-card/50 rounded-2xl p-8 backdrop-blur-sm"
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para transformar suas ideias em realidade?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Vamos conversar sobre como posso ajudar a levar seu projeto para o próximo nível.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => window.open('https://wa.me/5511982928508?text=Olá! Gostaria de mais informações sobre seus serviços.', '_blank')}
              className="bg-cosmic-purple hover:bg-cosmic-purple/90 text-white font-medium py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" className="text-white">
                <path d="M16 0C7.163 0 0 7.163 0 16C0 19.16 0.95 22.103 2.6 24.6L0.9 32L8.55 30.3C10.9 31.8 13.85 32.7 16.9 32.7C24.737 32.7 31 25.837 31 18C31 8.063 24.737 0 16 0ZM24.8 23.1C24.8 23.1 23.25 25.3 22.4 25.3C21.55 25.3 17.4 23.1 16.9 22.7C16.05 22.3 13.2 21.5 12.4 19.7C11.6 17.9 12.4 16.5 12.8 15.6C13.2 14.7 14.5 14.3 14.85 14.3C15.2 14.3 15.55 14.3 15.75 14.3C16.1 14.3 16.6 14.3 16.9 15.6C17.2 16.9 18.5 20.8 18.8 21.1C19.1 21.4 19.4 21.4 19.7 21.1C20 20.8 20.6 20.1 21.1 19.5C21.6 18.9 22.1 18.7 22.4 18.7C22.7 18.7 23.15 18.8 23.5 19.2C23.85 19.6 24.8 21.1 24.8 23.1Z" fill="currentColor"/>
              </svg>
              Fale Conosco
            </button>
            <a 
              href="/contact" 
              className="border-2 border-cosmic-purple text-white hover:bg-cosmic-purple/10 font-medium py-3 px-8 rounded-full transition-colors flex items-center justify-center"
            >
              Solicitar Orçamento
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;
