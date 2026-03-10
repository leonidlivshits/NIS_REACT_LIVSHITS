import { useState } from 'react';
import {
  Disc,
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Users,
  Heart,
  Bell,
  Settings,
  Menu,
  Sun,
  Moon,
  Search,
  User,
  LogOut,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { formatRelativeTime, getNotificationColor } from '@/utils/formatters';
import { NotificationType } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { id: 'collection', label: 'Моя коллекция', icon: Disc },
  { id: 'marketplace', label: 'Маркетплейс', icon: ShoppingBag },
  { id: 'wishlist', label: 'Желаемое', icon: Heart },
  { id: 'community', label: 'Сообщество', icon: Users },
  { id: 'stats', label: 'Статистика', icon: TrendingUp },
];

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme, notifications, currentUser, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();

  const unreadNotifications = unreadCount();
  const recentNotifications = notifications.slice(0, 5);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationType.PRICE_DROP:
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case NotificationType.NEW_RELEASE:
        return <Disc className="h-4 w-4 text-purple-400" />;
      case NotificationType.LIMITED_EDITION:
        return <Heart className="h-4 w-4 text-amber-400" />;
      case NotificationType.SALE:
        return <ShoppingBag className="h-4 w-4 text-rose-400" />;
      case NotificationType.MESSAGE:
        return <Bell className="h-4 w-4 text-blue-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
          <Disc className="h-6 w-6 text-white animate-spin-slow" />
        </div>
        <div>
          <h1 className="font-bold text-lg">MerchTracker</h1>
          <p className="text-xs text-muted-foreground">Трекер музыкального мерча</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-72 lg:flex lg:flex-col lg:border-r lg:border-border/50 lg:bg-card/30 lg:backdrop-blur-xl">
        <div className="flex-1 p-6">
          <NavContent />
        </div>

        <div className="p-6 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPageChange('profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 lg:hidden border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6">
                <NavContent />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Disc className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">MerchTracker</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <span className="font-semibold">Уведомления</span>
                  {unreadNotifications > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                      <Check className="h-4 w-4 mr-1" />
                      Все прочитаны
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-3 p-3 cursor-pointer',
                          !notification.read && 'bg-primary/5'
                        )}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className={cn('p-2 rounded-full', getNotificationColor(notification.type))}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('font-medium text-sm', !notification.read && 'text-primary')}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                        )}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Нет уведомлений
                    </div>
                  )}
                </div>
                <div className="border-t p-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onPageChange('dashboard')}
                  >
                    Все уведомления
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-72">
        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-40 items-center justify-between px-8 py-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по коллекции..."
                className="pl-10 bg-muted/50 border-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <span className="font-semibold">Уведомления</span>
                  {unreadNotifications > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                      <Check className="h-4 w-4 mr-1" />
                      Все прочитаны
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-3 p-3 cursor-pointer',
                          !notification.read && 'bg-primary/5'
                        )}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className={cn('p-2 rounded-full', getNotificationColor(notification.type))}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('font-medium text-sm', !notification.read && 'text-primary')}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                        )}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Нет уведомлений
                    </div>
                  )}
                </div>
                <div className="border-t p-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onPageChange('dashboard')}
                  >
                    Все уведомления
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
