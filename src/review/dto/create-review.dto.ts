import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateReviewDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Review type',
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Review Status',
  })
  @IsOptional()
  status: boolean;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Review Discussion',
  })
  @IsNotEmpty()
  discussion: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Reviewer Position',
  })
  @IsOptional()
  reviewerPosition: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Revieweable ID',
  })
  @IsNotEmpty()
  reviewableId: number;
}
