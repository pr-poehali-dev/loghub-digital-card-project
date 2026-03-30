import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Connect1CModalProps {
  onClose: () => void;
  onConnected: () => void;
}

type ConnectionStatus = 'idle' | 'checking' | 'success' | 'error';

const OPERATORS = [
  { id: 'taxcom', name: 'Такском', url: 'https://api.taxcom.ru/epd/v2' },
  { id: 'diadoc', name: 'Диадок (СКБ Контур)', url: 'https://diadoc-api.kontur.ru/v1' },
  { id: 'tensor', name: 'Тензор (СБИС)', url: 'https://online.sbis.ru/service/epd/v3' },
  { id: 'custom', name: 'Другой оператор', url: '' },
];

export default function Connect1CModal({ onClose, onConnected }: Connect1CModalProps) {
  const [operator, setOperator] = useState('taxcom');
  const [customUrl, setCustomUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [kepPassword, setKepPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [connected, setConnected] = useState(false);

  const selectedOp = OPERATORS.find(o => o.id === operator)!;
  const apiUrl = operator === 'custom' ? customUrl : selectedOp.url;

  const handleCheck = () => {
    if (!apiKey.trim()) {
      setErrorMsg('Введите API-ключ');
      setConnectionStatus('error');
      return;
    }
    setConnectionStatus('checking');
    setErrorMsg('');

    setTimeout(() => {
      if (apiKey.length < 8) {
        setConnectionStatus('error');
        setErrorMsg('Неверный API-ключ. Проверьте значение в личном кабинете оператора.');
      } else {
        setConnectionStatus('success');
      }
    }, 2000);
  };

  const handleSave = () => {
    setConnected(true);
    setTimeout(() => {
      onConnected();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 glass-card rounded-2xl border border-border overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center">
              <Icon name="Database" size={15} className="text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Подключение 1С к ГИС ЭПД</div>
              <div className="text-xs text-muted-foreground">Настройка интеграции через оператора ЭДО</div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
            <Icon name="X" size={14} className="text-muted-foreground" />
          </button>
        </div>

        {!connected ? (
          <div className="p-6 space-y-5">
            {/* Instructions */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/40">
              <Icon name="Info" size={14} className="text-electric mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Загрузите модуль интеграции в 1С: <span className="text-foreground font-medium">Администрирование → Расширения → Загрузить расширение</span>. Затем введите параметры ниже.
              </p>
            </div>

            {/* Operator selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Оператор ЭДО</label>
              <div className="grid grid-cols-2 gap-2">
                {OPERATORS.map(op => (
                  <button
                    key={op.id}
                    onClick={() => setOperator(op.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      operator === op.id
                        ? 'border-electric bg-electric/8 text-foreground'
                        : 'border-border/50 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                  >
                    <div className="text-xs font-medium">{op.name}</div>
                    {op.id !== 'custom' && (
                      <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{op.url}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* URL (custom) or show auto-filled */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">URL API оператора</label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                operator !== 'custom' ? 'bg-secondary/40 border-border/30' : 'bg-card border-border'
              }`}>
                <Icon name="Link" size={12} className="text-muted-foreground flex-shrink-0" />
                {operator !== 'custom' ? (
                  <span className="text-muted-foreground font-mono flex-1 truncate">{apiUrl}</span>
                ) : (
                  <input
                    type="url"
                    placeholder="https://api.operator.ru/epd/v1"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground font-mono"
                  />
                )}
                {operator !== 'custom' && (
                  <Icon name="Lock" size={11} className="text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">API-ключ</label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                connectionStatus === 'error' ? 'border-red-400/50 bg-red-400/5' :
                connectionStatus === 'success' ? 'border-emerald-400/50 bg-emerald-400/5' :
                'bg-card border-border focus-within:border-electric/50'
              }`}>
                <Icon name="Key" size={12} className="text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Введите API-ключ из личного кабинета оператора"
                  value={apiKey}
                  onChange={e => { setApiKey(e.target.value); setConnectionStatus('idle'); }}
                  className="flex-1 bg-transparent outline-none text-xs text-foreground placeholder-muted-foreground font-mono"
                />
              </div>
            </div>

            {/* KEP password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Пароль КЭП <span className="font-normal text-muted-foreground">(опционально)</span></label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card focus-within:border-electric/50 transition-all">
                <Icon name="ShieldCheck" size={12} className="text-muted-foreground flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Пароль от КЭП в формате PKCS#12"
                  value={kepPassword}
                  onChange={e => setKepPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs text-foreground placeholder-muted-foreground"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={12} />
                </button>
              </div>
            </div>

            {/* Status message */}
            {connectionStatus === 'error' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-400/8 border border-red-400/25 animate-fade-in">
                <Icon name="XCircle" size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-300/90">{errorMsg}</p>
              </div>
            )}
            {connectionStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-400/8 border border-emerald-400/25 animate-fade-in">
                <Icon name="CheckCircle2" size={13} className="text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-emerald-300">Соединение установлено. Можно сохранить настройки.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCheck}
                disabled={connectionStatus === 'checking'}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:border-border/80 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {connectionStatus === 'checking' ? (
                  <>
                    <Icon name="Loader" size={14} className="animate-spin" />
                    Проверка...
                  </>
                ) : (
                  <>
                    <Icon name="Wifi" size={14} />
                    Проверить соединение
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={connectionStatus !== 'success'}
                className="flex-1 py-2.5 bg-amber-500 text-background rounded-xl text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Save" size={14} />
                Сохранить
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-400/15 flex items-center justify-center mx-auto">
              <Icon name="CheckCircle2" size={28} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">1С подключена к ГИС ЭПД</div>
              <div className="text-xs text-muted-foreground mt-1">
                Интеграция через {selectedOp.name} активирована
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
              Теперь вы можете создавать и отправлять ЭПД прямо из 1С
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
