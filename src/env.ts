interface Env {
    client: {
        VITE_API_URL: string;
    };
}

function validateURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function validateEnvVariables(): Env {

    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl || apiUrl.length < 1) {
        throw new Error('VITE_API_URL é obrigatória');
    }

    if (!validateURL(apiUrl)) {
        throw new Error('VITE_API_URL deve ser uma URL válida');
    }

    return {
        client: {
            VITE_API_URL: apiUrl,
        },
    };
}

export const env = validateEnvVariables();