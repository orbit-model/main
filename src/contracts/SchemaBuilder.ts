import Injectable from './Injectable';
import { Schema } from '@orbit/data';

export default interface SchemaBuilder extends Injectable {
  createSchema(): Schema;
}
