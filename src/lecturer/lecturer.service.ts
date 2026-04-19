import { Injectable, NotFoundException } from '@nestjs/common';
import { LecturerRepository } from './lecturer.repository';
import { BaseService } from '@app/core/base/base.service';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from '@app/account/entities/department.entity';
import { Lecturer } from '@app/account/entities/lecturer.entity';

@Injectable()
export class LecturerService extends BaseService<Lecturer> {
  constructor(private readonly lecturerRepository: LecturerRepository) {
    super(lecturerRepository);
  }

  async findAll(filterOptions: any = {}, paginationOptions: any = {}) {
    const [data, totalCount] = await this.lecturerRepository.findAll(
      filterOptions,
      paginationOptions,
    );
    console.log('Data retrieved from repository:', data); // Debug log to check retrieved data
    return { data, totalCount };
  }

  async findOne(id: number): Promise<Lecturer> {
    const lecturer = await this.lecturerRepository.findOne({
      where: { id: id as any },
      relations: ['parent', 'institution', 'account', 'children'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${id} not found`);
    }
    return lecturer;
  }

  // async update(id: number, data: UpdateDepartmentDto): Promise<any> {
  //   return this.lecturerRepository.update(id, data);
  // }

  async remove(id: number) {
    return this.lecturerRepository.delete(id);
  }
}
