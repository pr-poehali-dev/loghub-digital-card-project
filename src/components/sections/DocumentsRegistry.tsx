import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { DOCUMENT_KINDS, type DocumentKind, type DocumentKindConfig, type Role } from '@/data/mockData';
import DocumentForm from './DocumentForm';

interface DocRecord {
  id: string;
  kindId: DocumentKind;
  title: string;
  number: string;
  status: 'draft' | 'pending' | 'signed' | 'sent';
  createdAt: string;
  createdBy: string;
  values: Record<string, string>;
}

const INITIAL_DOCS: DocRecord[] = [
  {
    id: 'reg-1',
    kindId: 'forwarder-order',
    title: 'Поручение экспедитору',
    number: 'ПЭ-2026-0112',
    status: 'signed',
    createdAt: '24.03.2026 11:42',
    createdBy: 'Морозов А.И.',
    values: {},
  },
  {
    id: 'reg-2',
    kindId: 'etrn',
    title: 'ЭТрН №ЛХ-2026-0347',
    number: 'ЭТрН-2026-0347',
    status: 'pending',
    createdAt: '24.03.2026 09:14',
    createdBy: 'Морозов А.И.',
    values: {},
  },
  {
    id: 'reg-3',
    kindId: 'ezz',
    title: 'Заявка на перевозку',
    number: 'ЭЗЗ-2026-0047',
    status: 'signed',
    createdAt: '23.03.2026 15:30',
    createdBy: 'Морозов А.И.',
    values: {},
  },
];

const STATUS_CONFIG = {
  draft: { label: 'Черновик', color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-border', icon: 'FileEdit' },
  pending: { label: 'Ожидает подписи', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', icon: 'Clock' },
  signed: { label: 'Подписан', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: 'ShieldCheck' },
  sent: { label: 'Отправлен в ГИС', color: 'text-electric', bg: 'bg-electric/10', border: 'border-electric/30', icon: 'Send' },
};

interface DocumentsRegistryProps {
  role: Role;
}

export default function DocumentsRegistry({ role }: DocumentsRegistryProps) {
  const [docs, setDocs] = useState<DocRecord[]>(INITIAL_DOCS);
  const [view, setView] = useState<'registry' | 'create-select' | 'form'>('registry');
  const [selectedKind, setSelectedKind] = useState<DocumentKind | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterKind, setFilterKind] = useState<string>('all');
  const [search, setSearch] = useState('');

  const handleSave = (kind: DocumentKindConfig, values: Record<string, string>, status: 'draft' | 'pending') => {
    const newDoc: DocRecord = {
      id: `reg-${Date.now()}`,
      kindId: kind.id,
      title: kind.title,
      number: values['number'] || `${kind.shortCode}-2026-${String(docs.length + 1).padStart(4, '0')}`,
      status,
      createdAt: new Date().toLocaleString('ru', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdBy: 'Иванов И.И.',
      values,
    };
    setDocs(prev => [newDoc, ...prev]);
    setView('registry');
    setSelectedKind(null);
  };

  const filtered = docs.filter(d => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (filterKind !== 'all' && d.kindId !== filterKind) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (view === 'form' && selectedKind) {
    return (
      <DocumentForm
        kindId={selectedKind}
        role={role}
        onBack={() => { setView('registry'); setSelectedKind(null); }}
        onSave={handleSave}
      />
    );
  }

  if (view === 'create-select') {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setView('registry')}
            className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
          <div>
            <div className="font-bold text-foreground">Создать документ</div>
            <div className="text-xs text-muted-foreground">Выберите тип документа</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {DOCUMENT_KINDS.map(kind => (
            <button
              key={kind.id}
              onClick={() => { setSelectedKind(kind.id); setView('form'); }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card hover:border-border hover:bg-secondary/30 transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-xl ${kind.bgColor} border ${kind.borderColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon name={kind.icon} fallback="File" size={22} className={kind.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${kind.bgColor} ${kind.color}`}>
                    {kind.shortCode}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{kind.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{kind.description}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">{kind.legalBasis}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Реестр документов</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Все ЭПД-документы по перевозке ЛХ-2026-0347</p>
        </div>
        <button
          onClick={() => setView('create-select')}
          className="flex items-center gap-2 px-4 py-2.5 bg-electric text-background rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all glow-electric"
        >
          <Icon name="Plus" size={15} />
          Создать документ
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Всего', count: docs.length, color: 'text-foreground', bg: 'bg-secondary/50' },
          { label: 'Черновиков', count: docs.filter(d => d.status === 'draft').length, color: 'text-muted-foreground', bg: 'bg-secondary/50' },
          { label: 'Ожидают подписи', count: docs.filter(d => d.status === 'pending').length, color: 'text-amber-400', bg: 'bg-amber-400/5' },
          { label: 'Подписаны', count: docs.filter(d => d.status === 'signed').length, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-border/30 rounded-xl px-3 py-2.5 text-center`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-secondary/50 border border-border/40 rounded-xl px-3 py-2">
          <Icon name="Search" size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
            placeholder="Поиск по названию или номеру..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-secondary/50 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-electric/50 transition-colors"
          value={filterKind}
          onChange={e => setFilterKind(e.target.value)}
        >
          <option value="all">Все типы</option>
          {DOCUMENT_KINDS.map(k => (
            <option key={k.id} value={k.id}>{k.shortCode} — {k.title}</option>
          ))}
        </select>
        <select
          className="bg-secondary/50 border border-border/40 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-electric/50 transition-colors"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">Все статусы</option>
          <option value="draft">Черновик</option>
          <option value="pending">Ожидает подписи</option>
          <option value="signed">Подписан</option>
          <option value="sent">Отправлен в ГИС</option>
        </select>
      </div>

      {/* Documents list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="FolderOpen" size={40} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm">Документов не найдено</div>
          <div className="text-xs mt-1">Измените фильтры или создайте новый документ</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => {
            const kind = DOCUMENT_KINDS.find(k => k.id === doc.kindId)!;
            const st = STATUS_CONFIG[doc.status];
            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card hover:border-border/70 hover:bg-secondary/20 transition-all group cursor-pointer"
                onClick={() => { setSelectedKind(doc.kindId); setView('form'); }}
              >
                <div className={`w-10 h-10 rounded-xl ${kind.bgColor} border ${kind.borderColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={kind.icon} fallback="File" size={17} className={kind.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${kind.bgColor} ${kind.color}`}>
                      {kind.shortCode}
                    </span>
                    <span className="text-sm font-semibold text-foreground truncate">{doc.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">{doc.number}</span>
                    <span>·</span>
                    <span>{doc.createdAt}</span>
                    <span>·</span>
                    <span>{doc.createdBy}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${st.color} ${st.bg} ${st.border} flex-shrink-0`}>
                  <Icon name={st.icon} size={11} />
                  {st.label}
                </div>

                <Icon name="ChevronRight" size={15} className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            );
          })}
        </div>
      )}

      {/* Document types legend */}
      <div className="rounded-2xl border border-border/30 bg-secondary/20 p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Типы документов в системе</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOCUMENT_KINDS.map(kind => (
            <div key={kind.id} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg ${kind.bgColor} border ${kind.borderColor} flex items-center justify-center flex-shrink-0`}>
                <Icon name={kind.icon} fallback="File" size={11} className={kind.color} />
              </div>
              <div>
                <div className={`text-[10px] font-bold font-mono ${kind.color}`}>{kind.shortCode}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{kind.title.split(' ').slice(0, 2).join(' ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
