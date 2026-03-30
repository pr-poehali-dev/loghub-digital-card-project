import Icon from '@/components/ui/icon';
import { ROLES, STAGES, SHIPMENT, type Role } from '@/data/mockData';

interface DashboardProps {
  role: Role;
  onSectionChange: (s: string) => void;
}

const roleActions: Record<Role, { title: string; desc: string; icon: string; urgent: boolean }[]> = {
  sender: [
    { title: 'Проверить данные груза', desc: 'Убедитесь, что вес и объём совпадают с накладной', icon: 'ClipboardCheck', urgent: false },
    { title: 'Подписать ЭТрН', desc: 'Ваш титул отправителя ожидает подписи', icon: 'PenLine', urgent: true },
  ],
  forwarder: [
    { title: 'Подтвердить перевозчика', desc: 'Васильев Д.П. назначен, ожидает подтверждения', icon: 'UserCheck', urgent: false },
    { title: 'Контроль этапа 3', desc: 'Перевозчик принимает груз — требуется мониторинг', icon: 'Eye', urgent: false },
  ],
  carrier: [
    { title: 'Подписать титул перевозчика', desc: 'ЭТрН №ЛХ-2026-0347 ожидает вашей подписи', icon: 'PenLine', urgent: true },
    { title: 'Загрузить фото погрузки', desc: '3 фото — обязательное требование по договору', icon: 'Camera', urgent: true },
  ],
  receiver: [
    { title: 'Подготовить склад к приёмке', desc: 'Расчётное прибытие 29.03.2026', icon: 'Warehouse', urgent: false },
    { title: 'Назначить ответственного', desc: 'Для подписи титула получателя нужна КЭП', icon: 'UserPlus', urgent: false },
  ],
};

const roleSummary: Record<Role, { stat: string; label: string; color: string }[]> = {
  sender: [
    { stat: '1', label: 'Перевозка в работе', color: 'text-amber-400' },
    { stat: '2', label: 'Документа подписано', color: 'text-emerald-400' },
    { stat: '1', label: 'Требует действия', color: 'text-rose-400' },
  ],
  forwarder: [
    { stat: '3', label: 'Активных рейсов', color: 'text-electric' },
    { stat: '1', label: 'Ожидает контроля', color: 'text-amber-400' },
    { stat: '5', label: 'Документов в работе', color: 'text-violet-400' },
  ],
  carrier: [
    { stat: '1', label: 'Активный рейс', color: 'text-amber-400' },
    { stat: '2', label: 'Действия требуются', color: 'text-rose-400' },
    { stat: '3191', label: 'км маршрут', color: 'text-electric' },
  ],
  receiver: [
    { stat: '1', label: 'Ожидаемая поставка', color: 'text-electric' },
    { stat: '4', label: 'Дня до прибытия', color: 'text-amber-400' },
    { stat: '22т', label: 'Груз пшеница', color: 'text-emerald-400' },
  ],
};

export default function Dashboard({ role, onSectionChange }: DashboardProps) {
  const actions = roleActions[role];
  const stats = roleSummary[role];
  const roleConfig = ROLES.find(r => r.id === role)!;
  const activeStage = STAGES.find(s => s.status === 'active');
  const doneCount = STAGES.filter(s => s.status === 'done').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 p-6"
        style={{ background: 'linear-gradient(135deg, hsl(220,20%,8%) 0%, hsl(220,18%,10%) 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsla(197,100%,50%,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsla(38,100%,55%,0.1) 0%, transparent 40%)' }} />

        <div className="relative flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`status-pill ${roleConfig.bgColor} ${roleConfig.color} ${roleConfig.borderColor} border`}>
                <Icon name={roleConfig.icon} fallback="Circle" size={11} />
                {roleConfig.label}
              </div>
              <div className="status-pill bg-amber-400/15 text-amber-400 border border-amber-400/30">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Рейс в процессе
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Перевозка <span className="text-electric">ЛХ-2026-0347</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {SHIPMENT.cargo} · {SHIPMENT.weight}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={13} className="text-electric flex-shrink-0" />
              <span className="truncate">{SHIPMENT.from.split('(')[0].trim()}</span>
              <Icon name="ArrowRight" size={13} />
              <span className="truncate">{SHIPMENT.to.split('(')[0].trim()}</span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xs text-muted-foreground font-mono mb-1">Прогресс рейса</div>
            <div className="text-3xl font-bold text-electric font-mono">{Math.round((doneCount / STAGES.length) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Этапов: {doneCount}/{STAGES.length}</div>
            <div className="mt-2 w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-electric to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / STAGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4 hover-lift">
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.stat}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* My actions */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="ListChecks" size={15} className="text-electric" />
              Мои действия
            </h3>
            {actions.some(a => a.urgent) && (
              <span className="status-pill bg-rose-500/15 text-rose-400 border border-rose-400/30 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                Срочно
              </span>
            )}
          </div>
          <div className="space-y-3">
            {actions.map((action, i) => (
              <button
                key={i}
                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] ${
                  action.urgent
                    ? 'bg-electric/8 border border-electric/25 hover:border-electric/50'
                    : 'bg-secondary/50 border border-transparent hover:border-border'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${action.urgent ? 'bg-electric/20' : 'bg-secondary'}`}>
                  <Icon name={action.icon} fallback="Circle" size={15} className={action.urgent ? 'text-electric' : 'text-muted-foreground'} />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${action.urgent ? 'text-electric' : 'text-foreground'}`}>{action.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
                </div>
                {action.urgent && <Icon name="ChevronRight" size={14} className="text-electric ml-auto flex-shrink-0 mt-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Current stage */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="Milestone" size={15} className="text-amber-400" />
              Текущий этап
            </h3>
            <button onClick={() => onSectionChange('card')} className="text-xs text-electric hover:underline">
              Все этапы →
            </button>
          </div>
          {activeStage && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-amber-400 font-mono">{activeStage.number}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{activeStage.title}</div>
                  <div className="text-xs text-amber-400 font-mono">Активный этап</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeStage.description}</p>
              <div className="space-y-1.5">
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Требуется:</div>
                {activeStage.actions?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                    <Icon name="Circle" size={6} className="text-electric flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Route brief */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Icon name="Route" size={15} className="text-electric" />
          Маршрут и ТС
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'ТС', value: SHIPMENT.vehicle, icon: 'Truck' },
            { label: 'Водитель', value: SHIPMENT.driver, icon: 'User' },
            { label: 'Дата загрузки', value: SHIPMENT.loadDate, icon: 'Calendar' },
            { label: 'ETA', value: SHIPMENT.eta, icon: 'Clock' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name={item.icon} fallback="Circle" size={13} className="text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-xs font-medium text-foreground mt-0.5">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
