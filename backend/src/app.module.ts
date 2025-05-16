import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import CustomConfigLoader from "./custom-config/custom-config.service";
import { ConfigModule } from "@nestjs/config";
import { OllamaService } from './ollama/ollama.service';
import { DataProcessingService } from './data-processing/data-processing.service';
import { DatabaseService } from './database/database.service';
import { RagService } from './rag/rag/rag.service';
import { RetrieverService } from './rag/retriever/retriever.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			// @ts-expect-error The typings are wrong
			load: [CustomConfigLoader],
		}),
	],
	controllers: [AppController],
	providers: [AppService, OllamaService, DataProcessingService, DatabaseService, RagService, RetrieverService],
})
export class AppModule {}
