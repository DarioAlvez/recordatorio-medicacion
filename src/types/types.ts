//para formatear estructura recordatorio y re utilizarlo

export type Recordatorio = {
    id: string;
    nombreMedicacion: string;
    descripcion: string;
    tiempo: number;
    unidad: 'segundos' | 'minutos' | 'horas';
    notificationId?: string;
};

