import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class GetReviewDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Review type',
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Reviewable Id',
  })
  @IsNotEmpty()
  reviewableId: number;
}
