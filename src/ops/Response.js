"use strict";
var Response = (function () {
    function Response(status, body, headers) {
        this.status = status;
        this.body = body;
        this.headers = headers;
    }
    Response.prototype.isSucceeded = function () {
        if (this.status >= 200 && this.status < 300) {
            return true;
        }
        return false;
    };
    return Response;
}());
exports.Response = Response;
