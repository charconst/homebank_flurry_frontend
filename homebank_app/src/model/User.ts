export class User {
    creation_timestamp ?: string;
    email ?: string;
    id ?: string;
    name ?: string;
    picture ?: string;

    constructor(jsonObject: any) {
        if (jsonObject && jsonObject["user_data"]) {
            let userData = jsonObject["user_data"]
            this.creation_timestamp = userData["creation_timestamp"];
            this.email = userData["email"];
            this.id = userData["id"];
            this.name = userData["name"];
            this.picture = userData["picture"];
        }
    }
}