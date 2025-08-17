import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight } from '../utils/animations';

// Categorias de stacks
const stackCategories = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: '💻',
    description: 'Tecnologias para desenvolvimento de interfaces de usuário',
    stacks: [
      { name: 'React.js', level: 95, icon: '⚛️' },
      { name: 'Next.js', level: 90, icon: '🔄' },
      { name: 'TypeScript', level: 90, icon: '📘' },
      { name: 'JavaScript (ES6+)', level: 95, icon: '📜' },
      { name: 'HTML5 & CSS3', level: 98, icon: '🎨' },
      { name: 'Tailwind CSS', level: 90, icon: '🎨' },
      { name: 'Redux / Zustand', level: 85, icon: '🔄' },
      { name: 'GraphQL', level: 80, icon: '📊' },
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: '⚙️',
    description: 'Tecnologias para desenvolvimento de servidores e APIs',
    stacks: [
      { name: 'Node.js', level: 92, icon: '🟢' },
      { name: 'Express.js', level: 90, icon: '🚀' },
      { name: 'NestJS', level: 85, icon: '🦅' },
      { name: 'Python', level: 88, icon: '🐍' },
      { name: 'Django', level: 80, icon: '🎸' },
      { name: 'FastAPI', level: 82, icon: '⚡' },
      { name: 'RESTful APIs', level: 90, icon: '🌐' },
      { name: 'WebSockets', level: 85, icon: '🔌' },
    ]
  },
  {
    id: 'database',
    name: 'Banco de Dados',
    icon: '🗄️',
    description: 'Sistemas de armazenamento e gerenciamento de dados',
    stacks: [
      { name: 'PostgreSQL', level: 90, icon: '🐘' },
      { name: 'MongoDB', level: 85, icon: '🍃' },
      { name: 'MySQL', level: 80, icon: '🐬' },
      { name: 'Redis', level: 75, icon: '🔴' },
      { name: 'Firebase', level: 80, icon: '🔥' },
      { name: 'Prisma', level: 85, icon: '✨' },
      { name: 'Drizzle ORM', level: 88, icon: '🌧️' },
      { name: 'TypeORM', level: 80, icon: '🔷' },
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: '☁️',
    description: 'Infraestrutura e operações de desenvolvimento',
    stacks: [
      { name: 'Docker', level: 85, icon: '🐳' },
      { name: 'Kubernetes', level: 75, icon: '☸️' },
      { name: 'AWS', level: 80, icon: '☁️' },
      { name: 'Vercel', level: 90, icon: '▲' },
      { name: 'Git & GitHub', level: 95, icon: '🐙' },
      { name: 'CI/CD', level: 85, icon: '🔄' },
      { name: 'Nginx', level: 75, icon: '🔹' },
      { name: 'Linux', level: 85, icon: '🐧' },
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: '📱',
    description: 'Desenvolvimento de aplicativos móveis',
    stacks: [
      { name: 'React Native', level: 85, icon: '⚛️' },
      { name: 'Expo', level: 80, icon: '🎪' },
      { name: 'Flutter', level: 70, icon: '🦋' },
      { name: 'Ionic', level: 65, icon: '⚡' },
    ]
  },
  {
    id: 'others',
    name: 'Outras Habilidades',
    icon: '🧰',
    description: 'Ferramentas e tecnologias adicionais',
    stacks: [
      { name: 'TypeScript', level: 90, icon: '🔷' },
      { name: 'GraphQL', level: 85, icon: '📊' },
      { name: 'Jest & Testing Library', level: 80, icon: '🧪' },
      { name: 'Cypress', level: 75, icon: '⚡' },
      { name: 'Figma', level: 85, icon: '🎨' },
      { name: 'Scrum & Agile', level: 90, icon: '🔄' },
    ]
  },
];

const StackCard = ({ stack, index }: { stack: typeof stackCategories[0]['stacks'][0], index: number }) => (
  <motion.div
    className="bg-gradient-to-r from-cosmic-purple/10 to-cosmic-blue/10 p-4 rounded-lg border border-cosmic-purple/20 hover:border-cosmic-blue/50 transition-all duration-300"
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(107, 76, 255, 0.1), 0 10px 10px -5px rgba(107, 76, 255, 0.04)' }}
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    custom={index * 0.1}
  >
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-medium text-lg flex items-center gap-2">
        <span className="text-2xl">{stack.icon}</span>
        {stack.name}
      </h4>
      <span className="text-sm text-gray-400">{stack.level}%</span>
    </div>
    <div className="w-full bg-gray-800 rounded-full h-2">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue"
        initial={{ width: 0 }}
        animate={{ width: `${stack.level}%` }}
        transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
      />
    </div>
  </motion.div>
);

export const Stacks = () => {
  return (
    <section className="py-20 pt-32 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cosmic-purple to-cosmic-blue">
            Minhas Stacks Tecnológicas
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça as tecnologias e ferramentas que utilizo para criar aplicações incríveis e de alto desempenho.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stackCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-cosmic-purple/50 transition-all duration-300"
              initial="hidden"
              animate="visible"
              variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
              custom={index * 0.2}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
              <p className="text-gray-400 mb-6">{category.description}</p>
              
              <div className="space-y-4">
                {category.stacks.map((stack, i) => (
                  <StackCard key={stack.name} stack={stack} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h3 className="text-2xl font-bold mb-4">Evolução Contínua</h3>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Estou sempre aprendendo e me atualizando com as últimas tecnologias e melhores práticas do mercado.
            Meu objetivo é criar soluções inovadoras que resolvam problemas reais.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Stacks;
