import Container from "./Container";
import DefaultContainer from "./impl/DefaultContainer";
import MigratableContainer from "./MigratableContainer";
import { DefaultModelMetaAccessor } from "@orbit-model/meta";
import {
  DefaultAdapter,
  DefaultRecordSerializer,
  DefaultModelSerializer,
  DefaultRelationshipAdapter
} from "@orbit-model/middleware";
import { DefaultSchemaBuilder } from "@orbit-model/model";
import { DefaultQueryBuilderZero } from "@orbit-model/query";


export default class ApplicationDI {

  private static di: MigratableContainer | null = null;

  public static getDI(): Container {
    if (ApplicationDI.di === null) {
      ApplicationDI.di = new DefaultContainer();
      ApplicationDI.initWithDefaults(ApplicationDI.di);
    }
    return ApplicationDI.di;
  }

  /**
   * Replaces the current container by calling the `migrateTo()` method.
   *
   * This method may be expensive, depending on the number of registered entries in the container.
   *
   * @param di
   */
  public static replaceDI(di: MigratableContainer): void {
    if (ApplicationDI.di !== null) {
      ApplicationDI.di.migrateTo(di);
    }
    ApplicationDI.di = di;
  }

  /**
   * initializes the registry with the default implementations
   */
  private static initWithDefaults(di: Container): void {
    di.register('system', 'queryBuilder', DefaultQueryBuilderZero);
    di.register('system', 'schemaBuilder', DefaultSchemaBuilder, { singleton: true });
    di.register('system', 'modelMetaAccessor', DefaultModelMetaAccessor, { singleton: true });

    di.register('middleware', 'adapter', DefaultAdapter, { singleton: true });
    di.register('middleware', 'recordSerializer', DefaultRecordSerializer, { singleton: true });
    di.register('middleware', 'modelSerializer', DefaultModelSerializer, { singleton: true });
    di.register('middleware', 'relationshipAdapter', DefaultRelationshipAdapter, { singleton: true });
  }

}
