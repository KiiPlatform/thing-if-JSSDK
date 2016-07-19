/** Represent a Server Code of Kii Cloud */
export class ServerCode{
    constructor(
        public endpoint: string,
        public executorAccessToken?: string,
        public targetAppID?: string,
        public parameters?: Object
    ){}
}
