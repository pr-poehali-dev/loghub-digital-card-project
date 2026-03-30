import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function Settings() {
  const [tab, setTab] = useState<'erp' | 'epd' | 'notifications'>('erp');
  const [connected, setConnected] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Настройки подключения</h2>
        <p className="text-sm text-muted-foreground mt-1">Интеграция с учётными системами и ГИС ЭПД</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {[
          { id: 'erp', label: '1С / ERP', icon: 'Database' },
          { id: 'epd', label: 'ГИС ЭПД', icon: 'Globe' },
          { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-electric text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={t.icon} fallback="Circle" size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* 1С / ERP Tab */}
      {tab === 'erp' && (
        <div className="space-y-4 animate-fade-in">
          {/* Status card */}
          <div className={`glass-card rounded-xl p-5 border ${connected ? 'border-emerald-400/30' : 'border-amber-400/25'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${connected ? 'bg-emerald-400/15' : 'bg-amber-400/15'}`}>
                  <Icon name="Database" size={18} className={connected ? 'text-emerald-400' : 'text-amber-400'} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">1С:Предприятие / ERP</div>
                  <div className={`text-xs font-mono mt-0.5 ${connected ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {connected ? '● Подключено' : '○ Не подключено'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setConnected(!connected)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  connected
                    ? 'glass text-muted-foreground hover:text-rose-400'
                    : 'bg-electric text-background hover:opacity-90'
                }`}
              >
                {connected ? 'Отключить' : 'Подключить'}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card rounded-xl p-5">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">Параметры коннектора</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Адрес сервера 1С', placeholder: 'http://1c-server:8080/base', type: 'url' },
                { label: 'Название базы данных', placeholder: 'TradeManagement', type: 'text' },
                { label: 'Пользователь', placeholder: 'loghub_integration', type: 'text' },
                { label: 'Пароль', placeholder: '••••••••••••', type: 'password' },
              ].map((field, i) => (
                <div key={i}>
                  <label className="text-xs text-muted-foreground mb-1.5 block">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/20 transition-all font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Icon name="Info" size={12} />
                Настройка занимает 1-2 дня. Документация в разделе помощи.
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 glass rounded-lg text-sm hover:border-border transition-all text-muted-foreground">
                  Тест соединения
                </button>
                <button className="px-4 py-2 bg-electric text-background rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  Сохранить
                </button>
              </div>
            </div>
          </div>

          {/* Data mapping */}
          <div className="glass-card rounded-xl p-5">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">Маппинг данных</div>
            <div className="space-y-2">
              {[
                { field: 'Грузоотправитель', mapping: 'Организация.ИНН → Sender.INN', ok: true },
                { field: 'Данные груза', mapping: 'Заказ.Номенклатура → Cargo.Name', ok: true },
                { field: 'Адрес доставки', mapping: 'Заказ.АдресДоставки → Route.To', ok: true },
                { field: 'Сумма перевозки', mapping: 'Не настроено', ok: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <Icon
                    name={item.ok ? 'CheckCircle2' : 'AlertCircle'}
                    fallback="Circle"
                    size={14}
                    className={item.ok ? 'text-emerald-400' : 'text-amber-400'}
                  />
                  <div className="flex-1">
                    <span className="text-xs font-medium text-foreground">{item.field}</span>
                    <span className="text-xs text-muted-foreground ml-3 font-mono">{item.mapping}</span>
                  </div>
                  {!item.ok && (
                    <button className="text-xs text-electric hover:underline">Настроить</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GIS EPD Tab */}
      {tab === 'epd' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card rounded-xl p-5 border border-emerald-400/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 flex items-center justify-center">
                <Icon name="Globe" size={18} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">ГИС ЭПД (Минтранс)</div>
                <div className="text-xs text-emerald-400 font-mono">● Подключено · API v2.1</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Отправлено ЭПД', value: '12', color: 'text-electric' },
                { label: 'Принято ГИС', value: '11', color: 'text-emerald-400' },
                { label: 'Ошибок', value: '1', color: 'text-rose-400' },
              ].map((s, i) => (
                <div key={i} className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">КЭП и операторы ЭДО</div>
            <div className="space-y-3">
              {[
                { name: 'КЭП организации', status: 'Действительна до 12.2026', ok: true },
                { name: 'СБИС (оператор ЭДО)', status: 'Подключён', ok: true },
                { name: 'Диадок', status: 'Не настроен', ok: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-2">
                    <Icon name={item.ok ? 'ShieldCheck' : 'Shield'} fallback="Circle" size={14} className={item.ok ? 'text-emerald-400' : 'text-muted-foreground'} />
                    <div>
                      <div className="text-xs font-medium text-foreground">{item.name}</div>
                      <div className={`text-xs font-mono ${item.ok ? 'text-emerald-400' : 'text-muted-foreground'}`}>{item.status}</div>
                    </div>
                  </div>
                  {!item.ok && (
                    <button className="px-3 py-1.5 bg-electric/10 text-electric border border-electric/30 rounded-lg text-xs hover:bg-electric/20 transition-all">
                      Подключить
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card rounded-xl p-5">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">Каналы уведомлений</div>
            <div className="space-y-3">
              {[
                { icon: 'Mail', label: 'Email', value: 'morozov@agroprom.ru', on: true },
                { icon: 'MessageSquare', label: 'Telegram', value: '@loghub_bot', on: true },
                { icon: 'Smartphone', label: 'SMS', value: '+7 495 123-45-67', on: false },
              ].map((ch, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon name={ch.icon} fallback="Circle" size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-foreground">{ch.label}</div>
                    <div className="text-xs text-muted-foreground font-mono">{ch.value}</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full cursor-pointer transition-all ${ch.on ? 'bg-electric' : 'bg-secondary border border-border'} relative`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${ch.on ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">События для уведомлений</div>
            <div className="space-y-2">
              {[
                'Смена статуса перевозки',
                'Требуется подпись документа',
                'Изменение данных перевозки',
                'Предупреждение об ошибке ГИС ЭПД',
                'Прибытие водителя на точку',
              ].map((event, i) => (
                <label key={i} className="flex items-center gap-3 py-2 cursor-pointer hover:text-foreground transition-colors">
                  <div className="w-4 h-4 rounded bg-electric/20 border border-electric/40 flex items-center justify-center">
                    <Icon name="Check" size={10} className="text-electric" />
                  </div>
                  <span className="text-xs text-foreground">{event}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
