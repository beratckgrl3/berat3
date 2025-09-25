import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Send, 
  Mail, 
  Phone, 
  FileText, 
  Activity,
  Target,
  Zap,
  Award,
  Star,
  Timer,
  CalendarDays,
  Download,
  CheckCircle2,
  BookOpen,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task, QuestionLog, ExamResult } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Activities() {
  const { toast } = useToast();
  
  // Fetch real data from APIs
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  
  const { data: questionLogs = [], isLoading: questionsLoading } = useQuery<QuestionLog[]>({
    queryKey: ["/api/question-logs"],
  });
  
  const { data: examResults = [], isLoading: examsLoading } = useQuery<ExamResult[]>({
    queryKey: ["/api/exam-results"],
  });
  
  // Countdown states
  const [dailyCountdown, setDailyCountdown] = useState<number>(0);
  const [weeklyCountdown, setWeeklyCountdown] = useState<number>(0);
  const [monthlyCountdown, setMonthlyCountdown] = useState<number>(0);
  
  // Report button states
  const [showDailyReport, setShowDailyReport] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  
  // Auto-destruct timers (6 hours = 21600 seconds)
  const [dailyDestructTime, setDailyDestructTime] = useState<number | null>(null);
  const [weeklyDestructTime, setWeeklyDestructTime] = useState<number | null>(null);
  const [monthlyDestructTime, setMonthlyDestructTime] = useState<number | null>(null);
  
  // Dialog states
  const [sendReportDialog, setSendReportDialog] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<'daily' | 'weekly' | 'monthly' | null>(null);
  const [sendMethod, setSendMethod] = useState<'email' | 'phone' | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  
  const isLoading = tasksLoading || questionsLoading || examsLoading;
  
  // Calculate real activity statistics
  const activityStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    
    // Tasks completed today/week/month
    const tasksCompletedToday = tasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt).toISOString().split('T')[0] === today
    ).length;
    
    const tasksCompletedThisWeek = tasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt).toISOString().split('T')[0] >= weekStartStr
    ).length;
    
    const tasksCompletedThisMonth = tasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt).toISOString().split('T')[0] >= monthStartStr
    ).length;
    
    // Questions solved today/week/month
    const questionsToday = questionLogs.filter(log => log.study_date === today);
    const totalQuestionsToday = questionsToday.reduce((sum, log) => 
      sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0) + (Number(log.blank_count) || 0), 0
    );
    
    const questionsThisWeek = questionLogs.filter(log => log.study_date >= weekStartStr);
    const totalQuestionsWeek = questionsThisWeek.reduce((sum, log) => 
      sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0) + (Number(log.blank_count) || 0), 0
    );
    
    const questionsThisMonth = questionLogs.filter(log => log.study_date >= monthStartStr);
    const totalQuestionsMonth = questionsThisMonth.reduce((sum, log) => 
      sum + (Number(log.correct_count) || 0) + (Number(log.wrong_count) || 0) + (Number(log.blank_count) || 0), 0
    );
    
    // Study time today/week/month (approximated from questions)
    const studyTimeToday = questionsToday.reduce((sum, log) => sum + (Number(log.time_spent_minutes) || 0), 0);
    const studyTimeWeek = questionsThisWeek.reduce((sum, log) => sum + (Number(log.time_spent_minutes) || 0), 0);
    const studyTimeMonth = questionsThisMonth.reduce((sum, log) => sum + (Number(log.time_spent_minutes) || 0), 0);
    
    return {
      daily: {
        tasks: tasksCompletedToday,
        questions: totalQuestionsToday,
        studyTime: studyTimeToday,
        sessions: questionsToday.length
      },
      weekly: {
        tasks: tasksCompletedThisWeek,
        questions: totalQuestionsWeek,
        studyTime: studyTimeWeek,
        sessions: questionsThisWeek.length
      },
      monthly: {
        tasks: tasksCompletedThisMonth,
        questions: totalQuestionsMonth,
        studyTime: studyTimeMonth,
        sessions: questionsThisMonth.length
      }
    };
  }, [tasks, questionLogs]);

  // Calculate countdown timers
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const currentTime = now.getTime();
      
      // Daily countdown - until end of day (23:59:59)
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const dailyMs = endOfDay.getTime() - currentTime;
      setDailyCountdown(Math.max(0, Math.floor(dailyMs / 1000)));
      
      // Weekly countdown - until end of week (Sunday 23:59:59)
      const endOfWeek = new Date(now);
      const daysUntilSunday = (7 - now.getDay()) % 7;
      endOfWeek.setDate(now.getDate() + daysUntilSunday);
      endOfWeek.setHours(23, 59, 59, 999);
      const weeklyMs = endOfWeek.getTime() - currentTime;
      setWeeklyCountdown(Math.max(0, Math.floor(weeklyMs / 1000)));
      
      // Monthly countdown - until end of month
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const monthlyMs = endOfMonth.getTime() - currentTime;
      setMonthlyCountdown(Math.max(0, Math.floor(monthlyMs / 1000)));
      
      // Show report buttons when countdowns reach 0
      if (dailyMs <= 0 && !showDailyReport) {
        setShowDailyReport(true);
        setDailyDestructTime(currentTime + 21600000); // 6 hours from now
      }
      if (weeklyMs <= 0 && !showWeeklyReport) {
        setShowWeeklyReport(true);
        setWeeklyDestructTime(currentTime + 21600000);
      }
      if (monthlyMs <= 0 && !showMonthlyReport) {
        setShowMonthlyReport(true);
        setMonthlyDestructTime(currentTime + 21600000);
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [showDailyReport, showWeeklyReport, showMonthlyReport]);

  // Handle auto-destruct of report buttons
  useEffect(() => {
    const checkDestruct = () => {
      const now = Date.now();
      
      if (dailyDestructTime && now >= dailyDestructTime) {
        setShowDailyReport(false);
        setDailyDestructTime(null);
        toast({
          title: "Günlük Rapor Butonu",
          description: "6 saat içinde kullanılmadığı için kaldırıldı.",
          variant: "destructive",
        });
      }
      
      if (weeklyDestructTime && now >= weeklyDestructTime) {
        setShowWeeklyReport(false);
        setWeeklyDestructTime(null);
        toast({
          title: "Haftalık Rapor Butonu", 
          description: "6 saat içinde kullanılmadığı için kaldırıldı.",
          variant: "destructive",
        });
      }
      
      if (monthlyDestructTime && now >= monthlyDestructTime) {
        setShowMonthlyReport(false);
        setMonthlyDestructTime(null);
        toast({
          title: "Aylık Rapor Butonu",
          description: "6 saat içinde kullanılmadığı için kaldırıldı.", 
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkDestruct, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dailyDestructTime, weeklyDestructTime, monthlyDestructTime, toast]);

  // Format countdown display
  const formatCountdown = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}g ${hours}s ${minutes}d ${secs}sn`;
    } else if (hours > 0) {
      return `${hours}s ${minutes}d ${secs}sn`;
    } else {
      return `${minutes}d ${secs}sn`;
    }
  };

  // Generate activity report data from real APIs
  const generateReportData = (period: 'daily' | 'weekly' | 'monthly') => {
    return {
      tasks: activityStats[period].tasks,
      questions: activityStats[period].questions,
      studyTime: activityStats[period].studyTime,
      sessions: activityStats[period].sessions
    };
  };

  // Handle send report
  const handleSendReport = async () => {
    if (!selectedReportType || !sendMethod || !contactInfo) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    // Simulate PDF generation and sending
    toast({
      title: "Rapor Gönderiliyor",
      description: `${selectedReportType} raporu ${sendMethod === 'email' ? 'e-posta' : 'telefon'} ile gönderiliyor...`,
    });

    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "Rapor Gönderildi!",
        description: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} rapor başarıyla ${contactInfo} adresine gönderildi.`,
        duration: 3000, // 3 saniye sonra kendini imha eder
      });
      
      // Hide the corresponding report button
      if (selectedReportType === 'daily') setShowDailyReport(false);
      if (selectedReportType === 'weekly') setShowWeeklyReport(false);
      if (selectedReportType === 'monthly') setShowMonthlyReport(false);
      
      setSendReportDialog(false);
      setSelectedReportType(null);
      setSendMethod(null);
      setContactInfo('');
    }, 2000);
  };


  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🎯 Aktivitelerim
          </h1>
          <p className="text-muted-foreground">
            Günlük, haftalık ve aylık aktivite raporlarınızı takip edin
          </p>
        </div>

        {/* Activity Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Daily Report Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Günlük Rapor</span>
                </div>
                <Button
                  onClick={() => {
                    setSelectedReportType('daily');
                    setSendReportDialog(true);
                  }}
                  size="sm"
                  variant="outline"
                  data-testid="button-send-daily-report"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Gönder
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tamamlanan görevler</span>
                  <Badge variant="secondary">{activityStats.daily.tasks}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Çözülen sorular</span>
                  <Badge variant="secondary">{activityStats.daily.questions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Çalışma süresi</span>
                  <Badge variant="secondary">{activityStats.daily.studyTime} dk</Badge>
                </div>
                <div className="text-center mt-4">
                  <div className="text-lg font-bold">
                    {formatCountdown(dailyCountdown)}
                  </div>
                  <p className="text-xs text-muted-foreground">Gün sonuna kalan süre</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Report Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span>Haftalık Rapor</span>
                </div>
                <Button
                  onClick={() => {
                    setSelectedReportType('weekly');
                    setSendReportDialog(true);
                  }}
                  size="sm"
                  variant="outline"
                  data-testid="button-send-weekly-report"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Gönder
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tamamlanan görevler</span>
                  <Badge variant="secondary">{activityStats.weekly.tasks}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Çözülen sorular</span>
                  <Badge variant="secondary">{activityStats.weekly.questions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Çalışma süresi</span>
                  <Badge variant="secondary">{activityStats.weekly.studyTime} dk</Badge>
                </div>
                <div className="text-center mt-4">
                  <div className="text-lg font-bold">
                    {formatCountdown(weeklyCountdown)}
                  </div>
                  <p className="text-xs text-muted-foreground">Hafta sonuna kalan süre</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Report Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Aylık Rapor</span>
                </div>
                <Button
                  onClick={() => {
                    setSelectedReportType('monthly');
                    setSendReportDialog(true);
                  }}
                  size="sm"
                  variant="outline"
                  data-testid="button-send-monthly-report"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Gönder
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tamamlanan görevler</span>
                  <Badge variant="secondary">{activityStats.monthly.tasks}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Çözülen sorular</span>
                  <Badge variant="secondary">{activityStats.monthly.questions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Çalışma süresi</span>
                  <Badge variant="secondary">{activityStats.monthly.studyTime} dk</Badge>
                </div>
                <div className="text-center mt-4">
                  <div className="text-lg font-bold">
                    {formatCountdown(monthlyCountdown)}
                  </div>
                  <p className="text-xs text-muted-foreground">Ay sonuna kalan süre</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Son Aktiviteler</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Veriler yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Recent Tasks */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Son Tamamlanan Görevler</span>
                  </h3>
                  <div className="space-y-2">
                    {tasks.filter(task => task.completed).slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.completedAt && new Date(task.completedAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                    {tasks.filter(task => task.completed).length === 0 && (
                      <p className="text-sm text-muted-foreground">Henüz tamamlanmış görev yok.</p>
                    )}
                  </div>
                </div>

                {/* Recent Study Sessions */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>Son Çalışma Seansları</span>
                  </h3>
                  <div className="space-y-2">
                    {questionLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{log.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.study_date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {Number(log.correct_count) + Number(log.wrong_count) + Number(log.blank_count)} soru
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {log.time_spent_minutes || 0} dk
                          </p>
                        </div>
                      </div>
                    ))}
                    {questionLogs.length === 0 && (
                      <p className="text-sm text-muted-foreground">Henüz çalışma seansı yok.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Send Report Dialog */}
      <Dialog open={sendReportDialog} onOpenChange={setSendReportDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-800">
          <DialogHeader>
            <DialogTitle className="text-purple-800 dark:text-purple-300">
              📤 Rapor Gönder
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Gönderim Yöntemi
              </Label>
              <Select value={sendMethod || ''} onValueChange={(value) => setSendMethod(value as 'email' | 'phone')}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Yöntem seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>E-posta</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Telefon (SMS)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {sendMethod === 'email' ? 'E-posta Adresi' : 'Telefon Numarası'}
              </Label>
              <Input
                type={sendMethod === 'email' ? 'email' : 'tel'}
                placeholder={
                  sendMethod === 'email' 
                    ? 'ornek@email.com' 
                    : '+90 5XX XXX XX XX'
                }
                value={contactInfo}
                onChange={(e) => {
                  if (sendMethod === 'phone') {
                    let value = e.target.value;
                    if (!value.startsWith('+90')) {
                      value = '+90 ' + value.replace(/^\+90\s*/, '');
                    }
                    setContactInfo(value);
                  } else {
                    setContactInfo(e.target.value);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-purple-800 dark:text-purple-300">
                Rapor PDF formatında gönderilecektir
              </span>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setSendReportDialog(false)}
                className="border-purple-200 text-purple-800 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950"
              >
                İptal
              </Button>
              <Button 
                onClick={handleSendReport}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!sendMethod || !contactInfo}
                data-testid="button-confirm-send-report"
              >
                <Send className="h-4 w-4 mr-2" />
                Gönder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}