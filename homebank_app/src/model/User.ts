export class User {
    creation_timestamp ?: string;
    email ?: string;
    id ?: string;
    name ?: string;
    picture ?: string;
    is_admin ?: boolean;

    constructor(jsonObject: any) {
        if (jsonObject && jsonObject["user_data"]) {
            let userData = jsonObject["user_data"]
            this.creation_timestamp = userData["creation_timestamp"];
            this.email = userData["email"];
            this.id = userData["id"];
            this.name = userData["name"];
            this.picture = userData["picture"];
            this.is_admin = userData["is_admin"];
        }
    }
}