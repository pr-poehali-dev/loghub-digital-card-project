import Icon from '@/components/ui/icon';
import { ROLES, HISTORY, type Role } from '@/data/mockData';

interface HistoryProps {
  role: Role;
}

const typeConfig = {
  status: { label: 'Статус', color: 'text-electric', bg: 'bg-electric/10', icon: 'Activity' },
  document: { label: 'Документ', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: 'FileCheck' },
  data: { label: 'Данные', color: 'text-violet-400', bg: 'bg-violet-400/10', icon: 'Database' },
  correction: { label: 'Корректировка', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: 'RefreshCw' },
};

export default function History({ role }: HistoryProps) {
  const myEvents = HISTORY.filter(e => e.actor === role);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">История изменений</h2>
          <p className="text-sm text-muted-foreground mt-1">Все действия и события по перевозке ЛХ-2026-0347</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:border-electric/40 transition-all">
          <Icon name="Download" size={14} className="text-electric" />
          Экспорт лога
        </button>
      </div>

      {/* My events highlight */}
      {myEvents.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-electric/20">
          <div className="text-xs text-electric font-mono uppercase tracking-wider mb-3">Ваши действия по этой перевозке</div>
          <div className="flex flex-wrap gap-2">
            {myEvents.map(event => (
              <div key={event.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-electric/8 border border-electric/20 text-xs">
                <Icon name={typeConfig[event.type].icon} fallback="Circle" size={11} className="text-electric" />
                <span className="text-foreground">{event.action}</span>
                <span className="text-muted-foreground font-mono">{event.timestamp.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-electric/40 via-border to-transparent" />

        <div className="space-y-3">
          {HISTORY.map((event, index) => {
            const rc = ROLES.find(r => r.id === event.actor)!;
            const tc = typeConfig[event.type];
            const isMe = event.actor === role;

            return (
              <div
                key={event.id}
                className={`relative flex gap-4 pl-12 animate-fade-in`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Timeline dot */}
                <div className={`absolute left-3 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isMe
                    ? 'border-electric bg-electric/20'
                    : 'border-border bg-background'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isMe ? 'bg-electric' : `${rc.color.replace('text-', 'bg-')}`}`} />
                </div>

                {/* Card */}
                <div className={`flex-1 rounded-xl p-4 border transition-all hover:border-border ${
                  isMe ? 'bg-electric/5 border-electric/20' : 'bg-card/50 border-border/50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tc.bg}`}>
                      <Icon name={tc.icon} fallback="Circle" size={14} className={tc.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">{event.action}</span>
                        <span className={`status-pill ${tc.bg} ${tc.color} border border-current/30 text-[10px]`}>
                          {tc.label}
                        </span>
                        {isMe && (
                          <span className="status-pill bg-electric/15 text-electric border border-electric/30 text-[10px]">
                            Вы
                          </span>
                        )}
                      </div>
                      {event.details && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.details}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className={`flex items-center gap-1 ${rc.color}`}>
                          <Icon name={rc.icon} fallback="Circle" size={10} />
                          <span>{event.actorName}</span>
                          <span className="opacity-60">· {rc.shortLabel}</span>
                        </div>
                        <span>·</span>
                        <span className="font-mono">{event.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
        <span className="text-xs text-muted-foreground">Типы событий:</span>
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <span key={key} className={`status-pill ${cfg.bg} ${cfg.color} border border-current/30 text-[10px]`}>
            <Icon name={cfg.icon} fallback="Circle" size={9} />
            {cfg.label}
          </span>
        ))}
      </div>
    </div>
  );
}
