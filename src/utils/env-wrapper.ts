class EnvWrapper {
 
    public port = this.getProperty("port");
    public env_type = this.getProperty("env_type");

    public use_fake_queue = this.toBoolean(this.getProperty('use_fake_queue'))
    public fake_queue_interval = this.toNumber(this.getProperty('fake_queue_interval'))

    public pg = {
        host: this.getProperty("pg_host"),
        port: this.toNumber(this.getProperty("pg_port")),
        username: this.getProperty("pg_username"),
        password: this.getProperty("pg_password"),
        database: this.getProperty("pg_db_name"),
    }

    public orm = {
        synchronize: this.toBoolean(this.getProperty("orm_synchronize")),
        logging: this.toBoolean(this.getProperty("orm_logging"))
    }

    public cert = {
        path: this.getProperty("cert_path"),
        passphrase: this.getProperty("cert_passphrase")
    }

    public sms = {
        smsProvider: this.getProperty("SMS_PROVIDER"),
        d7sms:{
            serverUrl: this.getProperty("D7SMS_SERVER_URL"),
            authorization_token: this.getProperty("D7SMS_AUTHORIZATION_TOKEN"),
            x_rapidapi_key: this.getProperty("D7SMS_X_RAPIDAPI_KEY"),
            x_rapidapi_host: this.getProperty("D7SMS_X_RAPIDAPI_HOST")
        },
    }

    public tiwlio = {
        account_sid: this.getProperty("TWILIO_ACCOUNT_SID"),
        auth_token: this.getProperty("TWILIO_AUTH_TOKEN"),
        number: this.getProperty("TWILIO_NUMBER")
    }

    public log_level = this.getProperty('log_level')
    
 
    private getProperty(property: string): string {
        return process.env[property.toUpperCase()] || process.env[property.toLowerCase()] || "";
    }
 
    private toNumber(value: string): number {
        return +value;
    }
 
    private toBoolean(value: string): boolean {
        return value.toLowerCase() === "true";
    }
 
}
 
export const env = new EnvWrapper();