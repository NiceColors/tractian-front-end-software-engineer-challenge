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
    
    const appUrl = import.meta.env.VITE_APP_URL;
    if (!appUrl) {
        throw new Error('VITE_APP_URL é obrigatória');
    }
    if (!validateURL(appUrl)) {
        throw new Error('VITE_APP_URL deve ser uma URL válida');
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl || apiUrl.length < 1) {
        throw new Error('VITE_API_URL é obrigatória');
    }

    return {
        client: {
            VITE_API_URL: apiUrl,
        },
    };
}

export const env = validateEnvVariables();