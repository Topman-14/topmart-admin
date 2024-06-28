import { useState, useEffect } from 'react';

type UserSettings = {
    [key: string]: string | number | boolean;
};

const useLocalSettings = (): {
    userSettings: UserSettings | null;
    setUserSetting: (key: string, value: string | number | boolean) => void;
} => {
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

    useEffect(() => {
        const storedSettings = localStorage.getItem('userSettings');
        if (storedSettings) {
            setUserSettings(JSON.parse(storedSettings));
        }
    }, []);
    
    const setUserSetting = (key: string, value: string | number | boolean): void => {
        console.log("userSettings", userSettings)
        const updatedSettings = {
            ...userSettings,
            [key]: value,
        };
        setUserSettings(updatedSettings);
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    };

    return {
        userSettings,
        setUserSetting,
    };
};

export default useLocalSettings;