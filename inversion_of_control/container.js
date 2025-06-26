/// declarative dependency resolver
/// lazy instantiation
/// works just like a regular object
export class Container {
    constructor() {
        this.services = {};
    }

    service(name, callback) {
        Object.defineProperty(
            this,
            name,
            {
                // this function is run whenever someone tries
                // to get a property from the container
                // lazy: if a dependency is not used anywhere,
                // it is not instantiated either
                get: () => {
                    if (!this.services.hasOwnProperty(name)) {
                        this.services[name] = callback(this);
                    }
                    return this.services[name];
                },
                // make it possible to override declarations
                configurable: true,
                // see what dependencies are declared
                enumerable: true,
            }
        );
        return this;
    }
}