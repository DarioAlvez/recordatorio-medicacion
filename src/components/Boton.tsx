import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface BotonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Boton: React.FC<BotonProps> = ({ title, variant = 'primary', style, ...props }) => {
    const buttonStyle = [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        style,
    ];

    return (
        <TouchableOpacity style={buttonStyle} {...props}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: '#2563eb',
    },
    secondary: {
        backgroundColor: '#9333ea',
    },
    danger: {
        backgroundColor: '#dc2626',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
});
