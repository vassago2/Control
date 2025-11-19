import { Language, TranslationDictionary, UserRole, User, JournalEntry, BankTransaction } from './types';

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
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Tony',
    username: 'Tony',
    role: UserRole.ADMIN,
    permissions: ['all'],
    avatar: 'https://picsum.photos/200'
  },
  {
    id: '2',
    name: 'Hans Müller',
    username: 'hans',
    role: UserRole.MANAGER,
    permissions: ['read', 'write', 'approve'],
    avatar: 'https://picsum.photos/201'
  },
  {
    id: '3',
    name: 'Ana Garcia',
    username: 'ana',
    role: UserRole.OFFICE,
    permissions: ['read', 'create_entry'],
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