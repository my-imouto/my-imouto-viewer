import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const mongooseModule = MongooseModule.forRoot(process.env.MONGODB_URI, { useNewUrlParser: true });

@Module({
  imports: [ mongooseModule ],
  exports: [ mongooseModule ]
})
export class DbModule { }
