import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { SHIPMENT } from '@/data/mockData';

const UID = 'ЭПД-2026-54871-МСК';
const QR_URL = `https://epd.gov.ru/v/${UID}`;

function QRCode({ size = 200 }: { size?: number }) {
  const modules = 21;
  const cell = size / modules;

  const pattern = [
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,1,0,1,1,0,1,0],
    [0,1,0,0,1,1,0,1,1,0,0,1,0,0,0,1,0,1,1,0,1],
    [1,1,0,1,0,0,1,0,1,1,0,1,1,0,1,0,1,0,1,1,0],
    [0,0,1,0,1,1,0,0,0,1,1,0,0,1,0,1,1,0,0,0,1],
    [1,0,1,0,0,0,1,1,1,0,0,1,0,0,1,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,0,1,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0],
    [1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,0,0,1,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,1,1,1],
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" rx="8" />
      {pattern.map((row, r) =>
        row.map((val, c) =>
          val ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell + 1}
              y={r * cell + 1}
              width={cell - 1}
              height={cell - 1}
              fill="#0f172a"
              rx="1"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function DriverCard() {
  const [presented, setPresented] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="max-w-sm mx-auto space-y-0 animate-fade-in">
      {/* Mobile phone frame feel */}
      <div className="rounded-3xl border border-border/60 overflow-hidden bg-card shadow-2xl">

        {/* Header strip */}
        <div className="bg-gradient-to-r from-[hsl(220,20%,8%)] to-[hsl(220,20%,10%)] px-5 pt-5 pb-4 border-b border-border/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-electric flex items-center justify-center glow-electric">
                <Icon name="Zap" size={13} className="text-background" />
              </div>
              <span className="text-xs font-bold text-foreground tracking-wide">ЛогХаб</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2 py-1 rounded-full">
              ● Документ действителен
            </span>
          </div>
          <div className="text-lg font-bold text-foreground">Карточка водителя</div>
          <div className="text-xs text-muted-foreground mt-0.5 font-mono">Электронный перевозочный документ</div>
        </div>

        {/* QR block */}
        <div className="px-5 py-5 flex flex-col items-center border-b border-border/40 bg-secondary/20">
          <div
            className={`cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${fullscreen ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-8' : ''}`}
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen && (
              <div className="absolute top-6 right-6">
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Icon name="X" size={18} className="text-foreground" />
                </button>
              </div>
            )}
            <div className={`rounded-2xl p-3 bg-white shadow-xl ${fullscreen ? 'w-72 h-72' : 'w-48 h-48'}`}>
              <QRCode size={fullscreen ? 264 : 168} />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            Нажмите на QR-код для увеличения
          </p>

          <div className="mt-3 w-full bg-secondary/50 border border-border/40 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <Icon name="Link" size={13} className="text-muted-foreground flex-shrink-0" />
            <span className="font-mono text-xs text-electric truncate">{UID}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(QR_URL)}
              className="ml-auto flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="Copy" size={13} />
            </button>
          </div>
        </div>

        {/* Driver info */}
        <div className="px-5 py-4 border-b border-border/40 space-y-3">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Водитель и ТС</div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={20} className="text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{SHIPMENT.driver}</div>
              <div className="text-xs text-muted-foreground">Перевозчик: ИП Васильев Д.П.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary/50 rounded-xl px-3 py-2.5 border border-border/30">
              <div className="text-[10px] text-muted-foreground mb-1">Гос. номер</div>
              <div className="font-mono text-sm font-bold text-foreground">Т456МН77</div>
            </div>
            <div className="bg-secondary/50 rounded-xl px-3 py-2.5 border border-border/30">
              <div className="text-[10px] text-muted-foreground mb-1">ТС</div>
              <div className="text-sm font-semibold text-foreground">Scania R450</div>
            </div>
          </div>
        </div>

        {/* Shipment info */}
        <div className="px-5 py-4 border-b border-border/40 space-y-3">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Груз и маршрут</div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-electric/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Package" size={10} className="text-electric" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Груз</div>
                <div className="text-sm font-medium text-foreground">{SHIPMENT.cargo}</div>
                <div className="text-xs text-muted-foreground">{SHIPMENT.weight} · {SHIPMENT.volume}</div>
              </div>
            </div>

            <div className="ml-2.5 border-l-2 border-border/40 pl-4 space-y-2 py-1">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-2 h-2 rounded-full bg-electric" />
                  <div className="text-[10px] text-muted-foreground">Откуда</div>
                </div>
                <div className="text-xs font-medium text-foreground leading-snug">{SHIPMENT.from}</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="text-[10px] text-muted-foreground">Куда</div>
                </div>
                <div className="text-xs font-medium text-foreground leading-snug">{SHIPMENT.to}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: 'MapPin', label: 'Расстояние', value: SHIPMENT.distance },
              { icon: 'Calendar', label: 'Загрузка', value: SHIPMENT.loadDate },
              { icon: 'Clock', label: 'Прибытие', value: SHIPMENT.eta },
            ].map(item => (
              <div key={item.label} className="bg-secondary/50 rounded-xl px-2.5 py-2 border border-border/30 text-center">
                <Icon name={item.icon} size={12} className="text-muted-foreground mx-auto mb-1" />
                <div className="text-[9px] text-muted-foreground">{item.label}</div>
                <div className="text-xs font-semibold text-foreground mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="px-5 py-4 border-b border-border/40 space-y-2">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Документы комплекта</div>

          {[
            { name: 'ЭТрН №ЛХ-2026-0347', signed: true, sigCount: '2/4' },
            { name: 'Поручение экспедитору', signed: true, sigCount: '2/2' },
            { name: 'Акт приёмки груза', signed: false, sigCount: '0/2' },
          ].map(doc => (
            <div key={doc.name} className="flex items-center gap-2.5 py-2 border-b border-border/20 last:border-0">
              <Icon
                name={doc.signed ? 'FileCheck2' : 'FileX2'}
                size={15}
                className={doc.signed ? 'text-emerald-400' : 'text-muted-foreground'}
              />
              <span className="flex-1 text-xs text-foreground">{doc.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                doc.signed ? 'text-emerald-400 bg-emerald-400/10' : 'text-muted-foreground bg-secondary'
              }`}>
                {doc.sigCount} подп.
              </span>
            </div>
          ))}
        </div>

        {/* Present button */}
        <div className="px-5 py-4">
          {!presented ? (
            <button
              onClick={() => setPresented(true)}
              className="w-full py-3.5 bg-electric text-background rounded-2xl text-sm font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 glow-electric"
            >
              <Icon name="ScanLine" size={18} />
              Предъявить инспектору
            </button>
          ) : (
            <div className="animate-scale-in space-y-3">
              <div className="w-full py-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-sm font-bold text-emerald-400 tracking-wide flex items-center justify-center gap-2">
                <Icon name="CheckCircle2" size={18} />
                Документ предъявлен
              </div>
              <div className="text-center text-xs text-muted-foreground">
                {new Date().toLocaleString('ru', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </div>
              <button
                onClick={() => setPresented(false)}
                className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Сбросить
              </button>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
            Инспектор ГИБДД считывает QR-код и получает доступ к ЭТрН в ГИС ЭПД в соответствии с ФЗ-259
          </p>
        </div>
      </div>

      {/* Hint card below */}
      <div className="mt-4 flex items-start gap-2.5 px-1">
        <Icon name="Info" size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Бумажная ТТН не нужна. При проверке достаточно этого экрана или QR-кода — инспектор проверяет документ через приложение МВД, подключённое к ГИС ЭПД.
        </p>
      </div>
    </div>
  );
}
