import { motion, AnimatePresence } from 'framer-motion';
import { floatAnimation } from '../utils/animations';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation as useWouterLocation } from 'wouter';
import { FiX, FiMessageSquare, FiClock, FiCheck, FiCheckCircle, FiInfo, FiCode, FiBriefcase, FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setLocation] = useWouterLocation();
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! 👋\nSou o assistente virtual do portfólio. Como posso te ajudar hoje?",
      sender: 'bot',
      timestamp: new Date(),
      status: 'read',
      showButtons: true
    },
    {
      id: 2,
      text: "Você pode me perguntar sobre:\n• Serviços oferecidos\n• Experiência profissional\n• Tecnologias utilizadas\n• Formas de contato",
      sender: 'bot',
      timestamp: new Date(),
      status: 'read',
      showButtons: true
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Efeito para rolar para baixo quando novas mensagens forem adicionadas
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Verificar se é mobile e configurar notificações
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Verificar se há notificações não lidas no carregamento
    const hasUnread = localStorage.getItem('whatsappUnread');
    if (hasUnread) {
      setUnreadCount(parseInt(hasUnread));
    }
    
    // Inicializar o contexto da conversa
    const initialContext = {
      lastTopics: [] as string[],
      userInterests: [] as string[],
      conversationStage: 'initial' as 'initial' | 'middle' | 'detailed'
    };
    
    // @ts-ignore
    window.chatContext = initialContext;
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleContactOption = (option: 'whatsapp' | 'email' | 'contact') => {
    if (option === 'whatsapp') {
      const phoneNumber = "5511982928508";
      const url = `https://wa.me/${phoneNumber}?text=Olá! Gostaria de mais informações sobre seus serviços.`;
      window.open(url, '_blank');
    } else if (option === 'email') {
      window.location.href = 'mailto:contato@seuportfolio.com?subject=Contato%20do%20Portfólio&body=Olá,%20gostaria%20de%20mais%20informações%20sobre%20seus%20serviços.';
    } else {
      // Navega para a página de contato e fecha o chat
      setLocation('/contact');
      setTimeout(() => setIsOpen(false), 300); // Pequeno atraso para melhor UX
    }
    setShowContactOptions(false);
  };
  
  const handleQuickAction = (action: string) => {
    let response = '';
    let shouldRedirect = false;
    let redirectPath = '';
    
    switch (action) {
      case 'services':
        shouldRedirect = true;
        redirectPath = '/services';
        response = 'Redirecionando para a página de serviços...';
        break;
        
      case 'technologies':
        shouldRedirect = true;
        redirectPath = '/stacks';
        response = 'Redirecionando para a página de tecnologias...';
        break;
        
      case 'projects':
        shouldRedirect = true;
        redirectPath = '/projects';
        response = 'Redirecionando para a página de projetos...';
        break;
        
      default:
        response = 'Como posso te ajudar hoje?';
    }
    
    // Adiciona a mensagem de resposta
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
        showButtons: true
      }
    ]);
    
    // Se precisar redirecionar, faz isso após um pequeno atraso para o usuário ler a mensagem
    if (shouldRedirect) {
      setTimeout(() => {
        setLocation(redirectPath);
        setIsOpen(false); // Fecha o chat após o redirecionamento
      }, 800);
    }
    
    // Rolar para baixo após adicionar a mensagem
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleWhatsAppClick = () => {
    const wasOpen = isOpen;
    setIsOpen(!wasOpen);
    
    if (!wasOpen) {
      // Abrindo o chat - limpar notificações
      setUnreadCount(0);
      localStorage.removeItem('whatsappUnread');
      setShowContactOptions(true);
      
      // Simular resposta automática após 1.5 segundos
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "Estou aqui para ajudar! Escolha uma opção abaixo ou me conte mais sobre o que você precisa.",
          sender: 'bot',
          timestamp: new Date(),
          status: 'read',
          showButtons: true
        }]);
      }, 1500);
    }
  };

  // Função para analisar a intenção da mensagem
  const analyzeMessage = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // @ts-ignore
    const context = window.chatContext || {};
    
    // Análise de intenção básica
    if (/(oi|olá|ola|eae|bom dia|boa tarde|boa noite)/i.test(lowerText)) {
      return {
        type: 'greeting',
        response: `Olá! ${['Bom dia', 'Boa tarde', 'Boa noite'][new Date().getHours() % 3]}. Como posso te ajudar hoje?`,
        contextUpdate: { conversationStage: 'initial' }
      };
    }
    
    if (/(obrigad[oa]|valeu|agradeço)/i.test(lowerText)) {
      return {
        type: 'thanks',
        response: 'De nada! Estou aqui para ajudar. Se precisar de mais alguma coisa, é só chamar! 😊',
        contextUpdate: { conversationStage: 'middle' }
      };
    }
    
    if (/(servi[çc]os|o que você faz|o que faz|desenvolvimento|site|aplicativo|aplicação)/i.test(lowerText)) {
      return {
        type: 'services',
        response: 'Ofereço diversos serviços de desenvolvimento, incluindo:\n\n' +
                 '• Desenvolvimento Web (React, Next.js, Node.js)\n' +
                 '• Aplicativos Mobile (React Native, Flutter)\n' +
                 '• Sistemas Personalizados\n' +
                 '• Consultoria em Tecnologia\n\n' +
                 'Posso te ajudar com algum projeto específico?',
        contextUpdate: { 
          lastTopics: [...(context.lastTopics || []), 'serviços'],
          conversationStage: 'middle'
        }
      };
    }
    
    if (/(tecnologias|tecnologia|ferramentas|linguagens|stack)/i.test(lowerText)) {
      return {
        type: 'technologies',
        response: 'Trabalho com diversas tecnologias modernas, incluindo:\n\n' +
                 '• Frontend: React, Next.js, TypeScript, TailwindCSS\n' +
                 '• Backend: Node.js, Python, Java, .NET\n' +
                 '• Mobile: React Native, Flutter\n' +
                 '• Banco de Dados: PostgreSQL, MongoDB, Firebase\n\n' +
                 'Gostaria de saber mais sobre alguma tecnologia específica?',
        contextUpdate: {
          lastTopics: [...(context.lastTopics || []), 'tecnologias'],
          conversationStage: 'middle'
        }
      };
    }
    
    if (/(contato|falar|conversar|e-?mail|telefone|whatsapp)/i.test(lowerText)) {
      return {
        type: 'contact',
        response: 'Claro! Aqui estão minhas informações de contato:\n\n' +
                 '• E-mail: contato@seuportfolio.com\n' +
                 '• WhatsApp: (11) 98292-8508\n' +
                 '• LinkedIn: linkedin.com/in/seuperfil\n\n' +
                 'Prefere que eu te ajude com algo específico agora?',
        contextUpdate: {
          lastTopics: [...(context.lastTopics || []), 'contato'],
          conversationStage: 'middle'
        }
      };
    }
    
    if (/(projetos|portfólio|portifolio|trabalhos)/i.test(lowerText)) {
      return {
        type: 'projects',
        response: 'Já trabalhei em diversos projetos interessantes! Aqui estão alguns destaques:\n\n' +
                 '• Sistema de Gestão Empresarial\n' +
                 '• Aplicativo de Delivery\n' +
                 '• Plataforma de Cursos Online\n\n' +
                 'Gostaria de ver mais detalhes sobre algum projeto específico?',
        contextUpdate: {
          lastTopics: [...(context.lastTopics || []), 'projetos'],
          conversationStage: 'middle'
        }
      };
    }
    
    // Resposta padrão se não reconhecer a intenção
    return {
      type: 'unknown',
      response: 'Desculpe, não entendi completamente. Poderia reformular? Estou aqui para ajudar com informações sobre meus serviços, tecnologias que utilizo, meus projetos ou formas de contato.',
      contextUpdate: {}
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date(),
      status: 'sent' as const,
      showButtons: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simular digitação
    setIsTyping(true);
    
    try {
      // Analisar a mensagem para entender a intenção
      const analysis = analyzeMessage(message);
      
      // Atualizar o contexto da conversa
      // @ts-ignore
      window.chatContext = {
        // @ts-ignore
        ...(window.chatContext || {}),
        ...analysis.contextUpdate,
        lastInteraction: new Date().toISOString()
      };
      
      // Simular tempo de processamento baseado no tamanho da resposta
      const processingTime = Math.min(1000 + Math.random() * 1000, 2000);
      
      setTimeout(() => {
        setIsTyping(false);
        
        // Adicionar a resposta do bot
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: analysis.response,
            sender: 'bot' as const,
            timestamp: new Date(),
            status: 'read' as const,
            showButtons: true
          }
        ]);
        
        // Mostrar opções de contato se relevante
        if (analysis.type === 'services' || analysis.type === 'projects') {
          setShowContactOptions(true);
        }
        
      }, processingTime);
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      setIsTyping(false);
      
      // Resposta de erro amigável
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Parece que tive um problema ao processar sua mensagem. Poderia tentar novamente?',
          sender: 'bot' as const,
          timestamp: new Date(),
          status: 'read' as const,
          showButtons: true
        }
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Efeito para notificações quando o chat está fechado
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot' && lastMessage.status === 'read') {
        const newCount = unreadCount + 1;
        setUnreadCount(newCount);
        localStorage.setItem('whatsappUnread', newCount.toString());
      }
    }
  }, [messages, isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden w-80"
          >
            <div className="bg-[#25D366] text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="#25D366">
                      <path d="M16 0C7.163 0 0 7.163 0 16C0 19.16 0.95 22.103 2.6 24.6L0.9 32L8.55 30.3C10.9 31.8 13.85 32.7 16.9 32.7C24.737 32.7 31 25.837 31 18C31 8.063 24.737 0 16 0Z"/>
                    </svg>
                  </div>
                  {isTyping && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">Suporte</p>
                  <p className="text-xs opacity-80">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>
                        <div className="p-4 bg-gray-50 h-64 overflow-y-auto">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2 self-end mb-1">
                        <FiMessageSquare className="text-green-600" size={16} />
                      </div>
                    )}
                    <div 
                      className={`p-3 rounded-2xl max-w-[80%] ${
                        msg.sender === 'user' 
                          ? 'bg-[#DCF8C6] rounded-tr-none' 
                          : 'bg-white rounded-tl-none shadow'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line text-black">
                        {msg.text.split('\n').map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.sender === 'user' ? (
                          <span className="text-xs">
                            {msg.status === 'sent' ? (
                              <FiCheck className="text-gray-400" />
                            ) : (
                              <FiCheckCircle className="text-blue-500" />
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-green-500">
                            <FiCheckCircle />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center space-x-1 pl-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}

                {showContactOptions && (
                  <div className="flex flex-col space-y-3 mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-center font-medium text-blue-700">Como posso te ajudar agora?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleQuickAction('services')}
                        className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition-colors border border-blue-100"
                      >
                        <div className="bg-blue-100 p-2 rounded-full mb-1">
                          <FiBriefcase className="text-blue-600" size={16} />
                        </div>
                        <span className="text-xs text-center text-gray-700">Serviços</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction('technologies')}
                        className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition-colors border border-blue-100"
                      >
                        <div className="bg-blue-100 p-2 rounded-full mb-1">
                          <FiCode className="text-blue-600" size={16} />
                        </div>
                        <span className="text-xs text-center text-gray-700">Tecnologias</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction('projects')}
                        className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition-colors border border-blue-100"
                      >
                        <div className="bg-blue-100 p-2 rounded-full mb-1">
                          <FiGithub className="text-blue-600" size={16} />
                        </div>
                        <span className="text-xs text-center text-gray-700">Projetos</span>
                      </button>
                      <button
                        onClick={() => handleContactOption('contact')}
                        className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition-colors border border-blue-100"
                      >
                        <div className="bg-blue-100 p-2 rounded-full mb-1">
                          <FiMail className="text-blue-600" size={16} />
                        </div>
                        <span className="text-xs text-center text-gray-700">Contato</span>
                      </button>
                    </div>
                    <div className="flex justify-center space-x-3 pt-2 border-t border-blue-100">
                      <button
                        onClick={() => handleContactOption('whatsapp')}
                        className="flex items-center space-x-1 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
                          <path d="M16 0C7.163 0 0 7.163 0 16C0 19.16 0.95 22.103 2.6 24.6L0.9 32L8.55 30.3C10.9 31.8 13.85 32.7 16.9 32.7C24.737 32.7 31 25.837 31 18C31 8.063 24.737 0 16 0ZM24.8 23.1C24.8 23.1 23.25 25.3 22.4 25.3C21.55 25.3 17.4 23.1 16.9 22.7C16.05 22.3 13.2 21.5 12.4 19.7C11.6 17.9 12.4 16.5 12.8 15.6C13.2 14.7 14.5 14.3 14.85 14.3C15.2 14.3 15.55 14.3 15.75 14.3C16.1 14.3 16.6 14.3 16.9 15.6C17.2 16.9 18.5 20.8 18.8 21.1C19.1 21.4 19.4 21.4 19.7 21.1C20 20.8 20.6 20.1 21.1 19.5C21.6 18.9 22.1 18.7 22.4 18.7C22.7 18.7 23.15 18.8 23.5 19.2C23.85 19.6 24.8 21.1 24.8 23.1Z" fill="currentColor"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleContactOption('email')}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                      >
                        <FiMail size={14} />
                        <span>E-mail</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                    className="w-full bg-transparent border-none outline-none resize-none text-sm max-h-20 text-black"
                    rows={1}
                    aria-label="Digite sua mensagem"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-2 rounded-full transition-colors ${
                    message.trim() 
                      ? 'bg-[#25D366] text-white hover:bg-[#128C7E]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Enviar mensagem"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={false}
        animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <motion.button
          onClick={handleWhatsAppClick}
          className={`w-16 h-16 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-[#25D366] hover:bg-[#128C7E]'} text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center`}
          aria-label="Abrir chat do WhatsApp"
        >
          {isOpen ? (
            <FiX size={28} />
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16C0 19.16 0.95 22.103 2.6 24.6L0.9 32L8.55 30.3C10.9 31.8 13.85 32.7 16.9 32.7C24.737 32.7 31 25.837 31 18C31 8.063 24.737 0 16 0ZM24.8 23.1C24.8 23.1 23.25 25.3 22.4 25.3C21.55 25.3 17.4 23.1 16.9 22.7C16.05 22.3 13.2 21.5 12.4 19.7C11.6 17.9 12.4 16.5 12.8 15.6C13.2 14.7 14.5 14.3 14.85 14.3C15.2 14.3 15.55 14.3 15.75 14.3C16.1 14.3 16.6 14.3 16.9 15.6C17.2 16.9 18.5 20.8 18.8 21.1C19.1 21.4 19.4 21.4 19.7 21.1C20 20.8 20.6 20.1 21.1 19.5C21.6 18.9 22.1 18.7 22.4 18.7C22.7 18.7 23.15 18.8 23.5 19.2C23.85 19.6 24.8 21.1 24.8 23.1Z" fill="currentColor"/>
              </svg>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};
