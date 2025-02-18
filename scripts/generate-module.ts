import * as fs from 'fs';
import * as path from 'path';

export function generateModule(
  moduleDir: string,
  CapitalizedModule: string,
  moduleName: string,
) {
  const moduleContent = `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${CapitalizedModule}Entity } from './entities/${moduleName}.entity';
import { ${CapitalizedModule}Service } from './services/${moduleName}.service';
import { ${CapitalizedModule}Controller } from './controllers/${moduleName}.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${CapitalizedModule}Entity])],
  controllers: [${CapitalizedModule}Controller],
  providers: [${CapitalizedModule}Service],
  exports: [${CapitalizedModule}Service],
})
export class ${CapitalizedModule}Module {}
`;
  fs.writeFileSync(
    path.join(moduleDir, `${moduleName}.module.ts`),
    moduleContent,
  );
}
