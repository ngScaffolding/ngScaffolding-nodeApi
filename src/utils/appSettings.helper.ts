export function getSetting(name: string, defaultValue: any = null): any {
    return process.env[name] || defaultValue;
}
