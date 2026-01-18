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
    pgm.dropTable("project_usage", { ifExists: true, cascade: true });
    pgm.createTable("webhook_usage", {
        id: "id",
        subscriber: { type: "uuid", references: '"users"', notNull: true },
        year_month: { type: "varchar(7)", notNull: true },
        max_events: { type: "integer", notNull: true, default: 0 },
        events_count: { type: "integer", notNull: true, default: 0 },
        updated_at: { type: "datetime" },
    });
    pgm.createConstraint("webhook_usage", "unq_webhook_usage_subscriber_year_month", {
        unique: ["subscriber", "year_month"],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("webhook_usage");
};
