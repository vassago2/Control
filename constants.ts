
import { Language, TranslationDictionary, UserRole, User, JournalEntry, BankTransaction, ClientVendor } from './types';

export const TRANSLATIONS: TranslationDictionary = {
  dashboard: { es: 'Tablero', de: 'Armaturenbrett' },
  accounting: { es: 'Contabilidad', de: 'Buchhaltung' },
  reconciliation: { es: 'Conciliación', de: 'Abstimmung' },
  users: { es: 'Usuarios', de: 'Benutzer' },
  settings: { es: 'Configuración', de: 'Einstellungen' },
  login_title: { es: 'Acceso Corporativo', de: 'Firmenzugang' },
  username: { es: 'Usuario', de: 'Benutzername' },
  password: { es: 'Contraseña', de: 'Passwort' },
  login_btn: { es: 'Iniciar Sesión', de: 'Anmelden' },
  logout: { es: 'Cerrar Sesión', de: 'Abmelden' },
  revenue: { es: 'Ingresos', de: 'Einnahmen' },
  expenses: { es: 'Gastos', de: 'Ausgaben' },
  net_profit: { es: 'Beneficio Neto', de: 'Reingewinn' },
  pending_reconciliations: { es: 'Conciliaciones Pendientes', de: 'Ausstehende Abstimmungen' },
  journal_entries: { es: 'Asientos Contables', de: 'Buchungssätze' },
  debit: { es: 'Debe', de: 'Soll' },
  credit: { es: 'Haber', de: 'Haben' },
  account: { es: 'Cuenta', de: 'Konto' },
  description: { es: 'Descripción', de: 'Beschreibung' },
  date: { es: 'Fecha', de: 'Datum' },
  bank_feed: { es: 'Extracto Bancario', de: 'Bankauszug' },
  ledger: { es: 'Libro Mayor', de: 'Hauptbuch' },
  match: { es: 'Conciliar', de: 'Abstimmen' },
  admin_panel: { es: 'Panel de Administración', de: 'Admin-Bereich' },
  role: { es: 'Rol', de: 'Rolle' },
  clean_slate: { es: 'Borrón y Cuenta Nueva', de: 'Reiner Tisch' },
  clean_slate_desc: { es: 'Esta acción archivará el ejercicio actual y reseteará los saldos.', de: 'Diese Aktion archiviert das aktuelle Jahr und setzt die Salden zurück.' },
  execute_wipe: { es: 'Ejecutar Borrado', de: 'Löschen Ausführen' },
  welcome: { es: 'Bienvenido', de: 'Willkommen' },
  permission_denied: { es: 'Acceso Denegado', de: 'Zugriff verweigert' },
  status: { es: 'Estado', de: 'Status' },
  clients_vendors: { es: 'Clientes y Proveedores', de: 'Kunden & Lieferanten' },
  clients: { es: 'Clientes', de: 'Kunden' },
  vendors: { es: 'Proveedores', de: 'Lieferanten' },
  balance_due: { es: 'Saldo Pendiente', de: 'Offener Saldo' },
  payment_terms: { es: 'Condiciones Pago', de: 'Zahlungsbedingungen' },
  vat_number: { es: 'NIF/CIF', de: 'USt-IdNr.' },
  access_denied_msg: { es: 'No tienes permisos suficientes para acceder a este recurso. Contacta con el administrador.', de: 'Sie haben nicht genügend Berechtigungen, um auf diese Ressource zuzugreifen. Wenden Sie sich an den Administrator.' },
  go_back: { es: 'Volver al Inicio', de: 'Zurück nach Hause' },
  create_user: { es: 'Crear Usuario', de: 'Benutzer erstellen' },
  permissions: { es: 'Permisos', de: 'Berechtigungen' },
  save: { es: 'Guardar', de: 'Speichern' },
  cancel: { es: 'Cancelar', de: 'Abbrechen' },
  name: { es: 'Nombre', de: 'Name' },
  email: { es: 'Correo Electrónico', de: 'E-Mail' },
  currency: { es: 'Divisa', de: 'Währung' },
  add_client: { es: 'Añadir Cliente', de: 'Kunde hinzufügen' },
  add_vendor: { es: 'Añadir Proveedor', de: 'Lieferant hinzufügen' },
  edit: { es: 'Editar', de: 'Bearbeiten' },
  delete: { es: 'Eliminar', de: 'Löschen' },
  confirm_delete: { es: '¿Estás seguro?', de: 'Sind Sie sicher?' },
  actions: { es: 'Acciones', de: 'Aktionen' },
  new_entry: { es: 'Nuevo Asiento', de: 'Neuer Eintrag' },
  add_line: { es: 'Añadir Línea', de: 'Zeile hinzufügen' },
  post_entry: { es: 'Contabilizar', de: 'Buchen' },
  total_debit: { es: 'Total Debe', de: 'Summe Soll' },
  total_credit: { es: 'Total Haber', de: 'Summe Haben' },
  imbalance: { es: 'Descuadre', de: 'Differenz' },
  must_balance: { es: 'El asiento debe estar cuadrado', de: 'Die Buchung muss ausgeglichen sein' },
  finance: { es: 'Finanzas', de: 'Finanzen' },
  avatar_url: { es: 'URL del Avatar', de: 'Avatar URL' },
  initial_password: { es: 'Contraseña Inicial', de: 'Startpasswort' },
  error_403: { es: '403 - Prohibido', de: '403 - Verboten' },
  invoices: { es: 'Facturas', de: 'Rechnungen' },
  payment_history: { es: 'Historial de Pagos', de: 'Zahlungshistorie' },
  create_invoice: { es: 'Crear Factura', de: 'Rechnung erstellen' },
  amount: { es: 'Importe', de: 'Betrag' },
  due_date: { es: 'Fecha Vencimiento', de: 'Fälligkeitsdatum' },
  pay: { es: 'Pagar', de: 'Bezahlen' },
  details: { es: 'Detalles', de: 'Einzelheiten' },
  method: { es: 'Método', de: 'Methode' },
  record_payment: { es: 'Registrar Pago', de: 'Zahlung erfassen' },
};

