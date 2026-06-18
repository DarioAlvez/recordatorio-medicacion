/**
 * Convierte un intervalo de tiempo (tiempo y unidad) a segundos.
 * Si el tiempo es negativo, retorna 0.
 */
export const calcularIntervaloEnSegundos = (
    tiempo: number,
    unidad: 'segundos' | 'minutos' | 'horas'
): number => {
    if (tiempo < 0) return 0;
    switch (unidad) {
        case 'segundos':
            return tiempo;
        case 'minutos':
            return tiempo * 60;
        case 'horas':
            return tiempo * 3600;
        default:
            return 0;
    }
};
