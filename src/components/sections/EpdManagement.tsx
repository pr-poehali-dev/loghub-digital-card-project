import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { ROLES, EPD_DOCUMENTS, type Role, type EpdDocument } from '@/data/mockData';

interface EpdManagementProps {
  role: Role;
}

const docStatusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  signed: { label: 'Подписан', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: 'ShieldCheck' },
  pending: { label: 'Ожидает подписи', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', icon: 'Clock' },
  draft: { label: 'Черновик', color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-border', icon: 'FileEdit' },
  sent: { label: 'Отправлен в ГИС', color: 'text-electric', bg: 'bg-electric/10', border: 'border-electric/30', icon: 'Send' },
};

const typeLabel: Record<string, { label: string; icon: string }> = {
  etrn: { label: 'ЭТрН', icon: 'FileText' },
  act: { label: 'Акт', icon: 'ClipboardList' },
  contract: { label: 'Договор', icon: 'Handshake' },
  other: { label: 'Документ', icon: 'File' },
};

function SignatureChain({ doc }: { doc: EpdDocument }) {
  return (
    <div className="flex items-center gap-1">
      {doc.requiredSignatures.map((roleId) => {
        const rc = ROLES.find(r => r.id === roleId)!;
        const isSigned = doc.signedBy.includes(roleId);
        return (
          <div
            key={roleId}
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
              isSigned
                ? `${rc.bgColor} ${rc.borderColor} ${rc.color}`
                : 'bg-secondary border-border text-muted-foreground opacity-50'
            }`}
            title={`${rc.label}: ${isSigned ? 'подписано' : 'ожидает'}`}
          >
            <Icon name={rc.icon} fallback="Circle" size={10} />
          </div>
        );
      })}
    </div>
  );
}

function DocRow({ doc, role }: { doc: EpdDocument; role: Role }) {
  const sc = docStatusConfig[doc.status];
  const typeInfo = typeLabel[doc.type];
  const canSign = doc.status === 'pending' && doc.requiredSignatures.includes(role) && !doc.signedBy.includes(role);

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-border ${
      canSign ? 'border-electric/30 bg-electric/5' : 'border-border/50 bg-card/50'
    }`}>
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon name={typeInfo.icon} fallback="File" size={18} className="text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{doc.title}</span>
          <span className={`status-pill ${sc.bg} ${sc.color} ${sc.border} border text-[10px]`}>
            <Icon name={sc.icon} fallback="Circle" size={10} />
            {sc.label}
          </span>
          {canSign && (
            <span className="status-pill bg-electric/15 text-electric border border-electric/30 text-[10px] animate-pulse-glow">
              Требуется ваша подпись
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="font-mono">{typeInfo.label}</span>
          <span>·</span>
          <span>Этап {doc.stage}</span>
          <span>·</span>
          <span>{doc.createdAt}</span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className="text-[10px] text-muted-foreground mb-1 text-center">Подписи</div>
        <SignatureChain doc={doc} />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {canSign && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-electric text-background rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
            <Icon name="PenLine" size={12} />
            Подписать
          </button>
        )}
        <button className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-border transition-all">
          <Icon name="Download" size={13} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export default function EpdManagement({ role }: EpdManagementProps) {
  const [filter, setFilter] = useState<string>('all');

  const myPendingDocs = EPD_DOCUMENTS.filter(
    d => d.status === 'pending' && d.requiredSignatures.includes(role) && !d.signedBy.includes(role)
  );

  const filteredDocs = EPD_DOCUMENTS.filter(d => filter === 'all' || d.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Управление ЭПД и титулами</h2>
          <p className="text-sm text-muted-foreground mt-1">Комплект документов по перевозке ЛХ-2026-0347</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-electric text-background rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Icon name="Plus" size={14} />
          Добавить документ
        </button>
      </div>

      {/* Alert for my pending docs */}
      {myPendingDocs.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-electric/8 border border-electric/25">
          <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center flex-shrink-0">
            <Icon name="Bell" size={15} className="text-electric" />
          </div>
          <div>
            <div className="text-sm font-semibold text-electric">Требуется ваша подпись</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {myPendingDocs.map(d => d.title).join(', ')} — ожидают вашей электронной подписи
            </div>
          </div>
          <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-electric text-background rounded-lg text-xs font-semibold hover:opacity-90">
            Подписать все
          </button>
        </div>
      )}

      {/* GIS EPD status */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Icon name="Globe" size={15} className="text-electric" />
            Статус передачи в ГИС ЭПД
          </h3>
          <span className="status-pill bg-amber-400/15 text-amber-400 border border-amber-400/30 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Ожидает подписей
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Создан', done: true, icon: 'CheckCircle2' },
            { label: 'Сбор подписей', done: false, icon: 'PenLine', active: true },
            { label: 'Передача в ГИС', done: false, icon: 'Send' },
            { label: 'Подтверждение', done: false, icon: 'ShieldCheck' },
          ].map((step, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 p-3 rounded-lg ${
              step.done ? 'bg-emerald-400/8 border border-emerald-400/20' :
              step.active ? 'bg-amber-400/8 border border-amber-400/25' :
              'bg-secondary/50 border border-border/30'
            }`}>
              <Icon
                name={step.icon}
                fallback="Circle"
                size={18}
                className={step.done ? 'text-emerald-400' : step.active ? 'text-amber-400' : 'text-muted-foreground'}
              />
              <span className={`text-xs text-center ${step.done ? 'text-emerald-400' : step.active ? 'text-amber-400' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-1/4 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full" />
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'Все' },
          { id: 'pending', label: 'Ожидают подписи' },
          { id: 'signed', label: 'Подписаны' },
          { id: 'draft', label: 'Черновики' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.id
                ? 'bg-electric/15 text-electric border border-electric/30'
                : 'text-muted-foreground hover:text-foreground glass'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground font-mono">{filteredDocs.length} документов</span>
      </div>

      {/* Docs list */}
      <div className="space-y-2">
        {filteredDocs.map(doc => (
          <DocRow key={doc.id} doc={doc} role={role} />
        ))}
      </div>
    </div>
  );
}
