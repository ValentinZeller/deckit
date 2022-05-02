export class AbortManager {
    constructor() {
        if (AbortManager._instance) {
            return AbortManager._instance;
        }
        AbortManager._instance = this;
        this.controller = new AbortController();
    }

    abort() {
        this.controller.abort();
        this.controller = new AbortController();
    }
}