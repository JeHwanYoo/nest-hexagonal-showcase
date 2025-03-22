import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { mkdirSync, existsSync, unlinkSync, rmSync } from 'fs'
import { join } from 'path'

export class SqliteContainer {
  private static container: StartedTestContainer
  private static dbPath: string
  private static testDbDir: string

  static async start(): Promise<StartedTestContainer> {
    if (!this.container) {
      this.testDbDir = join(process.cwd(), 'test-db')
      if (!existsSync(this.testDbDir)) {
        mkdirSync(this.testDbDir, { recursive: true })
      }

      this.dbPath = join(this.testDbDir, 'test.db')

      this.container = await new GenericContainer('alpine:latest')
        .withCommand([
          'sh',
          '-c',
          'apk add --no-cache sqlite && tail -f /dev/null',
        ])
        .withBindMounts([
          {
            source: this.testDbDir,
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

  static async cleanup(): Promise<void> {
    try {
      if (this.dbPath && existsSync(this.dbPath)) {
        unlinkSync(this.dbPath)
      }

      const walFile = `${this.dbPath}-wal`
      const shmFile = `${this.dbPath}-shm`

      if (existsSync(walFile)) {
        unlinkSync(walFile)
      }

      if (existsSync(shmFile)) {
        unlinkSync(shmFile)
      }

      if (this.testDbDir && existsSync(this.testDbDir)) {
        rmSync(this.testDbDir, { recursive: true, force: true })
      }

      console.log('Test database files cleaned up')
    } catch (error) {
      console.error('Error cleaning up test database files:', error)
    }
  }

  static async getConnectionOptions() {
    await this.start()

    return {
      dbPath: this.dbPath,
    }
  }
}
