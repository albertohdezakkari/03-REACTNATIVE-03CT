import { Module, Controller, Get } from "@nestjs/common";
@Controller("salud")
class SaludController {
  @Get() salud() { return { estado: "ok", etapa: "base-neutral" }; }
}
@Module({ controllers: [SaludController] })
export class AppModule {}
