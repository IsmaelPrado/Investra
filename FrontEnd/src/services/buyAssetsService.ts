import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Asegúrate de que esta URL sea correcta

export const comprarActivoService = {
    // Método para crear una compra de acción
    async crearCompraAccion(compra: any): Promise<any> {
        const response = await axios.post(`${API_URL}/compras/accion`, compra);
        return response.data;
    },

    // Método para crear una compra de bono
    async crearCompraBono(compra: any): Promise<any> {
        const response = await axios.post(`${API_URL}/compras/bono`, compra);
        return response.data;
    },

    // Método para obtener una compra por ID
    async obtenerCompraPorId(compraId: number): Promise<any> {
        const response = await axios.get(`${API_URL}/compras/${compraId}`);
        return response.data;
    },

    // Método para actualizar el estado de una compra
    async actualizarEstadoCompra(compraId: number, estado: 'vendido' | 'vencido', fecha_venta?: Date): Promise<void> {
        await axios.put(`${API_URL}/compras/${compraId}/estado`, { estado, fecha_venta });
    },

    // Método para obtener todas las compras de un usuario
    async obtenerComprasPorUsuario(usuarioId: number): Promise<any[]> {
        const response = await axios.get(`${API_URL}/compras/usuario/${usuarioId}`);
        return response.data;
    }
};

export const getAssetById = async (id: number) => {
    try {
        const response = await axios.post(`http://localhost:3000/api/activos/${id}`); // Cambia la URL si es necesario
        return response.data; // Retorna los datos del activo
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo obtener el activo.');
    }
};

