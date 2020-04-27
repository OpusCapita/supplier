class Middlewares {
    static provideStringDescriptor(shouldHaveStringDescriptor = false) {
        return (req, res, next) => {
            req.params.provideSringDescriptor = shouldHaveStringDescriptor
            next();
        };
    }
}

module.exports = Middlewares;
