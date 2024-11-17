// src/components/InversionesList.tsx
import React, { useEffect, useState } from 'react';
import { Investment, obtenerInversionesPorUsuario } from '../../services/api';

interface InversionesListProps {
    usuarioId: number;
}

const InversionesList: React.FC<InversionesListProps> = ({ usuarioId }) => {
    const [inversiones, setInversiones] = useState<Investment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInversiones = async () => {
            try {
                const data = await obtenerInversionesPorUsuario(usuarioId);
                setInversiones(data);
            } catch (err) {
                setError('Error al obtener las inversiones.');
            } finally {
                setLoading(false);
            }
        };

        fetchInversiones();
    }, [usuarioId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Mis Inversiones</h2>
            <ul>
                {inversiones.map((inversion) => (
                    <li key={inversion.id}>
                        Activo ID: {inversion.activo_id}, Cantidad: {inversion.cantidad}, Precio Compra: {inversion.precio_compra}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InversionesList;
