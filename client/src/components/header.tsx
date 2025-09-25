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
      {/* Clock/Date/Location Section (moved from main nav) */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Compact Clock and Date Display - Left Side */}
            <div className="flex items-center space-x-3">
              {/* Compact Clock Icon */}
              <div className="relative">
                <div className="relative w-8 h-8 bg-black/10 dark:bg-purple-950/20 backdrop-blur-xl border border-purple-500/20 dark:border-purple-400/20 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 drop-shadow-lg" />
                </div>
              </div>
              
              {/* Compact Time and Date Container */}
              <div className="flex items-center space-x-3">
                {/* Compact Time Display */}
                <div className="text-lg font-bold bg-gradient-to-r from-purple-600 via-violet-700 to-black dark:from-purple-400 dark:via-violet-500 dark:to-gray-300 bg-clip-text text-transparent font-mono" data-testid="text-time-header">
                  {formatDateTime().timeStr}
                </div>
                
                <span className="text-muted-foreground/50">•</span>
                
                {/* Compact Date and Location */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-gradient-to-r from-purple-800 to-black dark:from-purple-300 dark:to-gray-200 bg-clip-text text-transparent font-semibold" data-testid="text-date-header">
                    {formatDateTime().dateStr}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <span className="text-xs">📍</span>
                    <span className="font-semibold bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-400 dark:to-violet-500 bg-clip-text text-transparent">
                      Sakarya, Serdivan
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Motivational Quote, Theme, Welcome */}
            <div className="flex items-center space-x-6">
              {/* Motivational Quote */}
              <div className="max-w-md">
                <MotivationalQuote />
              </div>
              
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
      </div>
      
      {/* Navigation Section - TO BE ADDED LATER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          {/* Navigation buttons will be moved here later */}
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
