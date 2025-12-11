import { create } from 'zustand';

export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue" | "Draft";

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
}

export interface Invoice {
    id: string;
    companyName: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    status: InvoiceStatus;
    domain?: string;
    logoColor: string;
    // Extended fields for full invoice data
    clientId?: string;
    clientName?: string;
    issuedDate?: string;
    dueDate?: string;
    items?: InvoiceItem[];
    notes?: string;
    datePaid?: string;
}

interface InvoiceState {
    invoices: Invoice[];
    addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
    updateInvoice: (id: string, updates: Partial<Invoice>) => void;
    markAsPaid: (id: string) => void;
    deleteInvoice: (id: string) => void;
    getInvoiceById: (id: string) => Invoice | undefined;
}

// Generate unique invoice number
const generateInvoiceNumber = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `#INV-${num}`;
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial mock data
const INITIAL_INVOICES: Invoice[] = [
    {
        id: "1",
        companyName: "Acme Corp",
        invoiceNumber: "#INV-1001",
        date: "24 Oct, 2023",
        amount: 1200.0,
        status: "Paid",
        domain: "acme.com",
        logoColor: "#6EE798",
        datePaid: "25 Oct, 2023",
    },
    {
        id: "2",
        companyName: "Globex Inc.",
        invoiceNumber: "#INV-1002",
        date: "01 Nov, 2023",
        amount: 850.0,
        status: "Unpaid",
        domain: "globex.com",
        logoColor: "#FFD700",
    },
    {
        id: "3",
        companyName: "Soylent Corp",
        invoiceNumber: "#INV-1003",
        date: "15 Oct, 2023",
        amount: 2500.0,
        status: "Overdue",
        domain: "soylent.com",
        logoColor: "#FF6B6B",
    },
    {
        id: "4",
        companyName: "Initech",
        invoiceNumber: "#INV-1004",
        date: "05 Nov, 2023",
        amount: 0.0,
        status: "Draft",
        domain: "initech.com",
        logoColor: "#9CA3AF",
    },
    {
        id: "5",
        companyName: "Umbrella Corp",
        invoiceNumber: "#INV-1005",
        date: "10 Nov, 2023",
        amount: 3400.0,
        status: "Paid",
        domain: "umbrellacorp.com",
        logoColor: "#E74C3C",
        datePaid: "12 Nov, 2023",
    },
    {
        id: "6",
        companyName: "Wonka Industries",
        invoiceNumber: "#INV-1006",
        date: "18 Nov, 2023",
        amount: 1750.0,
        status: "Unpaid",
        domain: "wonka.com",
        logoColor: "#9B59B6",
    },
];

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
    invoices: INITIAL_INVOICES,

    addInvoice: (invoiceData) => {
        const newInvoice: Invoice = {
            ...invoiceData,
            id: generateId(),
            invoiceNumber: generateInvoiceNumber(),
        };
        set((state) => ({
            invoices: [...state.invoices, newInvoice],
        }));
        return newInvoice;
    },

    updateInvoice: (id, updates) => {
        set((state) => ({
            invoices: state.invoices.map((inv) =>
                inv.id === id ? { ...inv, ...updates } : inv
            ),
        }));
    },

    markAsPaid: (id) => {
        const today = new Date();
        const datePaid = today.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
        set((state) => ({
            invoices: state.invoices.map((inv) =>
                inv.id === id ? { ...inv, status: "Paid", datePaid } : inv
            ),
        }));
    },

    deleteInvoice: (id) => {
        set((state) => ({
            invoices: state.invoices.filter((inv) => inv.id !== id),
        }));
    },

    getInvoiceById: (id) => {
        return get().invoices.find((inv) => inv.id === id);
    },
}));
