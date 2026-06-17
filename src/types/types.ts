export type Recordatorio = {
    id: string;
    nombreMedicacion: string;
    descripcion: string;
    tiempo: number;
    unidad: 'segundos' | 'minutos' | 'horas';
    notificationId?: string;
    foto?: string;
};

export type Farmacia = {
    id: string;
    nombre: string; 
    direccion: string;
    telefono: string;
    ubicacion: {
        latitude: number;
        longitude: number;
    };
    createdAt: string;
    
};

export type UbicacionActual = {
    latitude: number;
    longitude: number;
};

