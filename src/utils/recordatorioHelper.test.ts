import { calcularIntervaloEnSegundos } from './recordatorioHelper';

describe('calcularIntervaloEnSegundos', () => {
    it('should calculate seconds correctly', () => {
        expect(calcularIntervaloEnSegundos(10, 'segundos')).toBe(10);
    });

    it('should convert minutes to seconds correctly', () => {
        expect(calcularIntervaloEnSegundos(5, 'minutos')).toBe(300);
    });

    it('should convert hours to seconds correctly', () => {
        expect(calcularIntervaloEnSegundos(2, 'horas')).toBe(7200);
    });

    it('should return 0 for negative time values', () => {
        expect(calcularIntervaloEnSegundos(-5, 'minutos')).toBe(0);
    });
});
