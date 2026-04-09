import { LoggerService } from '@app/logger';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { departmentsNestedDbSeed } from '.';
import { DepartmentType } from '../enums';
import { Department } from '@app/account/entities/department.entity';

@Injectable()
export class DepartmentSeeder {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly loggerService: LoggerService,
  ) {}

  async seed() {
    try {
      for (const deptData of departmentsNestedDbSeed) {
        await this.upsertDepartment(deptData);
      }
      this.loggerService.log('Seeding completed successfully');
    } catch (e: any) {
      this.loggerService.error('Error in seeds:', e);
    }
  }

  /**
   * Recursive function to handle any depth of departments
   */
  private async upsertDepartment(
    data: (typeof departmentsNestedDbSeed)[number],
    parentId: number | null = null,
  ) {
    let department = await this.departmentRepository.findOne({
      where: { name: data.name },
    });

    if (department) {
      Object.assign(department, {
        type: data.type,
        parentId,
      });
    } else {
      department = this.departmentRepository.create({
        name: data.name,
        departmentType: data.type as DepartmentType,
        parentId: parentId,
        uuid: uuidv4(),
      });
    }
    const savedDept = await this.departmentRepository.save(department);
    if (data.children) {
      const incomingChildNames = data.children.map((c) => c.name);
      const existingChildren = await this.departmentRepository.find({
        where: { parentId: savedDept.id },
      });

      const toDelete = existingChildren.filter(
        (c) => !incomingChildNames.includes(c.name),
      );
      if (toDelete.length > 0) {
        // await this.departmentRepository.remove(toDelete);
      }
      for (const childData of data.children) {
        await this.upsertDepartment(
          childData as (typeof departmentsNestedDbSeed)[number],
          savedDept.id,
        );
      }
    }
  }
}
