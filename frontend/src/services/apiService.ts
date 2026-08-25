export interface CalcResponse {
    result: number;
}

export interface ErrorResponse {
    error: string;
}

export type Operation = 'add' | 'substract' | 'multiply' | 'divide';

export const fetchCalculation = async (a: string, b: string, operation: Operation): Promise<number> => {
    const url = `http://localhost:8080/api/v1/calculate?a=${a}&b=${b}&operation=${operation}`

    try {
        const response = await fetch(url);

        if(!response.ok) {
            const errorData: ErrorResponse = await response.json();

            throw new Error(errorData.error);
        }
        
    
    const data: CalcResponse = await response.json();
    return data.result;
    } catch (error) {
    throw new Error(error instanceof Error? error.message : "Error de conexión con el servidor");
    }
};