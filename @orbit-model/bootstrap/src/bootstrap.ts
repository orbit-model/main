import { DI } from "@orbit-model/di";
import DefaultBranch from "@orbit-model/branch";
import {
  DefaultAdapter,
  DefaultModelSerializer,
  DefaultRecordSerializer,
  DefaultRelationshipAdapter,
} from "@orbit-model/middleware";
import { DefaultModelMetaAccessor } from "@orbit-model/meta";
import { DefaultSchemaBuilder } from "@orbit-model/model";
import { DefaultQueryBuilderZero } from "@orbit-model/query";

DI.register("system", "Branch", DefaultBranch);

DI.register("system", "Adapter", DefaultAdapter);
DI.register("system", "ModelSerializer", DefaultModelSerializer);
DI.register("system", "RecordSerializer", DefaultRecordSerializer);
DI.register("system", "RelationshipAdapter", DefaultRelationshipAdapter);

DI.register("system", "ModelMetaAccessor", DefaultModelMetaAccessor);

DI.register("system", "SchemaBuilder", DefaultSchemaBuilder);

DI.register("system", "QueryBuilder", DefaultQueryBuilderZero);
