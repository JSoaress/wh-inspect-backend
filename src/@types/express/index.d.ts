/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
    export interface Request {
        requestUser: import("@/app/users/domain/models/user").User;
    }
}
