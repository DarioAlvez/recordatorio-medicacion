import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Boton } from './Boton';

describe('Boton Component', () => {
    it('renders correctly with given title', async () => {
        const { getByText } = await render(<Boton title="Presionar" />);
        expect(getByText('Presionar')).toBeTruthy();
    });

    it('calls onPress when clicked', async () => {
        const onPressMock = jest.fn();
        const { getByText } = await render(<Boton title="Presionar" onPress={onPressMock} />);
        await fireEvent.press(getByText('Presionar'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});
