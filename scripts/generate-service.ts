import * as fs from 'fs';
import * as path from 'path';

export function generateService(
  moduleDir: string,
  CapitalizedModule: string,
  moduleName: string,
) {
  const serviceDir = path.join(moduleDir, 'services');
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir);
  }

  const serviceTemplate = `
   import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, HttpStatus } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { Create${CapitalizedModule}Dto } from '../dtos/create-${moduleName}.dto';
   import { Update${CapitalizedModule}Dto } from '../dtos/update-${moduleName}.dto';
   import { ${CapitalizedModule}Entity } from '../entities/${moduleName}.entity';
   import { Query${CapitalizedModule}Dto } from '../dtos/query-${moduleName}.dto';
   import { throwError } from '../../../common/errors/errors.function';
   
   @Injectable()
   export class ${CapitalizedModule}Service {
   
     constructor(
       @InjectRepository(${CapitalizedModule}Entity)
       private ${CapitalizedModule}Repository: Repository<${CapitalizedModule}Entity>,
     ) {
     }
   
     async create(createDto: Create${CapitalizedModule}Dto) {
      //  return await this.${CapitalizedModule}Repository.save(createDto);
     }
   
     async findAll(queryDto: Query${CapitalizedModule}Dto) {
      const { perPage,  currentPage} = queryDto;
       return await this.${CapitalizedModule}Repository.find({
          take: perPage,
          skip: perPage * currentPage,
       })
     }
   
     async findOne(id: number) {
       const data = await this.${CapitalizedModule}Repository.findOne({
          where: { id },
       })
       if (!data) {
         throwError(HttpStatus.NOT_FOUND, [], '${moduleName} Not deleted');
       }
       return data;
     }
   
     async update(id: number, updateDto: Update${CapitalizedModule}Dto) {
      //  if (!Object.keys(updateDto).length) {
      //    throw new BadRequestException('must have a property');
      //  }
      //  const updated = await this.updateById(id, updateDto);
      //  if (!updated) {
      //    throw new InternalServerErrorException('update failed');
      //  }
      //  return updated;
     }
   
     async remove(id: number) {
      const delete${CapitalizedModule} = await this.${CapitalizedModule}Repository.delete({ id });
      // if not deleted, throw error
      if (!delete${CapitalizedModule}.affected) {
        throwError(HttpStatus.BAD_REQUEST, [], '${CapitalizedModule} Not deleted');
      }
      return {
        success: true,
        message: '${CapitalizedModule} deleted successfully',
      }
     }
   }
   `;

  fs.writeFileSync(
    path.join(serviceDir, `${moduleName}.service.ts`),
    serviceTemplate,
  );
}
