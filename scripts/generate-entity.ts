import * as fs from 'fs';
import * as path from 'path';

export function generateEntity(
  moduleDir: string,
  CapitalizedModule: string,
  moduleName: string,
) {
  const entityDir = path.join(moduleDir, 'entities');
  if (!fs.existsSync(entityDir)) {
    fs.mkdirSync(entityDir);
  }

  // Generate Entity
  const entityContent = `
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
  import { BaseEntity } from '../../../common/entities/base.entity';

  @Entity('${moduleName}')
  export class ${CapitalizedModule}Entity extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;
  }
 `;
  fs.writeFileSync(
    path.join(entityDir, `${moduleName}.entity.ts`),
    entityContent,
  );
}
