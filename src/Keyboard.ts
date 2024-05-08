class Keyboard {
    private keys: { "key": string, "pressed": boolean }[] = [];

    constructor() {
        addEventListener("keydown", this.onKeyPress.bind(this));
        addEventListener("keyup", this.onKeyUp.bind(this));
    }

    private onKeyPress(ev: KeyboardEvent) {
        let key = this.keys.find(k => k.key === ev.key.toLowerCase());
        if (!key) {
            key = { key: ev.key.toLowerCase(), pressed: false };
            this.keys.push(key);
        }
        key.pressed = true;
    }

    private onKeyUp(ev: KeyboardEvent) {
        let key = this.keys.find(k => k.key === ev.key.toLowerCase());
        if (!key) {
            key = { key: ev.key.toLowerCase(), pressed: false };
            this.keys.push(key);
        }
        key.pressed = false;
    }

    public isKeyDown(keyCode: string) {
        const key = this.keys.find(k => k.key.toLowerCase() === keyCode.toLowerCase());
        if (!key) return false;
        return key.pressed;
    }
}

export const keyboard = new Keyboard();