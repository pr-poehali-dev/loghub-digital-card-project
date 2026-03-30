import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface GisEpdModalProps {
  shipmentId: string;
  onClose: () => void;
  onSent: () => void;
}

type Step = 'review' | 'sending' | 'done' | 'error';

const CHECKS = [
  { id: 'sigs', label: 'Проверка наличия всех подписей', delay: 300 },
  { id: 'fields', label: 'Проверка корректности полей', delay: 800 },
  { id: 'format', label: 'Формат документа (ФЗ-259)', delay: 1300 },
  { id: 'operator', label: 'Передача оператору ЭДО', delay: 2000 },
  { id: 'gis', label: 'Регистрация в ГИС ЭПД', delay: 2800 },
  { id: 'uid', label: 'Присвоение УИД документу', delay: 3400 },
];

const MOCK_UID = 'ЭПД-2026-54871-МСК';
const MOCK_QR = 'https://epd.gov.ru/v/ЭПД-2026-54871-МСК';

export default function GisEpdModal({ shipmentId, onClose, onSent }: GisEpdModalProps) {
  const [step, setStep] = useState<Step>('review');
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);
  const [currentCheck, setCurrentCheck] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 'sending') return;

    setCompletedChecks([]);
    setCurrentCheck(null);

    const timers: ReturnType<typeof setTimeout>[] = [];

    CHECKS.forEach(({ id, delay }) => {
      timers.push(setTimeout(() => {
        setCurrentCheck(id);
        setTimeout(() => {
          setCompletedChecks(prev => [...prev, id]);
          setCurrentCheck(null);
        }, 350);
      }, delay));
    });

    timers.push(setTimeout(() => {
      setStep('done');
    }, CHECKS[CHECKS.length - 1].delay + 800));

    return () => timers.forEach(clearTimeout);
  }, [step]);

  const handleSend = () => {
    setStep('sending');
  };

  const handleDone = () => {
    onSent();
    onClose();
  };

  const totalChecks = CHECKS.length;
  const doneChecks = completedChecks.length;
  const progressPct = (doneChecks / totalChecks) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={step === 'sending' ? undefined : onClose} />
      <div className="relative w-full max-w-md mx-4 glass-card rounded-2xl border border-border overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-400/15 flex items-center justify-center">
              <Icon name="Send" size={15} className="text-violet-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Передача в ГИС ЭПД</div>
              <div className="text-xs text-muted-foreground">Перевозка {shipmentId}</div>
            </div>
          </div>
          {step !== 'sending' && (
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
              <Icon name="X" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Review step */}
          {step === 'review' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">Готово к отправке</div>
                <div className="text-xs text-muted-foreground">Комплект ЭПД по перевозке сформирован и подписан</div>
              </div>

              {/* Documents checklist */}
              <div className="space-y-2">
                {[
                  { name: 'ЭТрН №ЛХ-2026-0347', sigs: 4, required: 4, ok: true },
                  { name: 'Поручение экспедитору №ПЭ-2026-0112', sigs: 2, required: 2, ok: true },
                  { name: 'Акт приёмки груза', sigs: 0, required: 2, ok: false },
                ].map((doc) => (
                  <div key={doc.name} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    doc.ok ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-amber-400/25 bg-amber-400/5'
                  }`}>
                    <Icon
                      name={doc.ok ? 'CheckCircle2' : 'AlertCircle'}
                      size={15}
                      className={doc.ok ? 'text-emerald-400 flex-shrink-0' : 'text-amber-400 flex-shrink-0'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{doc.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Подписей: {doc.sigs}/{doc.required}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-400/8 border border-amber-400/20">
                <Icon name="AlertTriangle" size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-300/80">
                  Акт приёмки не подписан, но не является обязательным для передачи ЭТрН в ГИС ЭПД. Отправку можно выполнить.
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-all">
                  Отмена
                </button>
                <button onClick={handleSend} className="flex-1 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Icon name="Send" size={14} />
                  Отправить в ГИС ЭПД
                </button>
              </div>
            </div>
          )}

          {/* Sending progress */}
          {step === 'sending' && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-violet-400/15 flex items-center justify-center mx-auto mb-3">
                  <Icon name="Loader" size={24} className="text-violet-400 animate-spin" />
                </div>
                <div className="text-sm font-semibold text-foreground">Передача в ГИС ЭПД...</div>
                <div className="text-xs text-muted-foreground mt-1">Пожалуйста, не закрывайте окно</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Проверки и передача</span>
                  <span>{doneChecks}/{totalChecks}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-electric rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                {CHECKS.map(check => {
                  const isDone = completedChecks.includes(check.id);
                  const isActive = currentCheck === check.id;
                  return (
                    <div key={check.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                        isDone ? 'bg-emerald-400' : isActive ? 'bg-violet-400' : 'bg-secondary'
                      }`}>
                        {isDone && <Icon name="Check" size={8} className="text-background" />}
                        {isActive && <Icon name="Loader" size={8} className="text-background animate-spin" />}
                      </div>
                      <span className={isDone ? 'text-foreground' : isActive ? 'text-violet-300' : 'text-muted-foreground'}>
                        {check.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="space-y-5 animate-scale-in">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-400/15 flex items-center justify-center mx-auto mb-3">
                  <Icon name="CheckCircle2" size={28} className="text-emerald-400" />
                </div>
                <div className="text-base font-bold text-foreground">Документ зарегистрирован в ГИС ЭПД</div>
                <div className="text-xs text-muted-foreground mt-1">Уведомления отправлены всем участникам</div>
              </div>

              {/* UID */}
              <div className="rounded-xl bg-secondary/40 border border-border/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Уникальный идентификатор (УИД)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-sm font-bold text-electric bg-electric/8 border border-electric/20 rounded-lg px-3 py-2">
                    {MOCK_UID}
                  </div>
                  <button
                    onClick={() => navigator.clipboard?.writeText(MOCK_UID)}
                    className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-border/80 transition-all"
                  >
                    <Icon name="Copy" size={13} className="text-muted-foreground" />
                  </button>
                </div>

                {/* QR code visual placeholder */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-20 h-20 rounded-lg bg-white p-2 flex-shrink-0">
                    <div className="w-full h-full grid grid-cols-5 gap-0.5">
                      {Array.from({ length: 25 }).map((_, i) => {
                        const pattern = [1,1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,1,0];
                        return (
                          <div
                            key={i}
                            className={`rounded-[1px] ${pattern[i] ? 'bg-gray-900' : 'bg-white'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="text-xs text-muted-foreground">QR-код для водителя</div>
                    <div className="text-[10px] text-muted-foreground leading-relaxed">
                      Водитель предъявляет этот QR-код инспектору ГИБДД при проверке вместо бумажной ТТН
                    </div>
                    <div className="font-mono text-[9px] text-electric/60 break-all">{MOCK_QR}</div>
                  </div>
                </div>
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
