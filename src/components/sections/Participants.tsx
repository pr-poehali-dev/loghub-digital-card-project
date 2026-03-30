import Icon from '@/components/ui/icon';
import { ROLES, PARTICIPANTS, type Role } from '@/data/mockData';

interface ParticipantsProps {
  role: Role;
}

const statusConfig = {
  connected: { label: 'Подключён', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: 'CheckCircle2' },
  invited: { label: 'Приглашён', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', icon: 'Mail' },
  external: { label: 'Вне хаба', color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-border', icon: 'ExternalLink' },
};

export default function Participants({ role }: ParticipantsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Контакты и роли участников</h2>
          <p className="text-sm text-muted-foreground mt-1">4 участника перевозки ЛХ-2026-0347</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:border-electric/40 transition-all">
          <Icon name="UserPlus" size={14} className="text-electric" />
          Пригласить участника
        </button>
      </div>

      {/* Process flow */}
      <div className="glass-card rounded-xl p-5">
        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">Цепочка перевозки</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {ROLES.map((rc, i) => {
            const participant = PARTICIPANTS.find(p => p.role === rc.id);
            const sc = statusConfig[participant?.status || 'external'];
            const isMe = rc.id === role;
            return (
              <div key={rc.id} className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border min-w-[130px] ${
                  isMe
                    ? `${rc.borderColor} ${rc.bgColor} ring-1 ring-electric/20`
                    : 'border-border/50 bg-card/50'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rc.bgColor}`}>
                    <Icon name={rc.icon} fallback="Circle" size={18} className={rc.color} />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold ${isMe ? rc.color : 'text-foreground'}`}>{rc.label}</div>
                    {participant && (
                      <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[110px]">{participant.company}</div>
                    )}
                  </div>
                  <span className={`status-pill ${sc.bg} ${sc.color} ${sc.border} border text-[10px]`}>
                    <Icon name={sc.icon} fallback="Circle" size={9} />
                    {sc.label}
                  </span>
                  {isMe && <div className="text-[10px] text-electric font-mono">← Вы</div>}
                </div>
                {i < ROLES.length - 1 && (
                  <div className="flex flex-col items-center gap-0.5">
                    <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Participant cards */}
      <div className="grid grid-cols-2 gap-4">
        {PARTICIPANTS.map((participant) => {
          const rc = ROLES.find(r => r.id === participant.role)!;
          const sc = statusConfig[participant.status];
          const isMe = participant.role === role;

          return (
            <div
              key={participant.role}
              className={`glass-card rounded-xl p-5 border transition-all ${
                isMe ? `${rc.borderColor} ring-1 ring-electric/15` : 'border-border/50'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${rc.bgColor}`}>
                  <Icon name={rc.icon} fallback="Circle" size={20} className={rc.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold ${rc.color}`}>{rc.label}</span>
                    {isMe && <span className="text-[10px] text-electric font-mono bg-electric/10 px-1.5 py-0.5 rounded">Вы</span>}
                    <span className={`status-pill ${sc.bg} ${sc.color} ${sc.border} border text-[10px] ml-auto`}>
                      <Icon name={sc.icon} fallback="Circle" size={9} />
                      {sc.label}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-foreground mt-0.5">{participant.name}</div>
                  <div className="text-xs text-muted-foreground">{participant.company}</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-border/30 pt-3">
                {[
                  { icon: 'Phone', value: participant.phone },
                  { icon: 'Mail', value: participant.email },
                  { icon: 'Hash', value: `ИНН: ${participant.inn}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name={item.icon} fallback="Circle" size={12} className="flex-shrink-0" />
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 glass rounded-lg text-xs hover:border-border transition-all">
                  <Icon name="MessageCircle" size={12} />
                  Написать
                </button>
                {participant.status === 'invited' && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-400/15 border border-amber-400/30 text-amber-400 rounded-lg text-xs hover:bg-amber-400/25 transition-all">
                    <Icon name="RefreshCw" size={12} />
                    Повторить
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
