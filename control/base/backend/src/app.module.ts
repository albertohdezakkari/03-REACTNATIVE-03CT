import { Module, Controller, Get } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
@Controller("salud")
class SaludController { @Get() get(){ return { estado: "ok", entorno: "local" }; } }
@Module({
 imports: [TypeOrmModule.forRoot({
  type: "postgres", host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "control_databridge",
  autoLoadEntities: true, synchronize: true,
 })],
 controllers: [SaludController],
})
export class AppModule {}
