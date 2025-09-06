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
    pgm.createTable("subscriptions", {
        id: { type: "uuid", primaryKey: true },
        user_id: { type: "uuid", notNull: true, references: '"users"' },
        plan_id: { type: "uuid", notNull: true, references: '"plans"' },
        price: { type: "numeric(15,2)", notNull: true, default: 0 },
        start_date: { type: "timestamp", notNull: true },
        end_date: { type: "timestamp" },
        payment_method: { type: "varchar", notNull: true },
        last_payment: { type: "timestamp", notNull: true },
        next_payment: { type: "timestamp" },
        max_projects: { type: "integer", notNull: true, default: 0 },
        events_month: { type: "integer", notNull: true, default: 0 },
        retention: { type: "integer", notNull: true, default: 0 },
        replay_events: { type: "bool", notNull: true, default: false },
        support: { type: "varchar", notNull: true },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("subscriptions");
};
