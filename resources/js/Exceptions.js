class ExceptionCustomerDoesNotExist extends Error {
    constructor(msg) {
        super(msg),
        this.name = "CustomerDoesNotExist"
    }
}
class ExceptionResponseDataNotPresent extends Error {
    constructor(msg) {
        super(msg),
        this.name = "ResponseDataNotPresent"
    }
}
export default {
    ExceptionCustomerDoesNotExist,
    ExceptionResponseDataNotPresent
}
