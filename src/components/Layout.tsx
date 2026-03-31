import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { ROLES, type Role } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'documents', label: 'Реестр документов', icon: 'FolderOpen' },
  { id: 'epd', label: 'Управление ЭПД', icon: 'ShieldCheck' },
  { id: 'card', label: 'Карточка перевозки', icon: 'FileText' },
  { id: 'participants', label: 'Участники', icon: 'Users' },
  { id: 'driver', label: 'Карточка водителя', icon: 'IdCard' },
  { id: 'history', label: 'История изменений', icon: 'History' },
  { id: 'settings', label: 'Настройки 1С/ERP', icon: 'Settings2' },
];

export default function Layout({ children, activeSection, onSectionChange, activeRole, onRoleChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentRole = ROLES.find(r => r.id === activeRole)!;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} border-r border-border bg-sidebar`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border/30">
          <div className="w-8 h-8 rounded-lg bg-electric flex items-center justify-center flex-shrink-0 glow-electric">
            <Icon name="Zap" size={16} className="text-background" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <div className="text-sm font-bold text-foreground tracking-wide">ЛогХаб</div>
              <div className="text-xs text-muted-foreground font-mono">v1.0 beta</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={16} />
          </button>
        </div>

        {/* Role switcher */}
        <div className="p-3 border-b border-border/30" ref={dropdownRef}>
          {sidebarOpen ? (
            <div>
              <div className="text-xs text-muted-foreground px-2 mb-1.5 font-mono uppercase tracking-wider">Моя роль</div>
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${currentRole.bgColor} ${currentRole.color} ${currentRole.borderColor}`}
                >
                  <Icon name={currentRole.icon} fallback="Circle" size={14} />
                  {currentRole.label}
                  <Icon name={roleDropdownOpen ? 'ChevronUp' : 'ChevronDown'} size={12} className="ml-auto" />
                </button>
                {roleDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                    {ROLES.filter(r => r.id !== activeRole).map(role => (
                      <button
                        key={role.id}
                        onClick={() => { onRoleChange(role.id); setRoleDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
                      >
                        <Icon name={role.icon} fallback="Circle" size={14} />
                        {role.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                title={currentRole.label}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${currentRole.bgColor} ${currentRole.color}`}
              >
                <Icon name={currentRole.icon} fallback="Circle" size={14} />
              </button>
              {roleDropdownOpen && (
                <div className="absolute left-16 mt-0 z-50 rounded-lg border border-border bg-card shadow-lg overflow-hidden min-w-36">
                  {ROLES.filter(r => r.id !== activeRole).map(role => (
                    <button
                      key={role.id}
                      onClick={() => { onRoleChange(role.id); setRoleDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
                    >
                      <Icon name={role.icon} fallback="Circle" size={14} />
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full nav-item ${
                activeSection === item.id ? 'nav-item-active' : 'nav-item-inactive'
              } ${!sidebarOpen ? 'justify-center px-0' : ''}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon name={item.icon} fallback="Circle" size={16} />
              {sidebarOpen && <span className="animate-fade-in">{item.label}</span>}
              {sidebarOpen && activeSection === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-electric" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border/30">
          <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg glass-card ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${currentRole.bgColor}`}>
              <Icon name={currentRole.icon} fallback="Circle" size={14} className={currentRole.color} />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground truncate">Иванов И.И.</div>
                <div className={`text-xs ${currentRole.color} font-mono`}>{currentRole.shortLabel}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-3.5 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Перевозка</span>
            <Icon name="ChevronRight" size={12} />
            <span className="text-electric font-semibold">ЛХ-2026-0347</span>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <div className="status-pill bg-amber-400/15 text-amber-400 border border-amber-400/30 animate-pulse-glow">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              В процессе
            </div>
            <div className="text-xs text-muted-foreground font-mono">Этап 3/6</div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Bell" size={15} />
              <span className="w-4 h-4 rounded-full bg-electric text-background text-[10px] flex items-center justify-center font-bold">2</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs glass px-3 py-1.5 rounded-lg hover:border-electric/40 transition-all">
              <Icon name="Download" size={13} />
              Скачать комплект
            </button>
            <button className="flex items-center gap-1.5 text-xs bg-electric text-background px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              <Icon name="Send" size={13} />
              В ГИС ЭПД
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}