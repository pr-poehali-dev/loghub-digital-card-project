import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { DOCUMENT_KINDS, type DocumentKind, type DocumentKindConfig, type DocumentField, type Role } from '@/data/mockData';

interface DocumentFormProps {
  kindId: DocumentKind;
  role: Role;
  onBack: () => void;
  onSave: (kind: DocumentKindConfig, values: Record<string, string>, status: 'draft' | 'pending') => void;
}

function groupFields(fields: DocumentField[]) {
  const groups: Record<string, DocumentField[]> = {};
  for (const f of fields) {
    const g = f.group ?? 'Основное';
    if (!groups[g]) groups[g] = [];
    groups[g].push(f);
  }
  return groups;
}

function FieldInput({ field, value, onChange }: { field: DocumentField; value: string; onChange: (v: string) => void }) {
  const base = 'w-full bg-secondary/60 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-electric/50 focus:bg-secondary transition-all';

  if (field.type === 'textarea') {
    return (
      <textarea
        className={`${base} resize-none h-20`}
        placeholder={field.placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <select
        className={base}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">— выберите —</option>
        {field.options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'date') {
    return (
      <input
        type="date"
        className={base}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <input
        type="number"
        className={base}
        placeholder={field.placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      type="text"
      className={base}
      placeholder={field.placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      maxLength={field.type === 'inn' ? 12 : undefined}
    />
  );
}

export default function DocumentForm({ kindId, role, onBack, onSave }: DocumentFormProps) {
  const kind = DOCUMENT_KINDS.find(k => k.id === kindId)!;

  const initValues: Record<string, string> = {};
  for (const f of kind.fields) {
    initValues[f.key] = f.defaultValue ?? '';
  }

  const [values, setValues] = useState<Record<string, string>>(initValues);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const groups = groupFields(kind.fields);

  const setValue = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: false }));
  };

  const validate = () => {
    const errs: Record<string, boolean> = {};
    for (const f of kind.fields) {
      if (f.required && !values[f.key]?.trim()) errs[f.key] = true;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAction = (status: 'draft' | 'pending') => {
    if (status === 'pending' && !validate()) return;
    setSaved(true);
    setTimeout(() => {
      onSave(kind, values, status);
    }, 800);
  };

  const canSign = kind.requiredRoles.includes(role);

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all flex-shrink-0"
        >
          <Icon name="ChevronLeft" size={18} />
        </button>
        <div className={`w-10 h-10 rounded-xl ${kind.bgColor} border ${kind.borderColor} flex items-center justify-center flex-shrink-0`}>
          <Icon name={kind.icon} fallback="File" size={18} className={kind.color} />
        </div>
        <div>
          <div className="font-bold text-foreground text-base">{kind.title}</div>
          <div className="text-xs text-muted-foreground">{kind.description}</div>
        </div>
      </div>

      {/* Legal basis */}
      <div className="flex items-start gap-2 bg-secondary/40 border border-border/30 rounded-xl px-4 py-2.5">
        <Icon name="Scale" size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
        <span className="text-xs text-muted-foreground">{kind.legalBasis}</span>
      </div>

      {/* Required signers */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Подписанты:</span>
        {kind.requiredRoles.map(r => {
          const roleLabels: Record<string, string> = {
            sender: 'Отправитель',
            forwarder: 'Экспедитор',
            carrier: 'Перевозчик',
            receiver: 'Получатель',
          };
          const roleColors: Record<string, string> = {
            sender: 'text-electric bg-electric/10 border-electric/30',
            forwarder: 'text-violet-400 bg-violet-400/10 border-violet-400/30',
            carrier: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
            receiver: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
          };
          return (
            <span key={r} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColors[r]}`}>
              {roleLabels[r]}
            </span>
          );
        })}
      </div>

      {/* Fields by group */}
      {Object.entries(groups).map(([groupName, fields]) => (
        <div key={groupName} className="rounded-2xl border border-border/40 overflow-hidden">
          <div className="px-4 py-2.5 bg-secondary/30 border-b border-border/30">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{groupName}</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map(field => {
              const isFullWidth = field.type === 'textarea' || field.key.includes('Address') || field.key === 'route' || field.key === 'notes';
              return (
                <div key={field.key} className={isFullWidth ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    {field.label}
                    {field.required && <span className="text-rose-400 ml-0.5">*</span>}
                  </label>
                  <FieldInput
                    field={field}
                    value={values[field.key] ?? ''}
                    onChange={v => setValue(field.key, v)}
                  />
                  {errors[field.key] && (
                    <p className="text-xs text-rose-400 mt-1">Обязательное поле</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Actions */}
      {saved ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 flex items-center gap-3 animate-scale-in">
          <Icon name="CheckCircle2" size={22} className="text-emerald-400 flex-shrink-0" />
          <div>
            <div className="text-sm font-bold text-emerald-400">Документ сохранён</div>
            <div className="text-xs text-muted-foreground mt-0.5">Возвращаю в реестр...</div>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction('draft')}
            className="flex-1 py-3 border border-border/50 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all flex items-center justify-center gap-2"
          >
            <Icon name="Save" size={15} />
            Сохранить черновик
          </button>
          {canSign ? (
            <button
              onClick={() => handleAction('pending')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${kind.bgColor} ${kind.color} border ${kind.borderColor} hover:opacity-80`}
            >
              <Icon name="PenLine" size={15} />
              Подписать и отправить
            </button>
          ) : (
            <div className="flex-1 py-3 rounded-2xl text-sm text-muted-foreground bg-secondary/50 border border-border/30 flex items-center justify-center gap-2 cursor-not-allowed">
              <Icon name="Lock" size={15} />
              Нет прав подписания
            </div>
          )}
        </div>
      )}
    </div>
  );
}
