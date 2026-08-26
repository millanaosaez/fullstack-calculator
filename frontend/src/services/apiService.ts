export interface CalcResponse {
    result: number;
}

export interface ErrorResponse {
    error: string;
}

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'exponentiate' | 'sqrt' | 'percentage';

export const fetchCalculation = async (a: string, b: string, operation: Operation): Promise<number> => {
    const isUnary= operation === 'sqrt' || operation === 'percentage'
    const url = isUnary
        ? `http://localhost:8080/api/v1/calculate?a=${a}&operation=${operation}`
        : `http://localhost:8080/api/v1/calculate?a=${a}&b=${b}&operation=${operation}`;

     try {
        const response = await fetch(url);

        if (!response.ok) {
            let errorMessage = 'Server error';
            try {
                const errorData: ErrorResponse = await response.json();
                errorMessage = errorData.error;
            } catch {
                // Response wasn't valid JSON (e.g. HTML from a proxy/gateway error)
                errorMessage = `Server error (${response.status})`;
            }
            throw new Error(errorMessage);
        }

        const data: CalcResponse = await response.json();
        return data.result;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Server connection error");
    }
};