import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';

@Controller('reviews')
@ApiTags('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
}
