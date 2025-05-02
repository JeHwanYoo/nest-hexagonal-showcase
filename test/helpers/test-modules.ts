import { AppModule } from '@/app.module'
import { Test, TestingModule } from '@nestjs/testing'
import {
  StartedTestContainer,
  StoppedTestContainer,
  TestContainer,
} from 'testcontainers'
import { v7 as uuidv7 } from 'uuid'

export interface TestContainerLaunchTemplates {
  containerDefinition: TestContainer
  onStart: (instance: StartedTestContainer) => Promise<void>
  onReset: (instance: StartedTestContainer) => Promise<void>
}

interface LaunchedTestContainer {
  instance: StartedTestContainer
  resetInstance: () => Promise<void>
}

interface TestModuleOptions {
  launchTemplates: TestContainerLaunchTemplates[]
}

export class TestModuleFactory {
  private static containers = new Map<string, LaunchedTestContainer>()

  /**
   * Create a new test app instance
   * @param options - The options for the test app instance
   * @returns The testing module
   */
  static async create(options?: TestModuleOptions): Promise<TestingModule> {
    const groupId = uuidv7()

    if (options?.launchTemplates) {
      const results = await Promise.all(
        options.launchTemplates.map(t => t.containerDefinition.start()),
      )

      for (const [index, instance] of results.entries()) {
        const uniqueContainerKey = `${groupId}-${index}`
        await options.launchTemplates[index].onStart(instance)
        this.containers.set(uniqueContainerKey, {
          instance,
          resetInstance: instance.stop.bind(instance) as () => Promise<void>,
        })
      }
    }

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    return module
  }

  /**
   * Reset all test module instances (ensuring idempotence)
   */
  static resetAllInstances(): Promise<void[]> {
    return Promise.all(
      Array.from(this.containers.values()).map(container =>
        container.resetInstance(),
      ),
    )
  }

  /**
   * Cleanup all test container instances
   * @returns The stopped test containers
   */
  static cleanupAllInstances(): Promise<StoppedTestContainer[]> {
    return Promise.all(
      Array.from(this.containers.values()).map(container =>
        container.instance.stop(),
      ),
    )
  }

  /**
   * Get the environment key for the test app instance
   * @param envKeyPrefix - The prefix of the environment key
   * @param uniqueId - The unique id of the test app instance
   * @returns The environment key for the test app instance
   */
  static getUniqueEnvKey(envKeyPrefix: string, uniqueId: string): string {
    return `${envKeyPrefix}_${uniqueId}`
  }
}
