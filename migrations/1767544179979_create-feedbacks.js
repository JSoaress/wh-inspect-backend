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
    pgm.createTable("feedbacks", {
        id: { type: "uuid", primaryKey: true },
        user_id: { type: "uuid", notNull: true, references: '"users"' },
        type: { type: "varchar(20)", notNull: true },
        application: { type: "varchar(10)", notNull: true },
        title: { type: "varchar(120)", notNull: true },
        description: { type: "text" },
        status: { type: "varchar(10)", notNull: true },
        priority: { type: "varchar(10)", notNull: true },
        page_url: { type: "text" },
        user_agent: { type: "text" },
        answer: { type: "text" },
        created_at: { type: "timestamp", notNull: true },
        updated_at: { type: "timestamp" },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("feedbacks");
};
