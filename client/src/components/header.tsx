import { Sun, Moon, Clock } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useState, useEffect } from "react";
import { EmojiPicker } from "./emoji-picker";
import { MotivationalQuote } from "./motivational-quote";

interface HeaderProps {
  // No longer need onProfileClick since we handle emoji picker internally
}

export function Header({}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [note, setNote] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Load from localStorage
  useEffect(() => {
    const savedEmoji = localStorage.getItem('userEmoji');
    const savedNote = localStorage.getItem('userNote');
    if (savedEmoji) setSelectedEmoji(savedEmoji);
    if (savedNote) setNote(savedNote);
  }, []);
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('userEmoji', selectedEmoji);
  }, [selectedEmoji]);
  
  useEffect(() => {
    localStorage.setItem('userNote', note);
  }, [note]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time for Sakarya Serdivan (Turkey timezone)
  const formatDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Istanbul',
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const dateStr = currentTime.toLocaleDateString('tr-TR', options);
    const timeStr = currentTime.toLocaleTimeString('tr-TR', timeOptions);
    
    return { dateStr, timeStr };
  };

  return (
    <header className="bg-card border-b border-border shadow-sm transition-colors duration-300">
      {/* Motivational Quote Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <MotivationalQuote />
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Modern Time and Date Display */}
          <div className="flex items-center space-x-4 relative">
            {/* Enhanced Clock Icon with Glassmorphism */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative w-12 h-12 bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl flex items-center justify-center shadow-2xl">
                <Clock className="h-6 w-6 text-primary drop-shadow-lg" />
              </div>
            </div>
            
            {/* Enhanced Time and Date Container */}
            <div className="flex flex-col relative">
              {/* Modern Time Display with Gradient */}
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent font-mono tracking-tighter drop-shadow-lg" data-testid="text-time">
                {formatDateTime().timeStr}
              </div>
              
              {/* Stylized Date and Location */}
              <div className="flex items-center space-x-2 text-sm font-semibold mt-1">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg animate-pulse"></div>
                  <span className="bg-gradient-to-r from-slate-700 to-gray-600 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent font-bold" data-testid="text-date">
                    {formatDateTime().dateStr}
                  </span>
                </div>
                <span className="text-muted-foreground/50">•</span>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <span className="text-xs">📍</span>
                  <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Sakarya, Serdivan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200"
              title="Tema Değiştir"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Sun className="h-4 w-4 text-secondary-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-secondary-foreground" />
              )}
            </button>

            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground hidden sm:block">Hoşgeldiniz</span>
              <span className="font-medium text-foreground hidden sm:block">Berat Çakıroğlu</span>
              <div className="relative">
                <button
                  onClick={() => setEmojiPickerOpen(true)}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                  data-testid="button-emoji-picker"
                >
                  {/* Profile Photo - Always shows 'B' */}
                  <span className="text-lg font-bold">B</span>
                  
                  {/* Emoji Bubble - Top Right (Always shows when emoji is selected) */}
                  {selectedEmoji && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-primary flex items-center justify-center shadow-lg">
                      <span className="text-xs">{selectedEmoji}</span>
                    </div>
                  )}
                  
                  {/* Note Bubble - Bottom Right */}
                  {note.trim() && (
                    <div className="absolute -bottom-1 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold">!</span>
                    </div>
                  )}
                  
                  {/* Tooltip - Now shows below */}
                  {showTooltip && (
                    <div className="absolute top-full left-1/2 mt-2 px-2 py-1 bg-card text-card-foreground text-xs rounded shadow-lg border border-border transform -translate-x-1/2 whitespace-nowrap animate-in fade-in-0 zoom-in-95 z-50">
                      Emoji seç & Not bırak
                      {note.trim() && (
                        <div className="mt-1 text-xs italic text-muted-foreground max-w-40 truncate">
                          "{note.trim()}"
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Emoji Picker Modal */}
      <EmojiPicker 
        open={emojiPickerOpen} 
        onOpenChange={setEmojiPickerOpen}
        selectedEmoji={selectedEmoji}
        onEmojiSelect={setSelectedEmoji}
        note={note}
        onNoteChange={setNote}
      />
    </header>
  );
}
