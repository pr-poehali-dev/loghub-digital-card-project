import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { ROLES, STAGES, SHIPMENT, type Role, type Stage } from '@/data/mockData';

interface ShipmentCardProps {
  role: Role;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  done: { label: 'Выполнен', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: 'CheckCircle2' },
  active: { label: 'Активный', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/40', icon: 'Loader' },
  pending: { label: 'Ожидание', color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-border', icon: 'Clock' },
  blocked: { label: 'Заблокирован', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30', icon: 'XCircle' },
};

function StageCard({ stage, isMyStage, expanded, onToggle }: {
  stage: Stage;
  isMyStage: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const sc = statusConfig[stage.status];
  const respRole = ROLES.find(r => r.id === stage.responsible)!;

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        stage.status === 'active'
          ? 'border-amber-400/40 bg-amber-400/5'
          : stage.status === 'done'
            ? 'border-emerald-400/20 bg-emerald-400/3'
            : 'border-border/50 bg-card/50'
      } ${isMyStage && stage.status === 'active' ? 'ring-1 ring-electric/30' : ''}`}
    >
      <button
        className="w-full flex items-center gap-4 p-4 text-left"
        onClick={onToggle}
      >
        {/* Step number */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm font-mono border ${sc.bg} ${sc.border} ${sc.color}`}>
          {stage.status === 'done' ? (
            <Icon name="Check" size={14} />
          ) : (
            stage.number
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{stage.title}</span>
            <span className={`status-pill ${sc.bg} ${sc.color} ${sc.border} border text-[10px]`}>
              <Icon name={sc.icon} fallback="Circle" size={10} />
              {sc.label}
            </span>
            {isMyStage && stage.status === 'active' && (
              <span className="status-pill bg-electric/15 text-electric border border-electric/30 text-[10px]">
                Ваш этап
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span className={`${respRole.color} font-mono`}>{respRole.label}</span>
            {stage.completedAt && (
              <>
                <span>·</span>
                <span>{stage.completedAt}</span>
              </>
            )}
          </div>
        </div>

        {/* Docs count */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
          <Icon name="FileText" size={12} />
          <span>{stage.documents.length}</span>
        </div>

        <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground flex-shrink-0" />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4 animate-fade-in">
          <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>

          <div className="grid grid-cols-2 gap-4">
            {/* Documents */}
            <div>
              <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">Документы</div>
              <div className="space-y-1.5">
                {stage.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      stage.status === 'done' ? 'bg-emerald-400/15' : 'bg-secondary'
                    }`}>
                      <Icon
                        name={stage.status === 'done' ? 'FileCheck' : 'File'}
                        fallback="File"
                        size={11}
                        className={stage.status === 'done' ? 'text-emerald-400' : 'text-muted-foreground'}
                      />
                    </div>
                    <span className={stage.status === 'done' ? 'text-foreground' : 'text-muted-foreground'}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {stage.actions && stage.actions.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">Действия</div>
                <div className="space-y-1.5">
                  {stage.actions.map((action, i) => (
                    <button
                      key={i}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        stage.status === 'active' && isMyStage
                          ? 'bg-electric/10 text-electric border border-electric/30 hover:bg-electric/20'
                          : 'bg-secondary text-muted-foreground cursor-default'
                      }`}
                    >
                      <Icon name={stage.status === 'active' ? 'ArrowRight' : 'Lock'} fallback="Circle" size={11} />
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShipmentCard({ role }: ShipmentCardProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>('stage-3');

  const doneCount = STAGES.filter(s => s.status === 'done').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Цифровая карточка перевозки</h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">ID: ЛХ-2026-0347 · 25.03.2026 — 29.03.2026</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm hover:border-electric/40 transition-all">
          <Icon name="Edit3" size={14} className="text-electric" />
          Редактировать
        </button>
      </div>

      {/* Shipment info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 col-span-2">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">Данные перевозки</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              { label: 'Груз', value: SHIPMENT.cargo },
              { label: 'Вес / объём', value: `${SHIPMENT.weight} / ${SHIPMENT.volume}` },
              { label: 'Откуда', value: SHIPMENT.from },
              { label: 'Куда', value: SHIPMENT.to },
              { label: 'ТС / Водитель', value: `${SHIPMENT.vehicle} / ${SHIPMENT.driver}` },
              { label: 'Расстояние', value: SHIPMENT.distance },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-xs font-medium text-foreground mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex flex-col">
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">Прогресс</div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="38" fill="none" stroke="hsl(220,15%,16%)" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="38" fill="none"
                  stroke="hsl(197,100%,50%)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - doneCount / STAGES.length)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-electric font-mono">{Math.round((doneCount / STAGES.length) * 100)}%</span>
                <span className="text-[10px] text-muted-foreground">{doneCount}/{STAGES.length}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-amber-400">Этап 3: Погрузка</div>
              <div className="text-xs text-muted-foreground">Активный</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stages */}
      <div>
        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">Этапы перевозки</div>
        <div className="space-y-2">
          {STAGES.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              isMyStage={stage.responsible === role}
              expanded={expandedStage === stage.id}
              onToggle={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
