import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/header";
import { EnhancedWeatherWidget } from "@/components/enhanced-weather-widget";
import { CountdownWidget } from "@/components/countdown-widget";
import { TodaysTasksWidget } from "@/components/todays-tasks-widget";
import { Calendar, TrendingUp, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";

// Centered Welcome Section Component with Clock
function CenteredWelcomeSection() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
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

  const { dateStr, timeStr } = formatDateTime();

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-violet-700 to-black dark:from-purple-400 dark:via-violet-500 dark:to-gray-300 bg-clip-text text-transparent">
          Hoşgeldiniz Berat Çakıroğlu
        </h1>
      </div>
      
      {/* Centered Clock and Date Display */}
      <div className="flex flex-col items-center space-y-6">
        {/* Enhanced Clock Icon with Glassmorphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-violet-600/30 to-black/40 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative w-20 h-20 bg-black/10 dark:bg-purple-950/20 backdrop-blur-xl border border-purple-500/20 dark:border-purple-400/20 rounded-3xl flex items-center justify-center shadow-2xl">
            <Clock className="h-10 w-10 text-purple-600 dark:text-purple-400 drop-shadow-lg" />
          </div>
        </div>
        
        {/* Enhanced Time Display with Purple-Black Gradient */}
        <div className="text-8xl font-black bg-gradient-to-r from-purple-600 via-violet-700 to-black dark:from-purple-400 dark:via-violet-500 dark:to-gray-300 bg-clip-text text-transparent font-mono tracking-tighter drop-shadow-lg" data-testid="text-time-center">
          {timeStr}
        </div>
        
        {/* Stylized Date and Location with Purple-Black Theme */}
        <div className="flex items-center space-x-4 text-2xl font-semibold">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg animate-pulse"></div>
            <span className="bg-gradient-to-r from-purple-800 to-black dark:from-purple-300 dark:to-gray-200 bg-clip-text text-transparent font-bold" data-testid="text-date-center">
              {dateStr}
            </span>
          </div>
          <span className="text-muted-foreground/50">•</span>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span className="text-lg">📍</span>
            <span className="font-bold bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-400 dark:to-violet-500 bg-clip-text text-transparent">
              Sakarya, Serdivan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Homepage() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location] = useLocation();

  const { data: calendarData } = useQuery<{
    date: string;
    dayNumber: number;
    daysRemaining: number;
    tasks: Task[];
    tasksCount: number;
  }>({
    queryKey: ["/api/calendar", selectedDate],
    queryFn: async () => {
      if (!selectedDate) return null;
      const response = await fetch(`/api/calendar/${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch calendar data');
      return response.json();
    },
    enabled: !!selectedDate,
  });

  // Generate calendar for current month
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const today = currentDate.getDate();

  // Start from Monday (fix week alignment)
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);
  
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }

  const handleDateClick = (date: Date) => {
    // Fix: Use the actual date without timezone issues
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    setSelectedDate(dateStr);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      
      {/* Centered Navigation */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-6">
          <Link href="/">
            <button 
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                location === '/' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
              }`}
              data-testid="link-homepage"
            >
              Anasayfa
            </button>
          </Link>
          <Link href="/tasks">
            <button 
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                location === '/tasks' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
              }`}
              data-testid="link-todos"
            >
              Yapılacaklar
            </button>
          </Link>
          <Link href="/dashboard">
            <button 
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                location === '/dashboard' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
              }`}
              data-testid="link-dashboard"
            >
              Raporlarım
            </button>
          </Link>
          <Link href="/net-calculator">
            <button 
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                location === '/net-calculator' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
              }`}
            >
              Net Hesapla
            </button>
          </Link>
          <Link href="/timer">
            <button 
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                location === '/timer' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105'
              }`}
              data-testid="link-timer"
            >
              Sayaç
            </button>
          </Link>
        </div>
      </nav>

      {/* Centered Welcome Section with Clock */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <CenteredWelcomeSection />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Top Row - Calendar and Today's Tasks Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 items-stretch">
          {/* Modern Calendar Widget - Takes 3 columns (slightly bigger) */}
          <div className="lg:col-span-3 bg-gradient-to-br from-card to-card/80 rounded-2xl border border-border/50 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                Takvim
              </h3>
              <div className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
                {currentDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
              </div>
            </div>

            {/* Modern Calendar Grid */}
            <div className="space-y-2">
              {/* Week Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground/70 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === month;
                  const isToday = date.getDate() === today && isCurrentMonth;
                  const year = date.getFullYear();
                  const month_num = (date.getMonth() + 1).toString().padStart(2, '0');
                  const day = date.getDate().toString().padStart(2, '0');
                  const dateStr = `${year}-${month_num}-${day}`;
                  const isSelected = selectedDate === dateStr;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`relative aspect-square flex items-center justify-center text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isToday
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                          : isSelected
                          ? "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground ring-2 ring-primary/50 shadow-md"
                          : isCurrentMonth
                          ? "hover:bg-gradient-to-br hover:from-secondary hover:to-secondary/80 cursor-pointer text-foreground hover:shadow-md border border-transparent hover:border-border/50"
                          : "text-muted-foreground/30 cursor-pointer hover:text-muted-foreground/50"
                      }`}
                      data-testid={`calendar-day-${date.getDate()}`}
                    >
                      {date.getDate()}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modern Selected Date Info */}
            {selectedDate && calendarData && (
              <div className="mt-6 p-5 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-foreground flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2 animate-pulse"></div>
                    {new Date(selectedDate + 'T12:00:00').getDate()}. Gün
                  </h4>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {calendarData.daysRemaining > 0 
                      ? `${calendarData.daysRemaining} gün sonra` 
                      : calendarData.daysRemaining === 0 
                      ? "Bugün" 
                      : `${Math.abs(calendarData.daysRemaining)} gün önce`}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {calendarData.tasksCount} görev planlanmış
                  </p>
                </div>
                {calendarData.tasks && calendarData.tasks.length > 0 && (
                  <div className="space-y-2">
                    {calendarData.tasks.slice(0, 3).map((task: Task) => (
                      <div key={task.id} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mr-3"></div>
                        {task.title}
                      </div>
                    ))}
                    {calendarData.tasks.length > 3 && (
                      <div className="text-xs text-muted-foreground italic">
                        ve {calendarData.tasks.length - 3} görev daha...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Today's Tasks Column - Takes 2 columns */}
          <div className="lg:col-span-2 h-full">
            <TodaysTasksWidget />
          </div>
        </div>

        {/* Middle Row - Weather Widget (Full Width) */}
        <div className="mb-8">
          <EnhancedWeatherWidget />
        </div>


        {/* Countdown Section - Moved to Bottom */}
        <div className="mb-8">
          <CountdownWidget className="p-5 md:p-6" />
        </div>
      </main>
    </div>
  );
}