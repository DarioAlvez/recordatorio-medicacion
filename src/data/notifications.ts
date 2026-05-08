import * as Notifications from 'expo-notifications';

export const pedirPermisosNotificaciones =
    async () => {

        const { status } =
            await Notifications.requestPermissionsAsync();

        if (status !== 'granted') {

            alert(
                'Debes permitir notificaciones para usar recordatorios'
            );

            return false;
        }

        return true;
    };

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false
    })
});

export const programarNotificacion = async (
    nombreMedicacion: string,
    tiempo: number,
    unidad: string
) => {
    let segundos = tiempo;

    if (unidad === 'minutos') {
        segundos = tiempo * 60;
    }

    if (unidad === 'horas') {
        segundos = tiempo * 3600;
    }

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Recordatorio de medicación',
            body: `Tomar ${nombreMedicacion}`
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: segundos
        }
    });



    return id;
};
export const cancelarNotificacion =
    async (notificationId: string) => {

        try {

            await Notifications.cancelScheduledNotificationAsync(
                notificationId
            );

        } catch (error) {

            console.log(
                'Error al cancelar notificación',
                error
            );

        }

    };