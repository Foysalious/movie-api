import { ApiProperty } from "@nestjs/swagger"
import { BaseEntity, Entity, ObjectIdColumn } from "typeorm"
@Entity('users')
export class Movie extends BaseEntity {
    @ObjectIdColumn()
    _id: string;
    
    @ApiProperty()
    user_id: string

    @ApiProperty()
    movie_name: string

    @ApiProperty()
    genre: string

    @ApiProperty()
    image: string
}
