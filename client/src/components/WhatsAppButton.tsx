import { motion, AnimatePresence } from 'framer-motion';
import { floatAnimation } from '../utils/animations';
import { useState, useEffect, useRef } from 'react';
import { useLocation as useWouterLocation } from 'wouter';
import { FiX, FiMessageSquare, FiClock, FiCheck, FiCheckCircle } from 'react-icons/fi';

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
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleContactOption = (option: 'whatsapp' | 'email') => {
    if (option === 'whatsapp') {
      const phoneNumber = "5511982928508";
      const url = `https://wa.me/${phoneNumber}?text=Olá! Gostaria de mais informações sobre seus serviços.`;
      window.open(url, '_blank');
    } else {
      // Navega para a página de contato e fecha o chat
      setLocation('/contact');
      setIsOpen(false);
    }
    setShowContactOptions(false);
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

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      showButtons: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simular digitação
    setIsTyping(true);
    
    // Simular resposta após 1-3 segundos
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        "Entendi sua solicitação! Posso te ajudar com mais detalhes sobre meus serviços de desenvolvimento.",
        "Ótima pergunta! Posso te enviar um orçamento ou agendar uma reunião para discutirmos melhor.",
        "Obrigado pelo seu interesse! Posso te mostrar exemplos de trabalhos anteriores relacionados ao que você precisa.",
        "Para orçamentos ou propostas, posso te encaminhar para meu e-mail profissional: contato@seuportfolio.com"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
        showButtons: true
      }]);
      
      // Mostrar opções de contato após a resposta
      setShowContactOptions(true);
      
    }, 1000 + Math.random() * 2000);
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
                    <div 
                      className={`p-3 rounded-2xl max-w-[80%] ${
                        msg.sender === 'user' 
                          ? 'bg-[#DCF8C6] rounded-tr-none' 
                          : 'bg-white rounded-tl-none shadow'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line text-black">{msg.text}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.sender === 'user' && (
                          <span className="text-xs">
                            {msg.status === 'sent' ? (
                              <FiCheck className="text-gray-400" />
                            ) : (
                              <FiCheckCircle className="text-blue-500" />
                            )}
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
                  <div className="flex flex-col space-y-2 mt-4">
                    <p className="text-xs text-center text-gray-500">Ou entre em contato diretamente:</p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleContactOption('whatsapp')}
                        className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" className="text-white">
                          <path d="M16 0C7.163 0 0 7.163 0 16C0 19.16 0.95 22.103 2.6 24.6L0.9 32L8.55 30.3C10.9 31.8 13.85 32.7 16.9 32.7C24.737 32.7 31 25.837 31 18C31 8.063 24.737 0 16 0ZM24.8 23.1C24.8 23.1 23.25 25.3 22.4 25.3C21.55 25.3 17.4 23.1 16.9 22.7C16.05 22.3 13.2 21.5 12.4 19.7C11.6 17.9 12.4 16.5 12.8 15.6C13.2 14.7 14.5 14.3 14.85 14.3C15.2 14.3 15.55 14.3 15.75 14.3C16.1 14.3 16.6 14.3 16.9 15.6C17.2 16.9 18.5 20.8 18.8 21.1C19.1 21.4 19.4 21.4 19.7 21.1C20 20.8 20.6 20.1 21.1 19.5C21.6 18.9 22.1 18.7 22.4 18.7C22.7 18.7 23.15 18.8 23.5 19.2C23.85 19.6 24.8 21.1 24.8 23.1Z" fill="currentColor"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleContactOption('email')}
                        className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                        </svg>
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