export const AVAILABLE_PERMISSIONS = [
  { id: 'dashboard:read', label: 'Ver Dashboard' },
  { id: 'accounting:read', label: 'Ver Contabilidad' },
  { id: 'accounting:write', label: 'Editar Contabilidad' },
  { id: 'crm:read', label: 'Ver Clientes/Prov.' },
  { id: 'crm:write', label: 'Editar Clientes/Prov.' },
  { id: 'users:read', label: 'Ver Usuarios' },
  { id: 'users:write', label: 'Crear/Editar Usuarios' },
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Tony',
    username: 'Tony',
    role: UserRole.ADMIN,
    permissions: ['*'], // Wildcard for admin
    avatar: 'https://picsum.photos/200'
  },
  {
    id: '2',
    name: 'Hans Müller',
    username: 'hans',
    role: UserRole.MANAGER,
    permissions: ['dashboard:read', 'accounting:read', 'accounting:write', 'crm:read', 'crm:write'],
    avatar: 'https://picsum.photos/201'
  },
  {
    id: '3',
    name: 'Ana Garcia',
    username: 'ana',
    role: UserRole.OFFICE,
    permissions: ['dashboard:read', 'crm:read'],
    avatar: 'https://picsum.photos/202'
  }
];

export const MOCK_JOURNAL: JournalEntry[] = [
  { id: 'J001', date: '2023-10-01', description: 'Factura Cliente #1023', account: '4300 Clientes', debit: 1200.50, credit: 0, status: 'posted' },
  { id: 'J002', date: '2023-10-01', description: 'Factura Cliente #1023 (IVA)', account: '4770 HP IVA Repercutido', debit: 0, credit: 208.35, status: 'posted' },
  { id: 'J003', date: '2023-10-01', description: 'Factura Cliente #1023 (Base)', account: '7000 Ventas', debit: 0, credit: 992.15, status: 'posted' },
  { id: 'J004', date: '2023-10-02', description: 'Compra Material Oficina', account: '6000 Compras', debit: 150.00, credit: 0, status: 'posted' },
  { id: 'J005', date: '2023-10-02', description: 'Pago Proveedor', account: '5720 Banco', debit: 0, credit: 150.00, status: 'posted' },
];

export const MOCK_BANK_TX: BankTransaction[] = [
  { id: 'B001', date: '2023-10-01', description: 'TRANSFERENCIA RECIBIDA CLIENTE 1023', amount: 1200.50, matched: false },
  { id: 'B002', date: '2023-10-02', description: 'CARGO VISA COMPRA MATERIAL', amount: -150.00, matched: true },
  { id: 'B003', date: '2023-10-03', description: 'COMISION MANTENIMIENTO', amount: -12.00, matched: false },
  { id: 'B004', date: '2023-10-04', description: 'NOMINA EMPLEADO 1', amount: -2400.00, matched: false },
];

export const MOCK_CLIENTS_VENDORS: ClientVendor[] = [
  {
    id: 'C001',
    type: 'client',
    name: 'TechSolutions S.L.',
    email: 'billing@techsolutions.com',
    vatNumber: 'B12345678',
    balance: 2500.00,
    currency: 'EUR',
    paymentTerms: 'Net 30',
    outstandingInvoices: [
      { id: 'INV-2023-001', amount: 1500.00, dueDate: '2023-11-15', status: 'pending' },
      { id: 'INV-2023-005', amount: 1000.00, dueDate: '2023-10-30', status: 'overdue' }
    ],
    paymentHistory: [
      { id: 'PAY-001', date: '2023-09-15', amount: 500.00, method: 'Bank Transfer', reference: 'INV-2023-001-PARTIAL' }
    ]
  },
  {
    id: 'C002',
    type: 'client',
    name: 'GastroBar Berlin',
    email: 'info@gastrobar.de',
    vatNumber: 'DE987654321',
    balance: 0.00,
    currency: 'EUR',
    paymentTerms: 'Net 15',
    outstandingInvoices: [],
    paymentHistory: []
  },
  {
    id: 'V001',
    type: 'vendor',
    name: 'Oficina Total S.A.',
    email: 'ventas@oficinatotal.es',
    vatNumber: 'A87654321',
    balance: 450.50, // We owe them
    currency: 'EUR',
    paymentTerms: 'Net 60',
    outstandingInvoices: [
      { id: 'BILL-998', amount: 450.50, dueDate: '2023-12-01', status: 'pending' }
    ],
    paymentHistory: []
  },
  {
    id: 'V002',
    type: 'vendor',
    name: 'Cloud Hosting GmbH',
    email: 'support@cloudhost.de',
    vatNumber: 'DE112233445',
    balance: 120.00,
    currency: 'EUR',
    paymentTerms: 'Immediate',
    outstandingInvoices: [
      { id: 'INV-HOST-12', amount: 120.00, dueDate: '2023-11-01', status: 'pending' }
    ],
    paymentHistory: []
  }
];
