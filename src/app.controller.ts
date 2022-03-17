import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('pipeline')
  async applyPipeline() {
    return await this.appService.applyPipeline();
  }

  @Get('store')
  async store() {
    await this.appService.indexData();
    return 'stored!';
  }

  @Get('/find')
  findData() {
    return this.appService.findData();
  }
  @Get('/clear')
  clearData() {
    return this.appService.clearData();
  }
}
