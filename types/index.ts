export type User = {
    id: string;
    name: string;
    role: string;
    email: string;
    age?: number;
    image_url?: string;
    team?: string[];
    isLoggedIn: boolean;
     sessions?: Session[];
};

export type Session = {
    id: string;
    userId: string;
    loginTime: string;
    logoutTime?: string;
};

export type ChartSession = {
    login: string;
    logout: string;
    duration: number;
    ongoing: boolean;
};
