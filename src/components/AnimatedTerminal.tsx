import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import React from 'react'; // Added missing import for React.memo

interface Command {
  command: string;
  response: string | string[];
}

interface AnimatedTerminalProps {
  title: string;
}

const AnimatedTerminal = ({ title }: AnimatedTerminalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedCommands, setDisplayedCommands] = useState<Command[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Memoize the demo sequence to prevent recreating on every render
  const demoSequence: Command[] = useMemo(() => [
    {
      command: 'help',
      response: [
        'Available commands:',
        '',
        'help           - Show available commands',
        'clear          - Clear console output',
        'echo           - Print text to console',
        'date           - Show current date and time',
        'status         - Show system status',
        'ls             - List available commands (alias for help)',
        'whoami         - Show current user info',
        'info           - Show detailed information',
        'version        - Show console version',
        'history        - Show command history',
        'websites       - Website management commands',
        'storage        - Console storage management',
        '',
        'Type "help [command]" for detailed information about a specific command.',
        'Use arrow keys to navigate command history.'
      ]
    },
    {
      command: 'websites add "Exit1" https://exit1.dev',
      response: 'Website "Exit1" added successfully.'
    },
    {
      command: 'websites list',
      response: [
        'Monitored Websites:',
        '',
        'abc123: Exit1 (https://exit1.dev) - unknown',
        'def456: Portfolio (https://demo-portfolio.example) - unknown',
        'ghi789: Blog (https://my-blog.test) - unknown'
      ]
    },
    {
      command: 'websites edit abc123 "Exit1 Updated" https://exit1.dev',
      response: 'Website "abc123" updated successfully.'
    },
    {
      command: 'status',
      response: [
        'System Status:',
        '- Console logs: 15',
        '- Console output: 8 lines',
        '- Window size: 800x600',
        '- Position: (100, 100)',
        '- Maximized: No',
        '- Minimized: No'
      ]
    },
    {
      command: 'history',
      response: [
        'Command History:',
        '',
        '1: help',
        '2: websites add "Exit1" https://exit1.dev',
        '3: websites list',
        '4: websites edit abc123 "Exit1 Updated" https://exit1.dev',
        '5: status'
      ]
    },
    {
      command: 'clear',
      response: 'Console cleared.'
    }
  ], []);

  // Optimized cursor effect using requestAnimationFrame
  useEffect(() => {
    let lastTime = 0;
    const cursorInterval = 530;

    const animateCursor = (currentTime: number) => {
      if (currentTime - lastTime >= cursorInterval) {
        setCursorVisible(prev => !prev);
        lastTime = currentTime;
      }
      animationFrameRef.current = requestAnimationFrame(animateCursor);
    };

    animationFrameRef.current = requestAnimationFrame(animateCursor);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Optimized auto-scroll using useCallback
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current && autoScroll) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [displayedCommands, isTyping, typedCommand, scrollToBottom]);

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    const { scrollTop, scrollHeight, clientHeight } = terminal;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
    
    if (isAtBottom && !autoScroll) {
      setAutoScroll(true);
    } else if (!isAtBottom && autoScroll) {
      setAutoScroll(false);
    }
  }, [autoScroll]);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    terminal.addEventListener('scroll', handleScroll, { passive: true });
    return () => terminal.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Optimized command cycling with reduced setTimeout usage
  useEffect(() => {
    if (currentStep >= demoSequence.length) {
      setCurrentStep(0);
      setDisplayedCommands([]);
      setTypedCommand('');
      setIsTyping(false);
      return;
    }

    const currentCommand = demoSequence[currentStep];
    setIsTyping(true);
    setTypedCommand('');

    let charIndex = 0;
    let lastTime = 0;
    let typingRaf: number;

    const typeNextChar = (timestamp: number) => {
      if (charIndex < currentCommand.command.length) {
        const elapsed = timestamp - (lastTime || timestamp);
        const currentChar = currentCommand.command[charIndex];
        let delay = 80;

        if (currentChar === ' ') delay = 40;
        else if (currentChar === '"' || currentChar === "'") delay = 120;
        else if (currentChar === '/' || currentChar === '.') delay = 100;
        else if (currentChar === 'h' && currentCommand.command.includes('https://')) delay = 60;

        if (elapsed >= delay) {
          setTypedCommand(prev => prev + currentChar);
          charIndex++;
          lastTime = timestamp;
        }

        typingRaf = requestAnimationFrame(typeNextChar);
      } else {
        setIsTyping(false);
        setDisplayedCommands(prev => [...prev, currentCommand]);
        
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 2000);
      }
    };

    typingRaf = requestAnimationFrame(typeNextChar);

    return () => {
      if (typingRaf) cancelAnimationFrame(typingRaf);
    };
  }, [currentStep, demoSequence]);

  return (
    <div className="relative bg-black border border-gray-700 rounded-lg p-0 font-mono text-sm shadow-2xl text-left overflow-hidden">
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="space-y-2 text-green-400 text-left h-60 overflow-y-auto px-6 py-4 bg-black"
      >
        {/* Frosted Glass Header - positioned absolutely over content */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-xl border-b border-gray-700/30 shadow-lg">
          <span className="text-gray-300 text-xs font-medium">{title}</span>
          <div className="text-gray-500 text-xs">exit1.dev</div>
        </div>
        
        {/* Welcome message */}
        {currentStep === 0 && displayedCommands.length === 0 && (
          <div className="text-gray-400 mb-4 text-left pt-2">
            <div className="text-green-400 font-medium">exit1.dev terminal v1.0.0</div>
            <div className="text-gray-500 text-xs mt-1">Type "help" for available commands</div>
            <div className="mt-3"></div>
          </div>
        )}
        
        {/* Display completed commands */}
        {displayedCommands.map((cmd, index) => (
          <div key={index} className="space-y-1 text-left">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <span className="text-green-400">{cmd.command}</span>
            </div>
            {Array.isArray(cmd.response) ? (
              <div className="text-gray-300 space-y-0.5 ml-4 text-left">
                {cmd.response.map((line, lineIndex) => (
                  <div key={lineIndex} className={line === '' ? 'h-3' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-300 ml-4 text-left">{cmd.response}</div>
            )}
          </div>
        ))}
        
        {/* Current typing command */}
        {isTyping && (
          <div className="flex items-center text-left">
            <span className="text-gray-500 mr-2">$</span>
            <span className="text-green-400">{typedCommand}</span>
            {cursorVisible && (
              <span className="bg-green-400 text-black px-0.5 ml-0.5">█</span>
            )}
          </div>
        )}
        
        {/* Cursor when not typing */}
        {!isTyping && (
          <div className="flex items-center text-left">
            <span className="text-gray-500 mr-2">$</span>
            {cursorVisible && (
              <span className="bg-green-400 text-black px-0.5">█</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AnimatedTerminal); 