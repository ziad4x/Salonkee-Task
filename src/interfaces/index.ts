export interface AuthState {
    user: {
        id: string;
        name: string;
        email: string;
        user_type: string;
        createdAt?: string;
        updatedAt?: string;
    } | null;
    token: string | null;
}

export interface Service {
    id: string | number;
    name: string;
    price: number;
    duration?: number;
}

export interface Employee {
    id: string | number;
    name: string;
    email?: string;
    role?: string;
}

export interface Booking {
    id: string | number;
    customer_name: string;
    customer_phone: string;
    service_id: string | number;
    employee_id: string | number;
    booking_date: string;
    booking_time: string;
}