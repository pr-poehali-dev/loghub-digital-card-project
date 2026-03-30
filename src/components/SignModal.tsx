import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import type { EpdDocument } from '@/data/mockData';

interface SignModalProps {
  doc: EpdDocument;
  onClose: () => void;
  onSigned: (docId: string) => void;
}

const CERTIFICATES = [
  { id: 'cert-1', name: 'Васильев Дмитрий Павлович', org: 'ИП Васильев Д.П.', validUntil: '12.09.2027', thumbprint: 'A3:F2:9C:...' },
  { id: 'cert-2', name: 'Васильев Д.П. (КЭП)', org: 'ИП Васильев Д.П.', validUntil: '01.03.2027', thumbprint: 'B7:E1:4D:...' },
];

type Step = 'select' | 'confirm' | 'signing' | 'done';

export default function SignModal({ doc, onClose, onSigned }: SignModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'signing') {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 18 + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setTimeout(() => setStep('done'), 400);
        }
        setProgress(p);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleSign = () => {
    if (!selectedCert) return;
    setStep('signing');
    setProgress(0);
  };

  const handleDone = () => {
    onSigned(doc.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 glass-card rounded-2xl border border-border overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric/15 flex items-center justify-center">
              <Icon name="PenLine" size={15} className="text-electric" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Подписание документа</div>
              <div className="text-xs text-muted-foreground">{doc.title}</div>
            </div>
          </div>
          {step !== 'signing' && (
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
              <Icon name="X" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Steps indicator */}
        {step !== 'done' && (
          <div className="flex items-center gap-0 px-6 pt-4">
            {['select', 'confirm', 'signing'].map((s, i) => {
              const steps: Step[] = ['select', 'confirm', 'signing'];
              const currentIdx = steps.indexOf(step);
              const isDone = i < currentIdx;
              const isActive = s === step;
              return (
                <div key={s} className="flex items-center gap-0 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone ? 'bg-emerald-400 text-background' : isActive ? 'bg-electric text-background' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isDone ? <Icon name="Check" size={12} /> : i + 1}
                  </div>
                  {i < 2 && <div className={`flex-1 h-0.5 mx-1 transition-all ${isDone ? 'bg-emerald-400' : 'bg-secondary'}`} />}
                </div>
              );
            })}
          </div>
        )}

        <div className="p-6">
          {/* Step 1: Select certificate */}
          {step === 'select' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">Выберите сертификат КЭП</div>
                <div className="text-xs text-muted-foreground">Доступные квалифицированные электронные подписи</div>
              </div>
              <div className="space-y-2">
                {CERTIFICATES.map(cert => (
                  <button
                    key={cert.id}
                    onClick={() => setSelectedCert(cert.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedCert === cert.id
                        ? 'border-electric bg-electric/8'
                        : 'border-border/50 bg-secondary/30 hover:border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
                        selectedCert === cert.id ? 'border-electric bg-electric' : 'border-border'
                      }`}>
                        {selectedCert === cert.id && (
                          <div className="w-full h-full rounded-full bg-background scale-50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">{cert.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{cert.org}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {cert.thumbprint}
                          </span>
                          <span className="text-[10px] text-emerald-400">
                            Действует до {cert.validUntil}
                          </span>
                        </div>
                      </div>
                      <Icon name="ShieldCheck" size={16} className="text-emerald-400 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedCert}
                onClick={() => setStep('confirm')}
                className="w-full py-2.5 bg-electric text-background rounded-xl text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all"
              >
                Далее
              </button>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">Подтвердите подписание</div>
                <div className="text-xs text-muted-foreground">Проверьте данные перед применением КЭП</div>
              </div>
              <div className="space-y-2 rounded-xl bg-secondary/40 border border-border/40 p-4">
                {[
                  { label: 'Документ', value: doc.title },
                  { label: 'Тип', value: 'ЭТрН — титул перевозчика' },
                  { label: 'Перевозка', value: 'ЛХ-2026-0347' },
                  { label: 'Сертификат', value: CERTIFICATES.find(c => c.id === selectedCert)?.name ?? '' },
                  { label: 'Действие', value: 'Подписание титула' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs gap-4">
                    <span className="text-muted-foreground flex-shrink-0">{row.label}</span>
                    <span className="text-foreground text-right font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-400/8 border border-amber-400/20">
                <Icon name="Info" size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-300/80">
                  После подписания документ будет передан оператору ЭДО и направлен контрагентам и в ГИС ЭПД
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
                >
                  Назад
                </button>
                <button
                  onClick={handleSign}
                  className="flex-1 py-2.5 bg-electric text-background rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Подписать
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Signing progress */}
          {step === 'signing' && (
            <div className="space-y-5 py-2 animate-fade-in">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-electric/15 flex items-center justify-center mx-auto mb-3">
                  <Icon name="Loader" size={24} className="text-electric animate-spin" />
                </div>
                <div className="text-sm font-semibold text-foreground">Применяется КЭП...</div>
                <div className="text-xs text-muted-foreground mt-1">Пожалуйста, не закрывайте окно</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Прогресс подписания</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-electric to-violet-400 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Хеширование документа', done: progress > 20 },
                  { label: 'Генерация подписи', done: progress > 55 },
                  { label: 'Проверка сертификата', done: progress > 80 },
                  { label: 'Передача оператору ЭДО', done: progress >= 100 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                      item.done ? 'bg-emerald-400' : 'bg-secondary'
                    }`}>
                      {item.done && <Icon name="Check" size={8} className="text-background" />}
                    </div>
                    <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 'done' && (
            <div className="space-y-5 py-2 text-center animate-scale-in">
              <div>
                <div className="w-16 h-16 rounded-full bg-emerald-400/15 flex items-center justify-center mx-auto mb-3">
                  <Icon name="ShieldCheck" size={28} className="text-emerald-400" />
                </div>
                <div className="text-base font-bold text-foreground">Документ подписан</div>
                <div className="text-xs text-muted-foreground mt-1">КЭП успешно применена и передана оператору</div>
              </div>
              <div className="text-left space-y-2 rounded-xl bg-emerald-400/6 border border-emerald-400/20 p-4">
                {[
                  { label: 'Документ', value: doc.title },
                  { label: 'Время подписания', value: new Date().toLocaleString('ru') },
                  { label: 'Статус', value: 'Передано оператору ЭДО' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs gap-4">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="text-emerald-400 font-medium text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
                Документ направлен грузополучателю для подписания
              </div>
              <button
                onClick={handleDone}
                className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Готово
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
