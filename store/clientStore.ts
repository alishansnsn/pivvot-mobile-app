import { create } from 'zustand';

export interface Client {
    id: string;
    companyName: string; // Used in Clients list
    name: string; // Used in New Invoice dropdown (sometimes distinct, but we'll map or unify)
    email: string;
    mobile: string;
    domain?: string;
    logoColor?: string;
    totalBilled?: number;
    activeInvoices?: number;
}

interface ClientState {
    clients: Client[];
    addClient: (client: Client) => void;
}

// Initial mock data mapped to new interface
const INITIAL_CLIENTS: Client[] = [
    {
        id: "1",
        companyName: "Acme Corp",
        name: "Acme Corp",
        email: "contact@acme.com",
        mobile: "+1 555 0101",
        domain: "acme.com",
        logoColor: "#6EE798",
        totalBilled: 12500,
        activeInvoices: 3,
    },
    {
        id: "2",
        companyName: "Tech Startup Inc",
        name: "Tech Startup Inc",
        email: "hello@techstartup.inc",
        mobile: "+1 555 0102",
        domain: "globex.com", // Keeping similar to mock
        logoColor: "#FFD700",
        totalBilled: 8500,
        activeInvoices: 1,
    },
    {
        id: "3",
        companyName: "Design Studio",
        name: "Design Studio",
        email: "info@designstudio.co",
        mobile: "+1 555 0103",
        domain: "soylent.com",
        logoColor: "#FF6B6B",
        totalBilled: 25000,
        activeInvoices: 0,
    },
    {
        id: "4",
        companyName: "Initech",
        name: "Initech",
        email: "support@initech.com",
        mobile: "+1 555 0104",
        domain: "initech.com",
        logoColor: "#9CA3AF",
        totalBilled: 0,
        activeInvoices: 0,
    },
    {
        id: "5",
        companyName: "Umbrella Corp",
        name: "Umbrella Corp",
        email: "corp@umbrella.com",
        mobile: "+1 555 0105",
        domain: "umbrellacorp.com",
        logoColor: "#E74C3C",
        totalBilled: 50000,
        activeInvoices: 2,
    },
];

export const useClientStore = create<ClientState>((set) => ({
    clients: INITIAL_CLIENTS,
    addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
}));
