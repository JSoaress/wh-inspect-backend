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
    pgm.createTable("plans", {
        id: { type: "uuid", primaryKey: true },
        name: { type: "varchar", notNull: true },
        price: { type: "numeric(15,2)", notNull: true, default: 0 },
        events_month: { type: "integer", notNull: true, default: 0 },
        retention: { type: "integer", notNull: true, default: 0 },
        replay_events: { type: "integer", notNull: true, default: 0 },
        support: { type: "varchar", notNull: true },
        created_at: { type: "timestamp", notNull: true },
        visible: { type: "bool", notNull: true, default: true },
        is_active: { type: "bool", notNull: true, default: true },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("plans");
};
