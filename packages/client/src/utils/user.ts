export function isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
}

export function login(token: string): boolean {
    localStorage.setItem('token', token);
    return true;
}

export function logout(): boolean {
    localStorage.removeItem('token');
    return true;
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}