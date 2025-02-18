import * as fs from 'fs';
import * as path from 'path';

export function generateController(
  moduleDir: string,
  CapitalizedModule: string,
  moduleName: string,
) {
  const camelCaseModule =
    CapitalizedModule.charAt(0).toLowerCase() + CapitalizedModule.slice(1);

  const controllerDir = path.join(moduleDir, 'controllers');
  if (!fs.existsSync(controllerDir)) {
    fs.mkdirSync(controllerDir);
  }

  const controllerContent = `
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ${CapitalizedModule}Service } from '../services/${moduleName}.service';
import { Create${CapitalizedModule}Dto } from '../dtos/create-${moduleName}.dto';
import { Update${CapitalizedModule}Dto } from '../dtos/update-${moduleName}.dto';
import { Query${CapitalizedModule}Dto } from '../dtos/query-${moduleName}.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { throwError } from '../../../common/errors/errors.function';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('${CapitalizedModule}')
@Controller('${moduleName}')
export class ${CapitalizedModule}Controller {
  constructor(private readonly ${camelCaseModule}Service: ${CapitalizedModule}Service) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: Create${CapitalizedModule}Dto) {
    try {
      const data = await this.${camelCaseModule}Service.create(createDto);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() queryDto: Query${CapitalizedModule}Dto) {
    try {
      return await this.${camelCaseModule}Service.findAll(queryDto);
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.${camelCaseModule}Service.findOne(id);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: Update${CapitalizedModule}Dto) {
    try {
      const data = await this.${camelCaseModule}Service.update(id, updateDto);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.${camelCaseModule}Service.remove(id);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }
}
`;
  fs.writeFileSync(
    path.join(controllerDir, `${moduleName}.controller.ts`),
    controllerContent,
  );
}
