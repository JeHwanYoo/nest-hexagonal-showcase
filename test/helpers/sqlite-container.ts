import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export class SqliteContainer {
  private static container: StartedTestContainer
  private static dbPath: string

  static async start(): Promise<StartedTestContainer> {
    if (!this.container) {
      const testDbDir = join(process.cwd(), 'test-db')
      if (!existsSync(testDbDir)) {
        mkdirSync(testDbDir, { recursive: true })
      }

      this.dbPath = join(testDbDir, 'test.db')

      this.container = await new GenericContainer('alpine:latest')
        .withCommand([
          'sh',
          '-c',
          'apk add --no-cache sqlite && tail -f /dev/null',
        ])
        .withBindMounts([
          {
            source: testDbDir,
            target: '/data',
            mode: 'rw',
          },
        ])
        .start()

      await this.container.exec([
        'sqlite3',
        '/data/test.db',
        'PRAGMA journal_mode=WAL;',
      ])

      console.log('SQLite container started')
    }

    return this.container
  }

  static async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop()
      console.log('SQLite container stopped')
    }
  }

  static async getConnectionOptions() {
    await this.start()

    return {
      // 실제로는 호스트 시스템의 파일 경로를 반환
      dbPath: this.dbPath,
    }
  }
}
