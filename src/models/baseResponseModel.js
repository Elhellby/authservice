class BaseResponse {
    constructor(success, message, data,time_elapsed) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
module.exports=BaseResponse;