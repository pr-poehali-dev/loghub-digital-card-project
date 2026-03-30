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

export type DocumentKind =
  | 'forwarder-order'
  | 'forwarder-receipt'
  | 'warehouse-receipt'
  | 'ezz'
  | 'etrn'
  | 'epl'
  | 'ezn';

export interface DocumentKindConfig {
  id: DocumentKind;
  shortCode: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  requiredRoles: Role[];
  fields: DocumentField[];
  legalBasis: string;
}

export interface DocumentField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select' | 'textarea' | 'inn';
  placeholder?: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
  group?: string;
}

export const DOCUMENT_KINDS: DocumentKindConfig[] = [
  {
    id: 'forwarder-order',
    shortCode: 'ПЭ',
    title: 'Поручение экспедитору',
    description: 'Задание клиента экспедитору на организацию перевозки груза',
    icon: 'ClipboardList',
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/30',
    requiredRoles: ['sender', 'forwarder'],
    legalBasis: '№87-ФЗ «О транспортно-экспедиционной деятельности»',
    fields: [
      { key: 'number', label: 'Номер документа', type: 'text', placeholder: 'ПЭ-2026-0001', required: true, group: 'Реквизиты' },
      { key: 'date', label: 'Дата составления', type: 'date', required: true, group: 'Реквизиты' },
      { key: 'senderName', label: 'Клиент (грузоотправитель)', type: 'text', placeholder: 'ООО «АгроПром»', required: true, defaultValue: 'ООО «АгроПром»', group: 'Стороны' },
      { key: 'senderInn', label: 'ИНН клиента', type: 'inn', placeholder: '7701234567', required: true, defaultValue: '7701234567', group: 'Стороны' },
      { key: 'forwarderName', label: 'Экспедитор', type: 'text', placeholder: 'ТЭК «Магистраль»', required: true, defaultValue: 'ТЭК «Магистраль»', group: 'Стороны' },
      { key: 'forwarderInn', label: 'ИНН экспедитора', type: 'inn', placeholder: '7812345678', required: true, defaultValue: '7812345678', group: 'Стороны' },
      { key: 'cargo', label: 'Наименование груза', type: 'text', placeholder: 'Пшеница продовольственная', required: true, defaultValue: 'Пшеница продовольственная 3 кл.', group: 'Груз' },
      { key: 'weight', label: 'Масса груза, кг', type: 'number', placeholder: '22000', required: true, defaultValue: '22000', group: 'Груз' },
      { key: 'volume', label: 'Объём, м³', type: 'number', placeholder: '32', required: false, defaultValue: '32', group: 'Груз' },
      { key: 'loadAddress', label: 'Адрес погрузки', type: 'textarea', placeholder: 'г. Москва, ул. Промышленная, 14', required: true, defaultValue: 'Москва, ул. Промышленная, 14 (склад АгроПром)', group: 'Маршрут' },
      { key: 'unloadAddress', label: 'Адрес разгрузки', type: 'textarea', placeholder: 'г. Новосибирск, ул. Складская, 8', required: true, defaultValue: 'Новосибирск, ул. Складская, 8 (РЦ РитейлГрупп)', group: 'Маршрут' },
      { key: 'loadDate', label: 'Дата погрузки', type: 'date', required: true, defaultValue: '2026-03-25', group: 'Маршрут' },
      { key: 'serviceType', label: 'Вид услуг экспедитора', type: 'select', required: true, options: ['Организация перевозки', 'Доставка «от двери до двери»', 'Складирование и доставка', 'Таможенное оформление'], defaultValue: 'Организация перевозки', group: 'Условия' },
      { key: 'notes', label: 'Особые условия', type: 'textarea', placeholder: 'Хранение: сухо, без прямых солнечных лучей', required: false, defaultValue: 'Хранение: сухо, без прямых солнечных лучей', group: 'Условия' },
    ],
  },
  {
    id: 'forwarder-receipt',
    shortCode: 'ЭР',
    title: 'Экспедиторская расписка',
    description: 'Подтверждение принятия груза экспедитором от клиента',
    icon: 'ReceiptText',
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/30',
    requiredRoles: ['forwarder'],
    legalBasis: '№87-ФЗ, Приказ Минтранса №23',
    fields: [
      { key: 'number', label: 'Номер расписки', type: 'text', placeholder: 'ЭР-2026-0001', required: true, group: 'Реквизиты' },
      { key: 'date', label: 'Дата выдачи', type: 'date', required: true, group: 'Реквизиты' },
      { key: 'forwarderName', label: 'Экспедитор', type: 'text', required: true, defaultValue: 'ТЭК «Магистраль»', group: 'Стороны' },
      { key: 'clientName', label: 'Клиент', type: 'text', required: true, defaultValue: 'ООО «АгроПром»', group: 'Стороны' },
      { key: 'cargoName', label: 'Наименование груза', type: 'text', required: true, defaultValue: 'Пшеница продовольственная 3 кл.', group: 'Груз' },
      { key: 'cargoWeight', label: 'Масса, кг', type: 'number', required: true, defaultValue: '22000', group: 'Груз' },
      { key: 'cargoPlaces', label: 'Количество мест', type: 'number', placeholder: '1', required: false, group: 'Груз' },
      { key: 'packagingType', label: 'Вид упаковки', type: 'select', required: false, options: ['Навалом', 'Биг-бэги', 'Паллеты', 'Ящики', 'Мешки'], defaultValue: 'Биг-бэги', group: 'Груз' },
      { key: 'cargoCondition', label: 'Состояние груза при приёмке', type: 'select', required: true, options: ['Без замечаний', 'С замечаниями (см. акт)', 'Повреждения упаковки'], defaultValue: 'Без замечаний', group: 'Груз' },
      { key: 'receiptAddress', label: 'Место приёма груза', type: 'textarea', required: true, defaultValue: 'Москва, ул. Промышленная, 14', group: 'Место' },
      { key: 'notes', label: 'Примечания', type: 'textarea', required: false, group: 'Место' },
    ],
  },
  {
    id: 'warehouse-receipt',
    shortCode: 'СкР',
    title: 'Складская расписка',
    description: 'Документ складского хранения груза, подтверждение ответственного хранения',
    icon: 'Warehouse',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    requiredRoles: ['forwarder', 'sender'],
    legalBasis: 'ГК РФ ст. 912–917',
    fields: [
      { key: 'number', label: 'Номер расписки', type: 'text', placeholder: 'СкР-2026-0001', required: true, group: 'Реквизиты' },
      { key: 'date', label: 'Дата составления', type: 'date', required: true, group: 'Реквизиты' },
      { key: 'warehouseName', label: 'Наименование склада', type: 'text', placeholder: 'ООО «СклАгро»', required: true, defaultValue: 'ООО «СклАгро»', group: 'Стороны' },
      { key: 'warehouseInn', label: 'ИНН склада', type: 'inn', required: true, defaultValue: '7799887766', group: 'Стороны' },
      { key: 'ownerName', label: 'Поклажедатель', type: 'text', required: true, defaultValue: 'ООО «АгроПром»', group: 'Стороны' },
      { key: 'cargoName', label: 'Наименование груза', type: 'text', required: true, defaultValue: 'Пшеница продовольственная 3 кл.', group: 'Груз' },
      { key: 'cargoWeight', label: 'Масса, кг', type: 'number', required: true, defaultValue: '22000', group: 'Груз' },
      { key: 'storageCell', label: 'Ячейка / секция хранения', type: 'text', placeholder: 'С-12, секция 3', required: false, group: 'Груз' },
      { key: 'storageFrom', label: 'Начало хранения', type: 'date', required: true, group: 'Условия' },
      { key: 'storageTo', label: 'Плановое окончание', type: 'date', required: false, group: 'Условия' },
      { key: 'storageConditions', label: 'Условия хранения', type: 'select', required: true, options: ['Обычные (0–20°C)', 'Охлаждаемые (0–5°C)', 'Замороженные (−18°C)', 'Специальные'], defaultValue: 'Обычные (0–20°C)', group: 'Условия' },
      { key: 'insurance', label: 'Страховая стоимость, руб.', type: 'number', placeholder: '500000', required: false, group: 'Условия' },
    ],
  },
  {
    id: 'ezz',
    shortCode: 'ЭЗЗ',
    title: 'Электронная заявка на перевозку',
    description: 'Электронная заявка заказа (ЭЗЗ) — первичный документ для организации перевозки',
    icon: 'FilePlus2',
    color: 'text-electric',
    bgColor: 'bg-electric/10',
    borderColor: 'border-electric/30',
    requiredRoles: ['sender', 'forwarder'],
    legalBasis: 'Приказ Минтранса №7 от 14.01.2021',
    fields: [
      { key: 'number', label: 'Номер заявки', type: 'text', placeholder: 'ЭЗЗ-2026-0001', required: true, group: 'Реквизиты' },
      { key: 'date', label: 'Дата подачи', type: 'date', required: true, group: 'Реквизиты' },
      { key: 'senderName', label: 'Грузоотправитель', type: 'text', required: true, defaultValue: 'ООО «АгроПром»', group: 'Стороны' },
      { key: 'senderInn', label: 'ИНН отправителя', type: 'inn', required: true, defaultValue: '7701234567', group: 'Стороны' },
      { key: 'receiverName', label: 'Грузополучатель', type: 'text', required: true, defaultValue: 'ЗАО «РитейлГрупп»', group: 'Стороны' },
      { key: 'receiverInn', label: 'ИНН получателя', type: 'inn', required: true, defaultValue: '5401234567', group: 'Стороны' },
      { key: 'cargoName', label: 'Наименование груза', type: 'text', required: true, defaultValue: 'Пшеница продовольственная 3 кл.', group: 'Груз' },
      { key: 'cargoWeight', label: 'Масса, кг', type: 'number', required: true, defaultValue: '22000', group: 'Груз' },
      { key: 'cargoVolume', label: 'Объём, м³', type: 'number', required: false, defaultValue: '32', group: 'Груз' },
      { key: 'vehicleType', label: 'Тип транспорта', type: 'select', required: true, options: ['Автомобиль тентованный', 'Рефрижератор', 'Открытая платформа', 'Контейнер 20ft', 'Контейнер 40ft', 'Цистерна', 'Зерновоз'], defaultValue: 'Зерновоз', group: 'Транспорт' },
      { key: 'loadAddress', label: 'Адрес погрузки', type: 'textarea', required: true, defaultValue: 'Москва, ул. Промышленная, 14 (склад АгроПром)', group: 'Маршрут' },
      { key: 'unloadAddress', label: 'Адрес разгрузки', type: 'textarea', required: true, defaultValue: 'Новосибирск, ул. Складская, 8 (РЦ РитейлГрупп)', group: 'Маршрут' },
      { key: 'loadDate', label: 'Дата погрузки', type: 'date', required: true, defaultValue: '2026-03-25', group: 'Маршрут' },
      { key: 'deliveryDate', label: 'Желаемая дата доставки', type: 'date', required: false, group: 'Маршрут' },
      { key: 'price', label: 'Стоимость перевозки, руб.', type: 'number', placeholder: '150000', required: false, group: 'Финансы' },
      { key: 'paymentTerms', label: 'Условия оплаты', type: 'select', required: false, options: ['Предоплата 100%', 'Постоплата 30 дней', 'Предоплата 50% + постоплата', 'По факту доставки'], group: 'Финансы' },
    ],
  },
  {
    id: 'etrn',
    shortCode: 'ЭТрН',
    title: 'Электронная транспортная накладная',
    description: 'ЭТрН — основной перевозочный документ. Заменяет бумажную ТТН',
    icon: 'FileText',
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
    borderColor: 'border-sky-400/30',
    requiredRoles: ['sender', 'forwarder', 'carrier', 'receiver'],
    legalBasis: 'УАТиГНАЭТ ст.8, Постановление Правительства №2200',
    fields: [
      { key: 'number', label: 'Номер ЭТрН', type: 'text', placeholder: 'ЭТрН-2026-0001', required: true, group: 'Реквизиты' },
      { key: 'date', label: 'Дата составления', type: 'date', required: true, group: 'Реквизиты' },
      { key: 'senderName', label: 'Грузоотправитель', type: 'text', required: true, defaultValue: 'ООО «АгроПром»', group: 'Стороны' },
      { key: 'senderInn', label: 'ИНН отправителя', type: 'inn', required: true, defaultValue: '7701234567', group: 'Стороны' },
      { key: 'carrierName', label: 'Перевозчик', type: 'text', required: true, defaultValue: 'ИП Васильев Д.П.', group: 'Стороны' },
      { key: 'carrierInn', label: 'ИНН перевозчика', type: 'inn', required: true, defaultValue: '501234567890', group: 'Стороны' },
      { key: 'receiverName', label: 'Грузополучатель', type: 'text', required: true, defaultValue: 'ЗАО «РитейлГрупп»', group: 'Стороны' },
      { key: 'receiverInn', label: 'ИНН получателя', type: 'inn', required: true, defaultValue: '5401234567', group: 'Стороны' },
      { key: 'cargoName', label: 'Наименование груза', type: 'text', required: true, defaultValue: 'Пшеница продовольственная 3 кл.', group: 'Груз' },
      { key: 'cargoWeight', label: 'Масса брутто, кг', type: 'number', required: true, defaultValue: '22000', group: 'Груз' },
      { key: 'cargoVolume', label: 'Объём, м³', type: 'number', required: false, defaultValue: '32', group: 'Груз' },
      { key: 'cargoPlaces', label: 'Кол-во мест', type: 'number', placeholder: '1', required: false, group: 'Груз' },
      { key: 'cargoValue', label: 'Объявленная ценность, руб.', type: 'number', placeholder: '2200000', required: false, group: 'Груз' },
      { key: 'vehicleRegNum', label: 'Гос. номер ТС', type: 'text', required: true, defaultValue: 'Т456МН77', group: 'Транспорт' },
      { key: 'vehicleModel', label: 'Марка / модель ТС', type: 'text', required: true, defaultValue: 'Scania R450', group: 'Транспорт' },
      { key: 'driverName', label: 'ФИО водителя', type: 'text', required: true, defaultValue: 'Соколов Игорь Николаевич', group: 'Транспорт' },
      { key: 'loadAddress', label: 'Адрес погрузки', type: 'textarea', required: true, defaultValue: 'Москва, ул. Промышленная, 14 (склад АгроПром)', group: 'Маршрут' },
      { key: 'unloadAddress', label: 'Адрес разгрузки', type: 'textarea', required: true, defaultValue: 'Новосибирск, ул. Складская, 8 (РЦ РитейлГрупп)', group: 'Маршрут' },
      { key: 'loadDate', label: 'Дата погрузки', type: 'date', required: true, defaultValue: '2026-03-25', group: 'Маршрут' },
      { key: 'notes', label: 'Особые условия перевозки', type: 'textarea', required: false, defaultValue: 'Хранение: сухо, без прямых солнечных лучей', group: 'Прочее' },
    ],
  },
  {
    id: 'epl',
    shortCode: 'ЭПЛ',
    title: 'Электронный путевой лист',
    description: 'ЭПЛ — допуск водителя и ТС к рейсу. Заменяет бумажный путевой лист',
    icon: 'Route',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    requiredRoles: ['carrier'],
    legalBasis: 'Приказ Минтранса №390 от 28.09.2022',
    fields: [
      { key: 'number', label: 'Номер ЭПЛ', type: 'text', placeholder: 'ЭПЛ-2026-0001', required: true, group: 'Реквизиты' },
      { key: 'dateFrom', label: 'Дата выезда', type: 'date', required: true, defaultValue: '2026-03-25', group: 'Реквизиты' },
      { key: 'dateTo', label: 'Дата возврата (план)', type: 'date', required: false, group: 'Реквизиты' },
      { key: 'carrierName', label: 'Организация-перевозчик', type: 'text', required: true, defaultValue: 'ИП Васильев Д.П.', group: 'Перевозчик' },
      { key: 'carrierInn', label: 'ИНН перевозчика', type: 'inn', required: true, defaultValue: '501234567890', group: 'Перевозчик' },
      { key: 'driverName', label: 'ФИО водителя', type: 'text', required: true, defaultValue: 'Соколов Игорь Николаевич', group: 'Водитель' },
      { key: 'driverLicense', label: 'Серия и номер ВУ', type: 'text', placeholder: '77 АА 123456', required: true, group: 'Водитель' },
      { key: 'medicalCheck', label: 'Предрейсовый медосмотр', type: 'select', required: true, options: ['Пройден', 'Не требуется (условие договора)'], defaultValue: 'Пройден', group: 'Водитель' },
      { key: 'vehicleRegNum', label: 'Гос. номер ТС', type: 'text', required: true, defaultValue: 'Т456МН77', group: 'Транспорт' },
      { key: 'vehicleModel', label: 'Марка / модель ТС', type: 'text', required: true, defaultValue: 'Scania R450', group: 'Транспорт' },
      { key: 'vehicleVin', label: 'VIN', type: 'text', placeholder: 'XLR4X20B4HE123456', required: false, group: 'Транспорт' },
      { key: 'techCheck', label: 'Предрейсовый техосмотр', type: 'select', required: true, options: ['Пройден', 'Не требуется'], defaultValue: 'Пройден', group: 'Транспорт' },
      { key: 'odometerStart', label: 'Показания одометра (выезд), км', type: 'number', placeholder: '245000', required: true, group: 'Пробег' },
      { key: 'fuelStart', label: 'Топливо при выезде, л', type: 'number', placeholder: '400', required: false, group: 'Пробег' },
      { key: 'route', label: 'Маршрут следования', type: 'textarea', required: true, defaultValue: 'Москва → Нижний Новгород → Казань → Самара → Уфа → Челябинск → Новосибирск', group: 'Пробег' },
    ],
  },
  {
    id: 'ezn',
    shortCode: 'ЭЗН',
    title: 'Электронный заказ-наряд',
    description: 'ЭЗН — договор фрахтования ТС для разовой перевозки',
    icon: 'FileSignature',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/30',
    requiredRoles: ['sender', 'carrier'],
    legalBasis: 'УАТиГНАЭТ ст.18, Постановление Правительства №272',
    fields: [
      { key: 'number', label: 'Номер ЭЗН', type: 'text', placeholder: 'ЭЗН-2026-0001', required: true, group: 'Реквизиты' },
      { key: 'date', label: 'Дата составления', type: 'date', required: true, group: 'Реквизиты' },
      { key: 'frachterName', label: 'Фрахтователь', type: 'text', required: true, defaultValue: 'ООО «АгроПром»', group: 'Стороны' },
      { key: 'frachterInn', label: 'ИНН фрахтователя', type: 'inn', required: true, defaultValue: '7701234567', group: 'Стороны' },
      { key: 'carrierName', label: 'Фрахтовщик (перевозчик)', type: 'text', required: true, defaultValue: 'ИП Васильев Д.П.', group: 'Стороны' },
      { key: 'carrierInn', label: 'ИНН перевозчика', type: 'inn', required: true, defaultValue: '501234567890', group: 'Стороны' },
      { key: 'vehicleRegNum', label: 'Гос. номер ТС', type: 'text', required: true, defaultValue: 'Т456МН77', group: 'Транспорт' },
      { key: 'vehicleModel', label: 'Марка / модель ТС', type: 'text', required: true, defaultValue: 'Scania R450', group: 'Транспорт' },
      { key: 'loadCapacity', label: 'Грузоподъёмность, т', type: 'number', placeholder: '25', required: true, group: 'Транспорт' },
      { key: 'cargoName', label: 'Наименование груза', type: 'text', required: true, defaultValue: 'Пшеница продовольственная 3 кл.', group: 'Груз' },
      { key: 'cargoWeight', label: 'Масса, кг', type: 'number', required: true, defaultValue: '22000', group: 'Груз' },
      { key: 'loadAddress', label: 'Место погрузки', type: 'textarea', required: true, defaultValue: 'Москва, ул. Промышленная, 14 (склад АгроПром)', group: 'Маршрут' },
      { key: 'unloadAddress', label: 'Место разгрузки', type: 'textarea', required: true, defaultValue: 'Новосибирск, ул. Складская, 8 (РЦ РитейлГрупп)', group: 'Маршрут' },
      { key: 'loadDate', label: 'Дата подачи ТС', type: 'date', required: true, defaultValue: '2026-03-25', group: 'Маршрут' },
      { key: 'freightAmount', label: 'Сумма фрахта, руб.', type: 'number', placeholder: '150000', required: true, group: 'Финансы' },
      { key: 'paymentTerms', label: 'Порядок оплаты', type: 'select', required: true, options: ['Предоплата 100%', 'Постоплата 30 дней', 'Предоплата 50% + постоплата', 'По факту доставки'], defaultValue: 'Постоплата 30 дней', group: 'Финансы' },
    ],
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