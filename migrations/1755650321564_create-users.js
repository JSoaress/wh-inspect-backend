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
    pgm.createTable("users", {
        id: { type: "uuid", primaryKey: true },
        name: { type: "varchar(50)", notNull: true },
        username: { type: "varchar(20)", notNull: true, unique: true },
        email: { type: "varchar(100)", notNull: true, unique: true },
        password: { type: "varchar", notNull: true },
        cli_token: { type: "varchar" },
        user_token: { type: "varchar" },
        created_at: { type: "timestamp", notNull: true },
        is_active: { type: "bool", notNull: true, default: false },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("users");
};
