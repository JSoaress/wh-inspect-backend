/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("webhooks", {
        id: "id",
        project_id: { type: "uuid", notNull: true, references: "projects" },
        received_from: { type: "varchar", notNull: true },
        received_at: { type: "timestamp", notNull: true },
        headers: { type: "json", default: null },
        query: { type: "json", default: null },
        body: { type: "json", notNull: true },
        status_code_sent: { type: "integer", notNull: true, default: 200 },
        replayed_from: { type: "varchar" },
        replayed_at: { type: "timestamp" },
        replay_status: { type: "varchar" },
        target_url: { type: "varchar" },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("webhooks");
};
