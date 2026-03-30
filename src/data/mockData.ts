export type Role = 'sender' | 'forwarder' | 'carrier' | 'receiver';

export interface RoleConfig {
  id: Role;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const ROLES: RoleConfig[] = [
  {
    id: 'sender',
    label: 'Грузоотправитель',
    shortLabel: 'Отправитель',
    color: 'text-electric',
    bgColor: 'bg-electric/10',
    borderColor: 'border-electric/30',
    icon: 'PackageCheck',
  },
  {
    id: 'forwarder',
    label: 'Экспедитор',
    shortLabel: 'Экспедитор',
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/30',
    icon: 'ClipboardList',
  },
  {
    id: 'carrier',
    label: 'Перевозчик',
    shortLabel: 'Перевозчик',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    icon: 'Truck',
  },
  {
    id: 'receiver',
    label: 'Грузополучатель',
    shortLabel: 'Получатель',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/30',
    icon: 'PackageOpen',
  },
];

export type StageStatus = 'done' | 'active' | 'pending' | 'blocked';

export interface Stage {
  id: string;
  number: number;
  title: string;
  description: string;
  status: StageStatus;
  responsible: Role;
  completedAt?: string;
  documents: string[];
  actions?: string[];
}

export const STAGES: Stage[] = [
  {
    id: 'stage-1',
    number: 1,
    title: 'Создание заявки',
    description: 'Грузоотправитель создаёт перевозку и вносит данные о грузе и маршруте',
    status: 'done',
    responsible: 'sender',
    completedAt: '24.03.2026 09:14',
    documents: ['Заявка на перевозку', 'Счёт-фактура'],
    actions: [],
  },
  {
    id: 'stage-2',
    number: 2,
    title: 'Подтверждение экспедитора',
    description: 'Экспедитор проверяет условия, назначает перевозчика и подписывает свой титул',
    status: 'done',
    responsible: 'forwarder',
    completedAt: '24.03.2026 11:42',
    documents: ['Договор экспедирования', 'Поручение экспедитору'],
    actions: [],
  },
  {
    id: 'stage-3',
    number: 3,
    title: 'Принятие груза перевозчиком',
    description: 'Водитель прибывает на погрузку, принимает груз и подписывает ЭТрН (титул перевозчика)',
    status: 'active',
    responsible: 'carrier',
    documents: ['ЭТрН (титул перевозчика)', 'CMR / ТТН'],
    actions: ['Подписать титул перевозчика', 'Загрузить фото груза', 'Подтвердить пломбы'],
  },
  {
    id: 'stage-4',
    number: 4,
    title: 'В пути',
    description: 'Груз в движении. Отслеживание геопозиции, промежуточные статусы',
    status: 'pending',
    responsible: 'carrier',
    documents: ['Путевой лист', 'Маршрутный лист'],
    actions: ['Обновить статус местонахождения'],
  },
  {
    id: 'stage-5',
    number: 5,
    title: 'Доставка и приёмка',
    description: 'Грузополучатель принимает груз и подписывает свой титул ЭТрН',
    status: 'pending',
    responsible: 'receiver',
    documents: ['ЭТрН (титул получателя)', 'Акт приёмки'],
    actions: ['Подписать титул получателя', 'Оформить акт расхождений (если есть)'],
  },
  {
    id: 'stage-6',
    number: 6,
    title: 'Передача в ГИС ЭПД',
    description: 'Завершение перевозки. Комплект документов передаётся в ГИС ЭПД',
    status: 'pending',
    responsible: 'sender',
    documents: ['Полный ЭПД-комплект', 'Подтверждение ГИС ЭПД'],
    actions: ['Отправить в ГИС ЭПД'],
  },
];

export interface Participant {
  role: Role;
  name: string;
  company: string;
  phone: string;
  email: string;
  inn: string;
  status: 'connected' | 'invited' | 'external';
}

export const PARTICIPANTS: Participant[] = [
  {
    role: 'sender',
    name: 'Морозов Алексей Игоревич',
    company: 'ООО «АгроПром»',
    phone: '+7 495 123-45-67',
    email: 'morozov@agroprom.ru',
    inn: '7701234567',
    status: 'connected',
  },
  {
    role: 'forwarder',
    name: 'Кравцова Елена Сергеевна',
    company: 'ТЭК «Магистраль»',
    phone: '+7 812 987-65-43',
    email: 'kravtsova@magistral.ru',
    inn: '7812345678',
    status: 'connected',
  },
  {
    role: 'carrier',
    name: 'Васильев Дмитрий Павлович',
    company: 'ИП Васильев Д.П.',
    phone: '+7 916 555-22-11',
    email: 'vasiliev@mail.ru',
    inn: '501234567890',
    status: 'connected',
  },
  {
    role: 'receiver',
    name: 'Петренко Ирина Владимировна',
    company: 'ЗАО «РитейлГрупп»',
    phone: '+7 383 444-55-66',
    email: 'petrenko@retailgroup.ru',
    inn: '5401234567',
    status: 'invited',
  },
];

export interface EpdDocument {
  id: string;
  title: string;
  type: 'etrn' | 'act' | 'contract' | 'other';
  status: 'signed' | 'pending' | 'draft' | 'sent';
  stage: number;
  createdAt: string;
  signedBy: Role[];
  requiredSignatures: Role[];
}

export const EPD_DOCUMENTS: EpdDocument[] = [
  {
    id: 'doc-1',
    title: 'ЭТрН №ЛХ-2026-0347',
    type: 'etrn',
    status: 'pending',
    stage: 3,
    createdAt: '24.03.2026',
    signedBy: ['sender', 'forwarder'],
    requiredSignatures: ['sender', 'forwarder', 'carrier', 'receiver'],
  },
  {
    id: 'doc-2',
    title: 'Поручение экспедитору №ПЭ-2026-0112',
    type: 'contract',
    status: 'signed',
    stage: 2,
    createdAt: '24.03.2026',
    signedBy: ['sender', 'forwarder'],
    requiredSignatures: ['sender', 'forwarder'],
  },
  {
    id: 'doc-3',
    title: 'Акт приёмки груза',
    type: 'act',
    status: 'draft',
    stage: 5,
    createdAt: '—',
    signedBy: [],
    requiredSignatures: ['carrier', 'receiver'],
  },
];

export interface HistoryEvent {
  id: string;
  timestamp: string;
  actor: Role;
  actorName: string;
  action: string;
  details?: string;
  type: 'status' | 'document' | 'data' | 'correction';
}

export const HISTORY: HistoryEvent[] = [
  {
    id: 'h-1',
    timestamp: '24.03.2026 09:14',
    actor: 'sender',
    actorName: 'Морозов А.И.',
    action: 'Создана карточка перевозки',
    details: 'Маршрут: Москва → Новосибирск, груз: зерно пшеница 22 т',
    type: 'status',
  },
  {
    id: 'h-2',
    timestamp: '24.03.2026 10:01',
    actor: 'sender',
    actorName: 'Морозов А.И.',
    action: 'Загружены данные из 1С',
    details: 'Подгружены: ИНН контрагентов, адреса, объём груза',
    type: 'data',
  },
  {
    id: 'h-3',
    timestamp: '24.03.2026 11:42',
    actor: 'forwarder',
    actorName: 'Кравцова Е.С.',
    action: 'Подписан титул экспедитора',
    details: 'Поручение экспедитору №ПЭ-2026-0112',
    type: 'document',
  },
  {
    id: 'h-4',
    timestamp: '24.03.2026 13:15',
    actor: 'carrier',
    actorName: 'Васильев Д.П.',
    action: 'Замена транспортного средства',
    details: 'Изменено: Р123АС77 → Т456МН77 (А350). Причина: техническая неисправность',
    type: 'correction',
  },
  {
    id: 'h-5',
    timestamp: '25.03.2026 08:30',
    actor: 'carrier',
    actorName: 'Васильев Д.П.',
    action: 'Водитель прибыл на погрузку',
    details: 'Статус: ожидание загрузки',
    type: 'status',
  },
  {
    id: 'h-6',
    timestamp: '25.03.2026 10:47',
    actor: 'carrier',
    actorName: 'Васильев Д.П.',
    action: 'Погрузка завершена',
    details: 'Фактический вес: 21.8 т (по документам 22 т). Расхождение в норме',
    type: 'data',
  },
];

export const SHIPMENT = {
  id: 'ЛХ-2026-0347',
  cargo: 'Пшеница продовольственная 3 кл.',
  weight: '22 000 кг',
  volume: '32 м³',
  from: 'Москва, ул. Промышленная, 14 (склад АгроПром)',
  to: 'Новосибирск, ул. Складская, 8 (РЦ РитейлГрупп)',
  distance: '3 191 км',
  vehicle: 'Т456МН77 (Scania R450)',
  driver: 'Соколов Игорь Николаевич',
  loadDate: '25.03.2026',
  eta: '29.03.2026',
  temperature: 'не требуется',
  specialConditions: 'Хранение: сухо, без прямых солнечных лучей',
};
